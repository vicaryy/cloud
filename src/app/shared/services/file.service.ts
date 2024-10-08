import { Injectable } from '@angular/core';
import { TelegramApiService } from './telegram-api.service';
import { Bag, MyFile, ProfilePhoto } from '../models/content.models';
import { BlobUtils } from '../utils/blob.utils';
import { FileType, State } from '../enums/content.enums';
import { BackendApiService } from './backend-api.service';
import { CryptoService } from './crypto.service';
import { concatMap, from, lastValueFrom, map, of, Subject, switchMap, tap, toArray } from 'rxjs';
import { FilePart, NewFileRequest } from '../interfaces/backend.interfaces';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Message, TelegramResponse } from '../interfaces/telegram.interfaces';
import { FileReducerService } from './file-reducer.service';
import { BagService } from './bag.service';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private _refreshFile = new Subject<number>;
    refreshFile$ = this._refreshFile.asObservable();

    FileType = FileType;

    constructor(private telegram: TelegramApiService, private backend: BackendApiService, private crypto: CryptoService, private alertService: AlertService, private fileReducer: FileReducerService, private bagService: BagService) { }

    sortBagById(parentId: number) {
        this.bagService.sortBag(parentId);
    }

    private refreshFile(id: number) {
        this._refreshFile.next(id);
    }

    async downloadPreview(file: MyFile) {
        try {
            await this.downloadPreviewBlob(file);
        } catch (error) {
            file.preview!.state = State.ERROR;
            this.alertService.displayError("Fail in displaying preview, try again");
        }
        this.refreshFile(file.id);
    }

    private async downloadPreviewBlob(file: MyFile) {
        file.preview!.state = State.DOWNLOAD;
        this.refreshFile(file.id);
        const filePath = await lastValueFrom(this.telegram.getFilePath(file.preview!.fileId!));
        const blob = await lastValueFrom(this.telegram.downloadBlob(filePath.result.file_path)) as HttpResponse<Blob>;
        const decryptedBlob = new Blob([await this.crypto.decrypt(await blob.body!.arrayBuffer())])
        file.preview!.url = URL.createObjectURL(decryptedBlob);
        file.preview!.state = State.DONE;
    }

    deleteFile(id: number, parentBagId: number) {
        this.backend.deleteFile(id).subscribe({
            next: () => {
                this.bagService.deleteFileFromBag(id, parentBagId);
                this.alertService.displaySuccess('File deleted successfully');
            },
            error: () => this.alertService.displayError('Error in deleting file, try again')
        });
    }

    changeFileName(file: MyFile, newName: string) {
        this.backend.changeFileName(file.id, newName).subscribe({
            next: () => {
                file!.name = newName;
                this._refreshFile.next(file.id);
                this.alertService.displaySuccess(`Successfully changed file name to ${newName}`);
            },
            error: () => this.alertService.displayError('Error in changing file name, try again')
        });
    }

    async tryAgain(file: MyFile) {
        if (Object.keys(file.uploadState).length !== 0)
            await this.uploadFile(file);

        else if (Object.keys(file.downloadState).length !== 0)
            await this.downloadFile(file);
    }

    async downloadFile(file: MyFile) {
        try {
            if (file.downloadState.decrypted)
                await this.createDownloadUrl(file);
            else if (file.downloadState.downloaded)
                await this.decryptBlobs(file);
            else
                await this.downloadBlobs(file);
        } catch (error) {
            file.state = State.ERROR;
            this.refreshFile(file.id);
            this.alertService.displayError(`Error in downloading file '${file.name}'`);
        }
    }

    private async downloadBlobs(file: MyFile) {
        file.state = State.DOWNLOAD;
        this.refreshFile(file.id);
        await this.wait(200);
        file.progress = 0;
        this.refreshFile(file.id);
        await this.wait(1500);
        if (!file.downloadState.entireSize) {
            file.downloadState.entireSize = 0;
            file.fileParts.forEach(e => file.downloadState.entireSize! += e.size);
        }
        if (!file.downloadState.prevProgress)
            file.downloadState.prevProgress = 0;

        const filePaths = await this.getAllFilePaths(file);
        let currProggres = 0;
        while (file.fileParts.length > 0) {
            let prevProgessForRefresh = 0;
            let currProgessForRefresh = 0;
            let blob = await lastValueFrom(this.telegram.downloadBlob(filePaths[0]).pipe(tap(event => {
                if (event.type === HttpEventType.DownloadProgress) {
                    currProggres = event.loaded;
                    file.progress = Math.floor(((currProggres + file.downloadState.prevProgress!) / file.downloadState.entireSize!) * 100);
                }
                if (event.type === HttpEventType.Response)
                    file.downloadState.prevProgress! += currProggres;

                if (currProgessForRefresh - prevProgessForRefresh > 2000000) {
                    prevProgessForRefresh = currProgessForRefresh;
                    this.refreshFile(file.id);
                }
            })));
            this.refreshFile(file.id);
            let blobResponse = blob as HttpResponse<Blob>;
            if (!file.downloadState.downloadedBlobs)
                file.downloadState.downloadedBlobs = [];

            file.downloadState.downloadedBlobs!.push(blobResponse.body!);
            file.fileParts.shift();
            filePaths.shift();
        }
        await this.wait(500);
        file.downloadState.downloaded = true;
        await this.decryptBlobs(file);
    }

    private async getAllFilePaths(file: MyFile) {
        return await lastValueFrom(from(file.fileParts)
            .pipe(
                concatMap(part => this.telegram.getFilePath(part.fileId)
                    .pipe(map(response => response.result.file_path))),
                toArray()
            ));
    }

    private async decryptBlobs(file: MyFile) {
        file.state = State.DECRYPT;
        this.refreshFile(file.id);
        await this.wait(200);

        while (file.downloadState.downloadedBlobs!.length > 0) {
            const doBlob = file.downloadState.downloadedBlobs![0];
            const arr = await this.crypto.decrypt(await doBlob.arrayBuffer());
            if (!file.downloadState.decryptedBlobs)
                file.downloadState.decryptedBlobs = [];
            file.downloadState.decryptedBlobs.push(new Blob([arr]));
            file.downloadState.downloadedBlobs!.shift();
        }
        file.downloadState.decrypted = true;
        await this.createDownloadUrl(file);
    }

    private async createDownloadUrl(file: MyFile) {
        file.url = URL.createObjectURL(new Blob(file.downloadState.decryptedBlobs));
        file.state = State.DONE;
        this.refreshFile(file.id);
        file.downloadState = {};
        file.uploadState = {};
        file.progress = 0;
    }

    async uploadFiles(files: File[], parentBag: Bag) {
        const newFiles: MyFile[] = [];
        for (const f of files)
            newFiles.push(this.createNewFile(f, parentBag));

        for (const f of newFiles)
            this.bagService.addFileAsView(parentBag.id, f);

        for (const f of newFiles)
            await this.uploadFile(f);
    }

    async uploadProfilePicture(photo: ProfilePhoto) {
        const previewBlob = await this.fileReducer.compressImage(photo.blob!);
        const encryptedBlob = new Blob([await this.crypto.encryptWithCustomPassword(await previewBlob.arrayBuffer(), photo.password!)]);
        const response = await lastValueFrom(this.telegram.sendBlob(encryptedBlob)) as HttpResponse<TelegramResponse<Message>>;
        photo.fileId = response.body?.result.document.file_id;
        photo.size = encryptedBlob.size;
    }

    private isPreviewable(ext: string) {
        ext = ext.split(".")[1];
        return ext === 'jpg' || ext === 'jpeg' || ext === 'png';
    }

    private async uploadFile(file: MyFile) {
        try {
            file.uploadState.started = true;
            if (!file.preview && this.isPreviewable(file.extension))
                await this.uploadPreview(file);

            if (file.uploadState.sended)
                await this.sendToBackend(file);
            else if (file.uploadState.encrypted)
                await this.sendBlobs(file);
            else if (file.uploadState.sliced)
                await this.encryptBlobs(file);
            else
                await this.sliceBlob(file);
        } catch (error) {
            file.state = State.ERROR;
            this.refreshFile(file.id);
            console.log(`Error in uploading file '${file.name}'`, error);
            this.alertService.displayError(`Error in uploading file '${file.name}'`);
        }
    }

    private async uploadPreview(file: MyFile) {
        const previewBlob = await this.fileReducer.compressImage(file.blob!);
        const encryptedBlob = new Blob([await this.crypto.encrypt(await previewBlob.arrayBuffer())]);
        const response = await lastValueFrom(this.telegram.sendBlob(encryptedBlob)) as HttpResponse<TelegramResponse<Message>>;

        file.preview = {
            extension: file.extension,
            fileId: response.body?.result.document.file_id,
            size: encryptedBlob.size,
        }
    }

    private async sliceBlob(file: MyFile) {
        const slicedBlob = BlobUtils.sliceBlob(file.blob!);
        file.uploadState.slicedBlobs = slicedBlob;
        file.uploadState.sliced = true;
        await this.encryptBlobs(file);
    }

    private async encryptBlobs(file: MyFile) {
        file.state = State.ENCRYPT;
        this.refreshFile(file.id);
        await this.wait(200);
        while (file.uploadState.slicedBlobs!.length > 0) {
            const slBlob = file.uploadState.slicedBlobs![0];

            const arr = await this.crypto.encrypt(await slBlob.arrayBuffer());

            if (!file.uploadState.encryptedBlobs)
                file.uploadState.encryptedBlobs = [];
            file.uploadState.encryptedBlobs.push(new Blob([arr]));
            file.uploadState.slicedBlobs!.shift();
        }
        file.uploadState.encrypted = true;
        await this.sendBlobs(file);
    }

    private async sendBlobs(file: MyFile) {
        file.state = State.UPLOAD;
        this.refreshFile(file.id);
        await this.wait(200);
        file.progress = 0;
        this.refreshFile(file.id);
        await this.wait(1500);
        if (!file.uploadState.entireSize) {
            file.uploadState.entireSize = 0;
            file.uploadState.encryptedBlobs!.forEach(e => file.uploadState.entireSize! += e.size);
        }
        if (!file.uploadState.prevProgress)
            file.uploadState.prevProgress = 0;
        let currProgress = 0;

        while (file.uploadState.encryptedBlobs!.length > 0) {
            const enBlob = file.uploadState.encryptedBlobs![0];

            let prevProgessForRefresh = 0;
            let currProgessForRefresh = 0;
            const response = await lastValueFrom(this.telegram.sendBlob(enBlob).pipe(tap(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    currProgress = event.loaded;
                    currProgessForRefresh = event.loaded;
                    file.progress = Math.floor(((currProgress + file.uploadState.prevProgress!) / file.uploadState.entireSize!) * 100);
                }
                if (event.type === HttpEventType.Sent)
                    file.uploadState.prevProgress! += currProgress;

                if (currProgessForRefresh - prevProgessForRefresh > 2000000) {
                    prevProgessForRefresh = currProgessForRefresh;
                    this.refreshFile(file.id);
                }
            })));
            this.refreshFile(file.id);
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
        await this.wait(500);
        file.uploadState.sended = true;
        await this.sendToBackend(file);
    }

    private async sendToBackend(file: MyFile) {
        const newFileRequest: NewFileRequest = { bagId: file.parentBag.id, name: file.name, extension: file.extension, size: file.size, fileParts: file.fileParts, previewFile: file.preview };
        this.backend.addNewFile(newFileRequest).subscribe({
            next: response => {
                file.id = response.id!;
                file.create = response.create!;
                file.fileParts = response.fileParts!;
                file.progress = 100;
                file.blob = null;
                file.state = State.READY;
                file.uploadState = {};
                file.downloadState = {};
                file.preview = response.preview;
                this.alertService.displaySuccess(`Successfully uploaded file '${file.name}'`);
                this.refreshFile(file.id);
            },
            error: () => {
                file.state = State.ERROR;
                this.refreshFile(file.id);
                this.alertService.displayError("Fail in uploading file, try again")
            }
        });

    }

    private createNewFile(file: File, parentBag: Bag) {
        return new MyFile(
            this.getRandomId(),
            file.name,
            BlobUtils.getExtensionFromName(file.name),
            file.size,
            FileType.UNKNOWN,
            new Date(),
            '',
            100,
            [],
            parentBag,
            file,
            State.LOADING,
            {},
            {},
            null
        )
    }

    wait(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    getRandomId(): number {
        return Math.floor(Math.random() * (5000000 - 1000000 + 1)) + 1000000;
    }
}
