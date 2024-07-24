import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileComponent } from "./file/file.component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, CdkDragStart } from '@angular/cdk/drag-drop';
import { Bag, File as MyFile } from '../../shared/models/content.models';
import { AddComponent } from './add/add.component';
import { FolderComponent } from "./folder/folder.component";
import { AlertNameComponent } from "./alert-name/alert-name.component";
import { CommonModule } from '@angular/common';
import { ElementToEdit } from '../../shared/interfaces/alert-interfaces';
import { AlertDeleteComponent } from "./alert-delete/alert-delete.component";
import { AlertNewBagComponent } from "./alert-new-bag/alert-new-bag.component";
import { BagService } from '../../shared/services/bag.service';
import { BlurBlockComponent } from "../../shared/components/blur-block/blur-block.component";
import { InfoComponent } from "../../shared/components/info/info.component";
import { Info } from '../../shared/models/alert.models';
import { FileState } from '../../shared/enums/content.enums';
import { CryptoService } from '../../shared/services/crypto.service';
import { BlobUtils } from '../../shared/utils/blob.utils';
import { firstValueFrom, lastValueFrom, tap } from 'rxjs';
import { FilePart, NewFileRequest } from '../../shared/interfaces/http-interfaces';
import { DragBagEnd } from '../../shared/interfaces/content.interfaces';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Message, TelegramResponse } from '../../shared/interfaces/telegram-interfaces';

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle, AddComponent, FolderComponent, AlertNameComponent, CommonModule, AlertDeleteComponent, AlertNewBagComponent, BlurBlockComponent, InfoComponent]
})
export class BagComponent implements AfterViewInit {
    @Input('bag') bag!: Bag;
    @Output('focus') focus = new EventEmitter<HTMLElement>();
    @Output('focusOnly') focusOnly = new EventEmitter<HTMLElement>();
    @Output('info') info = new EventEmitter<Info>();
    @Output('openBag') openBag = new EventEmitter<Bag>();
    @Output('deleteActiveChildBag') deleteActiveChildBag = new EventEmitter<number>();
    @Output('dragStart') dragStart = new EventEmitter<void>();
    @Output('dragEnd') dragEnd = new EventEmitter<DragBagEnd>();
    @ViewChild("bagElement") bagElement!: ElementRef;
    openedBags: number = 0;
    alert: boolean = false;
    changeNameAlert: boolean = false;
    deleteAlert: boolean = false;
    newBagAlert: boolean = false;
    elementToEdit!: ElementToEdit;

    constructor(private bagService: BagService, private crypto: CryptoService) { }


    async onDownload($event: MyFile) {
        $event.state = FileState.DOWNLOAD;
        let downloadedBlobs = await this.downloadBlobs($event.fileParts, $event);
        $event.state = FileState.DECRYPT;
        let decryptedBlobs = await this.decryptBlobs(downloadedBlobs);
        $event.state = FileState.DONE;
        $event.url = URL.createObjectURL(new Blob(decryptedBlobs));
    }

