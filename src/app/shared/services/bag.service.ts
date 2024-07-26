import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { TelegramApiService } from './telegram-api.service';
import { Bag, File as MyFile } from '../../shared/models/content.models';
import { FileState } from '../enums/content.enums';
import { firstValueFrom, lastValueFrom, of, tap } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { FilePart, NewFileRequest } from '../interfaces/http-interfaces';
import { CryptoService } from './crypto.service';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BlobUtils } from '../utils/blob.utils';
import { Message, TelegramResponse } from '../interfaces/telegram-interfaces';

@Injectable({
    providedIn: 'root'
})
export class BagService {
    highestIndex: number = 1;


    constructor(private backend: BackendApiService, private telegram: TelegramApiService, private crypto: CryptoService) { }

    deleteBag(element: ElementToEdit) {
        return this.backend.deleteBag(element);
    }

    deleteFile(element: ElementToEdit) {
        return this.backend.deleteFile(element);
    }

    createBag(parentId: number, name: string) {
        return this.backend.createBag(parentId, name);
    }

    changeBagName(element: ElementToEdit) {
        return this.backend.changeBagName(element);
    }
    changeFileName(element: ElementToEdit) {
        return this.backend.changeFileName(element);
    }

    async addFile(parentId: number,newFile: MyFile, file: File) {
        const slicedBlob: Blob[] = this.sliceBlob(file);
        const encryptedBlobs: Blob[] = await this.encryptBlobs(slicedBlob);
        newFile.state = FileState.UPLOAD;

        const newFileRequest: NewFileRequest = { bagId: parentId, name: file.name, extension: BlobUtils.getExtensionFromName(file.name), size: file.size, fileParts: [] };
        const fileParts: FilePart[] = await this.sendBlobs(encryptedBlobs, newFile);
        newFileRequest.fileParts = fileParts;
        const serverResponse = await firstValueFrom(this.backend.addNewFile(newFileRequest));
        if (serverResponse.status !== 200) {
            console.log("Fail in sending file to backend: ");
            console.log(serverResponse);
            throw new Error("Fail in sending file, try again.");
        }
        newFile.id = serverResponse.body!.id!;
        newFile.create = serverResponse.body?.create!;
        newFile.fileParts = serverResponse.body?.fileParts!;
        newFile.state = FileState.READY;
    }

    async downloadFile(file: MyFile) {
        file.state = FileState.DOWNLOAD;
        let downloadedBlobs = await this.downloadBlobs(file.fileParts, file);
        file.state = FileState.DECRYPT;
        let decryptedBlobs = await this.decryptBlobs(downloadedBlobs);
        file.state = FileState.DONE;
        file.url = URL.createObjectURL(new Blob(decryptedBlobs));
    }

    private async sendBlobs(blobs: Blob[], file: MyFile): Promise<FilePart[]> {
        let entireSize = 0;
        blobs.forEach(e => entireSize += e.size);
        let prevProgress = 0;
        let currProggres = 0;

        file.progress = 0;
        const fileParts: FilePart[] = [];
        for (let i = 0; i < blobs.length; i++) {
            const response = await lastValueFrom(this.telegram.sendBlob(blobs[i]).pipe(tap(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    currProggres = event.loaded;
                    file.progress = Math.floor(((currProggres + prevProgress) / entireSize) * 100);
                }
                if (event.type === HttpEventType.Sent)
                    prevProgress += currProggres;

            })));
            const responseAs = response as HttpResponse<TelegramResponse<Message>>;
            if (!responseAs.body!.ok) {
                console.log("Fail in sending file to telegram: ");
                console.log(responseAs);
                throw new Error("Fail in sending file, try again.");
            }
            const filePart: FilePart = { order: (i + 1), fileId: responseAs.body!.result.document.file_id, size: blobs[i].size };
            fileParts.push(filePart);
        }
        return fileParts;
    }

    private sliceBlob(blob: Blob): Blob[] {
        console.log("Kroje na kawałki plik...");
        const slicedBlob: Blob[] = BlobUtils.sliceBlob(blob);
        console.log("Pokroiłem na kawałki, ilość: " + slicedBlob.length);
        return slicedBlob;
    }


    private async downloadBlobs(fileParts: FilePart[], myFile: MyFile): Promise<Blob[]> {
        let downloadedBlobs: Blob[] = [];
        let entireSize = 0;
        fileParts.forEach(e => entireSize += e.size);
        let prevProgress = 0;
        let currProggres = 0;

        myFile.progress = 0;
        for (let file of fileParts) {
            let fileUrl = await lastValueFrom(this.telegram.getFilePath(file.fileId));
            let blob = await lastValueFrom(this.telegram.downloadBlob(fileUrl.result.file_path).pipe(tap(event => {
                if (event.type === HttpEventType.DownloadProgress) {
                    currProggres = event.loaded;
                    myFile.progress = Math.floor(((currProggres + prevProgress) / entireSize) * 100);
                }
                if (event.type === HttpEventType.Response)
                    prevProgress += currProggres;
            })));
            let blobResponse = blob as HttpResponse<Blob>;
            downloadedBlobs.push(blobResponse.body!);
        }

        return downloadedBlobs;
    }

    private async encryptBlobs(slicedBlobs: Blob[]): Promise<Blob[]> {
        const encryptedBlobs: Blob[] = [];
        console.log("Szyfruję kawałki...");
        for (let i = 0; i < slicedBlobs.length; i++) {
            const arr = await this.crypto.encrypt(await slicedBlobs[i].arrayBuffer());
            encryptedBlobs.push(new Blob([arr]));
            console.log("Pozostało: " + (slicedBlobs.length - i) + " kawałków");
        }
        console.log("Zaszyfrowałem wszystkie kawałki.");
        return encryptedBlobs;
    }

    private async decryptBlobs(slicedBlobs: Blob[]): Promise<Blob[]> {
        const decryptedBlobs: Blob[] = [];
        console.log("Odszyfrowuję kawałki...");
        for (let i = 0; i < slicedBlobs.length; i++) {
            const arr = await this.crypto.decrypt(await slicedBlobs[i].arrayBuffer());
            decryptedBlobs.push(new Blob([arr]));
            console.log("Pozostało: " + (slicedBlobs.length - i) + " kawałków");
        }
        console.log("Odszyfrowałem wszystkie kawałki.");
        return decryptedBlobs;
    }


    focusElement(element: HTMLElement) {
        element.style.zIndex = `${this.highestIndex++}`;
        element.style.backgroundColor = `var(--bag-color-focus)`;
    }

    focusOnlyElement(element: HTMLElement) {
        element.style.backgroundColor = `var(--bag-color-focus)`;
    }

    unfocusElement(element: HTMLElement) {
        element.style.backgroundColor = `var(--bag-color)`;
    }


}
