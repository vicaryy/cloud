import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FileComponent } from "./file/file.component";
import { CdkDrag, CdkDragEnd, CdkDragHandle } from '@angular/cdk/drag-drop';
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

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle, AddComponent, FolderComponent, AlertNameComponent, CommonModule, AlertDeleteComponent, AlertNewBagComponent, BlurBlockComponent, InfoComponent]
})
export class BagComponent implements AfterViewInit {
    @Input('bag') bag!: Bag;
    @Input() x!: any;
    @Input() y!: any;
    @Output('focus') focus = new EventEmitter<HTMLElement>();
    @Output('info') info = new EventEmitter<Info>();
    @ViewChild("bagElement") bagElement!: ElementRef;
    alert: boolean = false;
    changeNameAlert: boolean = false;
    deleteAlert: boolean = false;
    newBagAlert: boolean = false;
    elementToEdit!: ElementToEdit;

    constructor(private bagService: BagService) { }

    onAddFile(file: File) {

        console.log(file);

        let newFile: MyFile = new MyFile(Math.floor(Math.random() * 1000) + 1, file.name, ".xd", file.size.toString(), new Date(), FileState.ENCRYPT);
        this.bag.files.push(newFile);

        let s = "siema";
        console.log("robie enkrypcje: " + s);

        const crypto = window.crypto.subtle;
        let keyPromise = crypto.generateKey({
            name: "AES-GCM",
            length: 128
        }, true, ["encrypt", "decrypt"]);

        keyPromise.then(e =>
            crypto.exportKey("raw", e)
                .then(ee => {
                    let exportedKeyBase64 = this.arrayBufferToBase64(ee);
                    console.log("Eksportowany klucz:", exportedKeyBase64);
                })
        );

        // setTimeout(() => {
        //     newFile.state = FileState.UPLOAD;

        // }, 2000);
        // setTimeout(() => {
        //     newFile.state = FileState.READY;

        // }, 4000);
        // setTimeout(() => {
        //     newFile.state = FileState.DOWNLOAD;

        // }, 6000);
        // setTimeout(() => {
        //     newFile.state = FileState.DONE;

        // }, 8000);

    }

    arrayBufferToBase64(buffer: ArrayBuffer) {
        let binary = '';
        let bytes = new Uint8Array(buffer);
        let len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
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

    deleteBag(element: ElementToEdit) {
        this.bagService.deleteBag(element)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo('Error in deleting bag, try again'))
                }

                for (let i = 0; i < this.bag.bags.length; i++)
                    if (element.id === this.bag.bags[i].id)
                        this.bag.bags.splice(i, 1);

                this.emitInfo(Info.getSuccessInfo(`Successfully deleted bag ${element.name}`));
            });
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


    onDragEnd(event: CdkDragEnd) {
        this.setTransformOriginAfterDragEnd(event.dropPoint.x, event.dropPoint.y);
    }

    setTransformOriginAfterDragEnd(x: any, y: any) {
        this.bagElement.nativeElement.style.transformOrigin = `calc(${x}px - ${this.x}px) calc(${y}px - ${this.y}px)`;
    }

    ngAfterViewInit(): void {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.left = `${this.x}px`;
        el.style.top = `${this.y}px`;
        el.style.transformOrigin = ``;
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

    onNewBag($event: string) {
        this.disableAlerts();
        this.createNewBag($event);
    }

    createNewBag(name: string) {
        this.bagService.addNewBag(name, this.bag.directory)
            .subscribe(e => {
                if (e.status !== 200) {
                    this.emitInfo(Info.getErrorInfo("Fail in creating bag, try again"));
                    return;
                }
                this.bag.bags.push(e.data!);
                this.emitInfo(Info.getSuccessInfo("Successfully created bag"));
            });
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