    async downloadBlobs(fileParts: FilePart[], myFile: MyFile): Promise<Blob[]> {
        let downloadedBlobs: Blob[] = [];
        let entireSize = 0;
        fileParts.forEach(e => entireSize += e.size);
        let prevProgress = 0;
        let currProggres = 0;

        myFile.progress = 0;
        for (let file of fileParts) {
            let fileUrl = await lastValueFrom(this.bagService.getFilePath(file.fileId));
            let blob = await lastValueFrom(this.bagService.downloadBlobFromTelegram(fileUrl.result.file_path).pipe(tap(event => {
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


    deleteBag(element: ElementToEdit) {
        this.bagService.deleteBag(element)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo('Error in deleting bag, try again'))
                    return;
                }
                for (let i = 0; i < this.bag.bags.length; i++)
                    if (element.id === this.bag.bags[i].id)
                        this.bag.bags.splice(i, 1);
                this.deleteActiveChildBag.emit(element.id);
                this.emitInfo(Info.getSuccessInfo(`Successfully deleted bag ${element.name}`));
            });
    }

    createNewBag(name: string) {
        this.bagService.addNewBag(this.bag.id, name)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo("Fail in creating bag, try again"));
                    return;
                }
                const responseBag: Bag = Bag.fromJSON(e.data!);
                this.bag.bags.push(responseBag);
                this.emitInfo(Info.getSuccessInfo("Successfully created bag"));
            });
    }

    onOpen($event: Bag) {
        this.setOpenBagCoords($event);
        this.openBag.emit($event);
    }

    setOpenBagCoords(bag: Bag) {
        let transformX: any = this.bagElement.nativeElement.style.transform;
        if (transformX)
            transformX = +transformX.split("(")[1].split("px")[0];
        else
            transformX = 0;

        let transformY: any = this.bagElement.nativeElement.style.transform;
        if (transformY)
            transformY = +transformY.split(", ")[1].split("px")[0];
        else
            transformY = 0;

        bag.x = this.bag.x! + 320 + transformX;
        if (this.openedBags === 0) {
            bag.y = this.bag.y! + transformY;
            this.openedBags++;
        }
        else if (this.openedBags === 1) {
            bag.y = this.bag.y! - 30 + transformY;
            this.openedBags++;
        }
        else if (this.openedBags === 2) {
            bag.y = this.bag.y! + 30 + transformY;
            this.openedBags = 0;
        }
    }

    getRandomNumber(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async onAddFile(file: File) {
        let newFile: MyFile = new MyFile(0, file.name, BlobUtils.getExtensionFromName(file.name), file.size, new Date(), '', 0, [], FileState.ENCRYPT);
        this.bag.files.push(newFile);
        console.log(newFile);

        const slicedBlob: Blob[] = this.sliceBlob(file);
        const encryptedBlobs: Blob[] = await this.encryptBlobs(slicedBlob);
        newFile.state = FileState.UPLOAD;

        const newFileRequest: NewFileRequest = { bagId: this.bag.id, name: file.name, extension: BlobUtils.getExtensionFromName(file.name), size: file.size, fileParts: [] };
        const fileParts: FilePart[] = await this.sendBlobs(encryptedBlobs, newFile);
        newFileRequest.fileParts = fileParts;
        const serverResponse = await firstValueFrom(this.bagService.sendNewFileToServer(newFileRequest));
        if (serverResponse.status !== 200) {
            this.emitInfo(Info.getErrorInfo("Fail in creating file, try again"));
            return;
        }
        newFile.id = serverResponse.data?.id!;
        newFile.create = serverResponse.data?.create!;
        newFile.fileParts = serverResponse.data?.fileParts!;
        newFile.state = FileState.READY;
        this.emitInfo(Info.getSuccessInfo("Successfully added file " + serverResponse.data?.name));
    }

    async sendBlobs(blobs: Blob[], file: MyFile): Promise<FilePart[]> {
        let entireSize = 0;
        blobs.forEach(e => entireSize += e.size);
        let prevProgress = 0;
        let currProggres = 0;

        file.progress = 0;
        const fileParts: FilePart[] = [];
        for (let i = 0; i < blobs.length; i++) {
            const response = await lastValueFrom(this.bagService.sendBlobToTelegram(blobs[i]).pipe(tap(event => {
                if (event.type === HttpEventType.UploadProgress) {
                    currProggres = event.loaded;
                    file.progress = Math.floor(((currProggres + prevProgress) / entireSize) * 100);
                }
                if (event.type === HttpEventType.Sent)
                    prevProgress += currProggres;

            })));
            const responseAs = response as HttpResponse<TelegramResponse<Message>>;
            if (!responseAs.body!.ok)
                throw new Error("nwm");
            const filePart: FilePart = { order: (i + 1), fileId: responseAs.body!.result.document.file_id, size: blobs[i].size };
            fileParts.push(filePart);
        }
        return fileParts;
    }

    sliceBlob(blob: Blob): Blob[] {
        console.log("Kroje na kawałki plik...");
        const slicedBlob: Blob[] = BlobUtils.sliceBlob(blob);
        console.log("Pokroiłem na kawałki, ilość: " + slicedBlob.length);
        return slicedBlob;
    }

    async encryptBlobs(slicedBlobs: Blob[]): Promise<Blob[]> {
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

    async decryptBlobs(slicedBlobs: Blob[]): Promise<Blob[]> {
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

    onDelete($event: ElementToEdit) {
        this.disableAlerts();
        if ($event.bag)
            this.deleteBag($event);
        if ($event.file)
            this.deleteFile($event);
    }

    onChangeName($event: ElementToEdit) {
        this.disableAlerts();
        if ($event.bag)
            this.changeBagName($event);
        if ($event.file)
            this.changeFileName($event);
    }


    deleteFile(element: ElementToEdit) {
        this.bagService.deleteFile(element)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo('Error in deleting file, try again'))
                }

                for (let i = 0; i < this.bag.files.length; i++)
                    if (element.id === this.bag.files[i].id)
                        this.bag.files.splice(i, 1);

                this.emitInfo(Info.getSuccessInfo(`Successfully deleted file ${element.name}`));
            });
    }

    changeBagName(element: ElementToEdit) {
        this.bagService.changeBagName(element)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo('Error in changing bag name, try again'))
                }

                for (let i = 0; i < this.bag.bags.length; i++)
                    if (element.id === this.bag.bags[i].id)
                        this.bag.bags[i].name = element.newName!;

                this.emitInfo(Info.getSuccessInfo(`Successfully changed bag name ${element.name}`));
            });
    }
    changeFileName(element: ElementToEdit) {
        this.bagService.changeFileName(element)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo('Error in changing file name, try again'))
                }

                for (let i = 0; i < this.bag.files.length; i++)
                    if (element.id === this.bag.files[i].id)
                        this.bag.files[i].name = element.newName!;

                this.emitInfo(Info.getSuccessInfo(`Successfully changed file name ${element.name}`));
            });
    }

    onDragStart(event: CdkDragStart) {
        this.dragStart.emit();
    }

    onDragEnd(event: CdkDragEnd) {
        this.setTransformOriginAfterDragEnd(event.dropPoint.x, event.dropPoint.y);
        this.dragEnd.emit({ x: event.dropPoint.x, y: event.dropPoint.y, id: this.bag.id });
    }

    setTransformOriginAfterDragEnd(x: any, y: any) {
        this.bagElement.nativeElement.style.transformOrigin = `calc(${x}px - ${this.bag.x}px) calc(${y}px - ${this.bag.y}px)`;
    }

    ngAfterViewInit(): void {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.left = `${this.bag.x}px`;
        el.style.top = `${this.bag.y}px`;
        el.style.transformOrigin = ``;
        this.focusOnly.emit(el);
    }

    onFocus() {
        this.focus.emit(this.bagElement.nativeElement);
    }

    displayNewBagAlert() {
        this.newBagAlert = true;
        this.alert = true;
    }

    displayAlert(event: ElementToEdit) {
        this.alert = true;
        if (event.changeName)
            this.changeNameAlert = true;
        if (event.delete)
            this.deleteAlert = true;
        this.elementToEdit = event;
    }

    alertCancel() {
        this.disableAlerts();
    }

    async onNewBag($event: string) {
        this.disableAlerts();
        this.createNewBag($event);
    }


    disableAlerts() {
        this.alert = false;
        this.changeNameAlert = false;
        this.deleteAlert = false;
        this.newBagAlert = false;
    }

    emitInfo(info: Info) {
        this.info.emit(info);
    }


    trackById(index: number, file: any): any {
        return file.id;
    }
}
