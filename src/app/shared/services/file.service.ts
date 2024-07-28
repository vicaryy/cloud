import { Injectable } from '@angular/core';
import { TelegramApiService } from './telegram-api.service';
import { Bag, MyFile } from '../models/content.models';
import { BlobUtils } from '../utils/blob.utils';
import { State } from '../enums/content.enums';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BackendApiService } from './backend-api.service';
import { CryptoService } from './crypto.service';
import { from, lastValueFrom, of, switchMap, tap } from 'rxjs';
import { FilePart, NewFileRequest } from '../interfaces/http-interfaces';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Message, TelegramResponse } from '../interfaces/telegram-interfaces';
import { InfoService } from './info.service';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private telegram: TelegramApiService, private backend: BackendApiService, private crypto: CryptoService, private info: InfoService) { }

    deleteFile(element: ElementToEdit) {
        return this.backend.deleteFile(element);
    }

    changeFileName(element: ElementToEdit) {
        return this.backend.changeFileName(element);
    }

    async downloadFile(file: MyFile) {
        try {
            await this.downloadBlobs(file);
        } catch (error) {
            file.state = State.ERROR;
            console.log("Error in downloading file", error);

            this.info.displayError("Fail in downloading file, try again");
        }
    }

    private async downloadBlobs(file: MyFile) {
        file.state = State.DOWNLOAD;
        if (!file.downloadState.entireSize)
            file.fileParts.forEach(e => file.downloadState.entireSize! += e.size);
        if (!file.downloadState.prevProgress)
            file.downloadState.prevProgress = 0;
        let currProggres = 0;

        while (file.fileParts.length > 0) {
            const f = file.fileParts[0];
            let fileUrl = await lastValueFrom(this.telegram.getFilePath(f.fileId));
            let blob = await lastValueFrom(this.telegram.downloadBlob(fileUrl.result.file_path).pipe(tap(event => {
                if (event.type === HttpEventType.DownloadProgress) {
                    currProggres = event.loaded;
                    file.progress = Math.floor(((currProggres + file.downloadState.prevProgress!) / file.downloadState.entireSize!) * 100);
                }
                if (event.type === HttpEventType.Response)
                    file.downloadState.prevProgress! += currProggres;
            })));
            let blobResponse = blob as HttpResponse<Blob>;
            file.downloadState.downloadedBlobs!.push(blobResponse.body!);
            file.fileParts.shift();
        }
        file.downloadState.downloaded = true;
        await this.decryptBlobs(file);
    }

    private async decryptBlobs(file: MyFile) {
        file.state = State.DECRYPT;
        console.log("Odszyfrowuję kawałki...");

        while (file.downloadState.downloadedBlobs!.length > 0) {
                const doBlob = file.downloadState.downloadedBlobs![0];
                const arr = await this.crypto.decrypt(await doBlob.arrayBuffer());
                if (!file.downloadState.decryptedBlobs)
                    file.downloadState.decryptedBlobs = [];
                file.downloadState.decryptedBlobs.push(new Blob([arr]));
                file.downloadState.downloadedBlobs!.shift();
                console.log("Pozostało: " + (file.downloadState.decryptedBlobs) + " kawałków");
        }
        console.log("Odszyfrowałem wszystkie kawałki.");
        file.downloadState.decrypted = true;
        await this.createDownloadUrl(file);
    }

    private async createDownloadUrl(file: MyFile) {
        file.url = URL.createObjectURL(new Blob(file.downloadState.decryptedBlobs));
        file.state = State.DONE;
        file.downloadState = {};
        file.progress = 0;
    }

   async addFile(fileInput: HTMLInputElement, parentBag: Bag) {
        if (!fileInput.files)
            return;
        const file: File = fileInput.files[0];

        const newFile: MyFile = this.createNewFile(file, parentBag);
        parentBag.files.push(newFile);
        try {
            await this.uploadFile(newFile);
        } catch (error) {
            newFile.state = State.ERROR;
            console.log("Error in adding file", error);
            this.info.displayError("Fail in uploading file, try again");
        }
    }

    private async uploadFile(file: MyFile) {
        await this.sliceBlob(file);
    }

    private async sliceBlob(file: MyFile) {
        console.log("Kroje na kawałki plik...");
        const slicedBlob = BlobUtils.sliceBlob(file.blob!);
        file.uploadState.slicedBlobs = slicedBlob;
        console.log("Pokroiłem na kawałki, ilość: " + slicedBlob.length);
        file.uploadState.sliced = true;
        await this.encryptBlobs(file);
    }

    private async encryptBlobs(file: MyFile) {
        file.state = State.ENCRYPT;
        console.log("Szyfruję kawałki...");

        while (file.uploadState.slicedBlobs!.length > 0) {
            const slBlob = file.uploadState.slicedBlobs![0];

            const arr = await this.crypto.encrypt(await slBlob.arrayBuffer());

            if (!file.uploadState.encryptedBlobs)
                file.uploadState.encryptedBlobs = [];
            file.uploadState.encryptedBlobs.push(new Blob([arr]));
            file.uploadState.slicedBlobs!.shift();
            console.log("Pozostało: " + (file.uploadState.slicedBlobs!.length) + " kawałków");
        }
        console.log("Zaszyfrowałem wszystkie kawałki.");
        file.uploadState.encrypted = true;
        await this.sendBlobs(file);
    }


    private async sendBlobs(file: MyFile) {
        file.state = State.UPLOAD;
        if (!file.uploadState.entireSize) {
            file.uploadState.entireSize = 0;
            file.uploadState.encryptedBlobs!.forEach(e => file.uploadState.entireSize! += e.size);
        }
        if (!file.uploadState.prevProgress)
            file.uploadState.prevProgress = 0;
        let currProggres = 0;

        while (file.uploadState.encryptedBlobs!.length > 0) {
            const enBlob = file.uploadState.encryptedBlobs![0];

            const response = await lastValueFrom(this.telegram.sendBlob(enBlob).pipe(tap(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    currProggres = event.loaded;
                    file.progress = Math.floor(((currProggres + file.uploadState.prevProgress!) / file.uploadState.entireSize!) * 100);

                }
                if (event.type === HttpEventType.Sent)
                    file.uploadState.prevProgress! += currProggres;

            })));
            const responseAs = response as HttpResponse<TelegramResponse<Message>>;
            if (!responseAs.ok && !responseAs.body!.ok) {
                console.log("Fail in sending blob: ");
                console.log(responseAs);
                throw new Error("Fail in uploading file, try again");
            }
            const filePart: FilePart = { order: file.fileParts.length + 1, fileId: responseAs.body!.result.document.file_id, size: enBlob.size };
            file.fileParts.push(filePart);
            file.uploadState.encryptedBlobs?.shift()
        }
        file.uploadState.sended = true;
        await this.sendToBackend(file);
    }

    private async sendToBackend(file: MyFile) {
        const newFileRequest: NewFileRequest = { bagId: file.parentBag.id, name: file.name, extension: file.extension, size: file.size, fileParts: file.fileParts };
        this.backend.addNewFile(newFileRequest).subscribe({
            next: response => {
                file.id = response.id!;
                file.create = response.create!;
                file.fileParts = response.fileParts!;
                file.progress = 0;
                file.blob = null;
                file.state = State.READY;
                file.uploadState = {}
                this.info.displaySuccess(`Successfully uploaded file '${file.name}'`);
            },
            error: () => {
                file.state = State.ERROR;
                this.info.displayError("Fail in uploading file, try again")
            }
        });

    }


    private createNewFile(file: File, parentBag: Bag) {
        return new MyFile(
            0,
            file.name,
            BlobUtils.getExtensionFromName(file.name),
            file.size,
            new Date(),
            '',
            0,
            [],
            parentBag,
            file,
            State.UPLOAD,
            {},
            {}
        )
    }
}
