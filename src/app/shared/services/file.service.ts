import { Injectable } from '@angular/core';
import { TelegramApiService } from './telegram-api.service';
import { Bag, MyFile } from '../models/content.models';
import { BlobUtils } from '../utils/blob.utils';
import { State } from '../enums/content.enums';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BackendApiService } from './backend-api.service';
import { CryptoService } from './crypto.service';
import { from, lastValueFrom, of, switchMap, tap } from 'rxjs';
import { FilePart } from '../interfaces/http-interfaces';
import { HttpEventType } from '@angular/common/http';
import { Message, TelegramResponse } from '../interfaces/telegram-interfaces';

@Injectable({
    providedIn: 'root'
})
export class FileService {

    constructor(private telegram: TelegramApiService, private backend: BackendApiService, private crypto: CryptoService) { }

    deleteFile(element: ElementToEdit) {
        return this.backend.deleteFile(element);
    }

    changeFileName(element: ElementToEdit) {
        return this.backend.changeFileName(element);
    }

    downloadFile(file: MyFile) {

    }

    addFile(fileInput: HTMLInputElement, parentBag: Bag) {
        if (!fileInput.files)
            return;
        const file: File = fileInput.files[0];

        const newFile: MyFile = this.createNewFile(file, parentBag);
        parentBag.files.push(newFile);
        this.uploadFile(newFile);
    }

    private uploadFile(file: MyFile) {
        file.state.state = State.ENCRYPT;
        const slicedBlobs = this.sliceBlob(file.blob!);
        const encryptedBlobs = this.encryptBlobs(slicedBlobs);
        file.state.upload = true;
        file.state.encryptedBlobs = encryptedBlobs;

        from(this.encryptBlobs(slicedBlobs)).pipe(
            tap(encryptedBlobs => file.state.encryptedBlobs = encryptedBlobs),
            switchMap(encryptedBlobs => this.sendBlobs(file))
        )
    }

    private sliceBlob(blob: Blob): Blob[] {
        console.log("Kroje na kawałki plik...");
        const slicedBlob: Blob[] = BlobUtils.sliceBlob(blob);
        console.log("Pokroiłem na kawałki, ilość: " + slicedBlob.length);
        return slicedBlob;
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

    private async sendBlobs(file: MyFile): Promise<FilePart[]> {
        let entireSize = 0;
        file.state.encryptedBlobs!.forEach(e => entireSize += e.size);
        let prevProgress = 0;
        let currProggres = 0;

        file.progress = 0;
        const fileParts: FilePart[] = [];
        for (let i = 0; i < file.state.encryptedBlobs!.length; i++) {
            const response = await lastValueFrom(this.telegram.sendBlob(file.state.encryptedBlobs![i]).pipe(tap(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    currProggres = event.loaded;
                    file.progress = Math.floor(((currProggres + prevProgress) / entireSize) * 100);
                }
                if (event.type === HttpEventType.Sent)
                    prevProgress += currProggres;

            })));
            const responseAs = response as unknown as TelegramResponse<Message>;
            if (!responseAs.ok) {
                console.log("Fail in sending file to telegram: ");
                console.log(responseAs);
                throw new Error("Fail in sending file, try again.");
            }
            const filePart: FilePart = { order: (i + 1), fileId: responseAs.result.document.file_id, size: file.state.encryptedBlobs![i].size };
            fileParts.push(filePart);
        }
        return fileParts;
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
            {
                state: State.READY
            }
        )
    }
}
