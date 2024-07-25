import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
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
import { BlobUtils } from '../../shared/utils/blob.utils';
import { DragBagEnd } from '../../shared/interfaces/content.interfaces';

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

    constructor(private bagService: BagService) { }


    @ViewChild('bagElement') resizableBox!: ElementRef;
    private resizing = false;
    private startX = 0;
    private startY = 0;
    private startWidth = 0;
    private startHeight = 0;


    @HostListener('mousedown', ['$event'])
    onMouseDown(event: MouseEvent) {
        if ((event.target as HTMLElement).classList.contains('handle')) {
            this.resizing = true;
            this.startX = event.clientX;
            this.startY = event.clientY;
            this.startWidth = this.resizableBox.nativeElement.offsetWidth;
            this.startHeight = this.resizableBox.nativeElement.offsetHeight;
            event.preventDefault();
        }
    }

    @HostListener('document:mousemove', ['$event'])
    onMouseMove(event: MouseEvent) {
        if (this.resizing) {
            const deltaX = event.clientX - this.startX;
            const deltaY = event.clientY - this.startY;
            this.resizableBox.nativeElement.style.width = `${this.startWidth + deltaX}px`;
            this.resizableBox.nativeElement.style.height = `${this.startHeight + deltaY}px`;
            event.preventDefault();
        }
    }

    @HostListener('document:mouseup')
    onMouseUp() {
        this.resizing = false;
    }

    async onDownload($event: MyFile) {
        this.bagService.downloadFile($event);
    }

    async onAddFile(file: File) {
        let newFile: MyFile = new MyFile(0, file.name, BlobUtils.getExtensionFromName(file.name), file.size, new Date(), '', 0, [], FileState.ENCRYPT);
        this.bag.files.push(newFile);
        try {
            this.bagService.addFile(this.bag.id, newFile, file);
        } catch (err) {
            this.emitInfo(Info.getErrorInfo(err as string));
        }
        this.emitInfo(Info.getSuccessInfo("Successfully added file " + file.name));
    }

    onOpen($event: Bag) {
        this.setOpenBagCoords($event);
        this.openBag.emit($event);
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
        this.bagService.createBag(this.bag.id, name)
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

    ngAfterViewInit(): void {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.left = `${this.bag.x}px`;
        el.style.top = `${this.bag.y}px`;
        el.style.transformOrigin = ``;
        this.focus.emit(this.bagElement.nativeElement);
    }
}
