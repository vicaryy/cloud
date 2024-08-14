import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { FileComponent } from "./file/file.component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, CdkDragStart } from '@angular/cdk/drag-drop';
import { Bag, MyFile as MyFile } from '../../shared/models/content.models';
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
import { DragBagEnd } from '../../shared/interfaces/content.interfaces';
import { FileService } from '../../shared/services/file.service';
import { InfoService } from '../../shared/services/info.service';
import { MatButtonModule } from '@angular/material/button';
import { MoreOptionsComponent } from "./more-options/more-options.component";
import { SortBy, FilterBy, State, FileType } from '../../shared/enums/content.enums';

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle, AddComponent, FolderComponent, AlertNameComponent, CommonModule, AlertDeleteComponent, AlertNewBagComponent, BlurBlockComponent, InfoComponent, MatButtonModule, MoreOptionsComponent]
})
export class BagComponent implements AfterViewInit, OnInit {
    @Input('bag') bag!: Bag;
    @Output('focus') focus = new EventEmitter<HTMLElement>();
    @Output('focusOnly') focusOnly = new EventEmitter<HTMLElement>();
    @Output('openBag') openBag = new EventEmitter<Bag>();
    @Output('deleteActiveChildBag') deleteActiveChildBag = new EventEmitter<number>();
    @Output('dragStart') dragStart = new EventEmitter<void>();
    @Output('dragEnd') dragEnd = new EventEmitter<DragBagEnd>();
    @Output('removeActiveBag') removeActiveBag = new EventEmitter<number>();
    @ViewChild("bagElement") bagElement!: ElementRef;
    @ViewChild('file') file!: ElementRef;
    State = State;
    SortBy = SortBy;
    FilterBy = FilterBy;
    currentSort: SortBy = SortBy.DATE_UP;
    currentFilter: FilterBy = FilterBy.ALL;
    openedBags: number = 0;
    alert: boolean = false;
    changeNameAlert: boolean = false;
    deleteAlert: boolean = false;
    newBagAlert: boolean = false;
    elementToEdit!: ElementToEdit;

    constructor(private bagService: BagService, private fileService: FileService, private info: InfoService, private renderer: Renderer2) { }

    ngOnInit(): void {
        this.sortByNewest();
    }

    ngAfterViewInit(): void {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.left = `${this.bag.x}px`;
        el.style.top = `${this.bag.y}px`;
        el.style.transformOrigin = ``;
        this.focus.emit(this.bagElement.nativeElement);
    }


    onFilter($event: FilterBy) {
        this.currentFilter = $event;
    }



    @ViewChild('bagElement') resizableBox!: ElementRef;
    private resizing = false;
    private startX = 0;
    private startY = 0;
    private startWidth = 0;
    private startHeight = 0;

    onAddFile() {
        let fileInput = this.file.nativeElement as HTMLInputElement;
        fileInput.click();
    }

    async addFile() {
        let fileInput = this.file.nativeElement as HTMLInputElement;
        if (!fileInput.files)
            return;
        const file: File = fileInput.files[0];
        await this.fileService.addFile(this.file.nativeElement, this.bag);
        this.onSort(this.currentSort);
    }

    async onTryAgain($event: MyFile) {
        await this.fileService.tryAgain($event);
        this.onSort(this.currentSort);
    }

    onDownloadFile($event: MyFile) {
        this.fileService.downloadFile($event);
    }

    onOpen($event: Bag) {
        this.setOpenBagCoords($event);
        this.openBag.emit($event);
    }

    deleteBag(element: ElementToEdit) {
        this.bagService.deleteBag(element).subscribe({
            next: () => {
                for (let i = 0; i < this.bag.bags.length; i++)
                    if (element.id === this.bag.bags[i].id)
                        this.bag.bags.splice(i, 1);
                this.info.displaySuccess(`Successfully deleted bag ${element.name}`);
            },
            error: (error) => {
                console.log("Error in deleting bag: ", error);
                this.info.displayError('Error in deleting bag, try again')
            }
        });
    }

    createNewBag(name: string) {
        this.bagService.createBag(this.bag.id, name).subscribe({
            next: e => {
                this.bag.bags.push(Bag.fromJSON(e));
                this.info.displaySuccess("Successfully created bag");
            },
            error: (error) => {
                console.log("Error in creating bag: ", error);
                this.info.displayError("Fail in creating bag, try again")
            }
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
        this.fileService.deleteFile(element).subscribe({
            next: () => {
                for (let i = 0; i < this.bag.files.length; i++)
                    if (element.id === this.bag.files[i].id)
                        this.bag.files.splice(i, 1);
                this.info.displaySuccess(`Successfully deleted file ${element.name}`);
            },
            error: () => this.info.displayError('Error in deleting file, try again')
        });
    }

    changeBagName(element: ElementToEdit) {
        if (this.isBagNameExists(element.newName!)) {
            this.info.displayError(`Bag with name '${element.newName}' already exist`)
            return;
        }

        this.bagService.changeBagName(element).subscribe({
            next: () => {
                for (let i = 0; i < this.bag.bags.length; i++)
                    if (element.id === this.bag.bags[i].id)
                        this.bag.bags[i].name = element.newName!;
                this.info.displaySuccess(`Successfully changed bag name to ${element.newName}`);
            },
            error: () => this.info.displayError('Error in changing bag name, try again')
        });
    }

    isBagNameExists(name: string): boolean {
        for (let bag of this.bag.bags)
            if (bag.name === name)
                return true;
        return false;
    }

    isFileNameExists(name: string): boolean {
        for (let file of this.bag.files)
            if (file.name === name)
                return true;
        return false;
    }

    changeFileName(element: ElementToEdit) {
        if (this.isFileNameExists(element.newName!)) {
            this.info.displayError(`File with name '${element.newName}' already exist`);
            return;
        }

        let fileToEdit = this.bag.files.find(e => e.id === element.id);
        if (fileToEdit?.extension !== 'unknown' && !element.newName?.endsWith(fileToEdit!.extension!))
            element.newName = element.newName + fileToEdit!.extension!;

        this.fileService.changeFileName(element).subscribe({
            next: () => {
                fileToEdit!.name = element.newName!;
                this.info.displaySuccess(`Successfully changed file name to ${element.newName}`);
            },
            error: () => this.info.displayError('Error in changing file name, try again')
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

    onRemoveActiveBag() {
        this.removeActiveBag.emit(this.bag.id);
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

    isUploadFileNeedsToBeDisplay(file: MyFile): boolean {
        return file.state === State.ERROR || file.state === State.ENCRYPT || file.state === State.UPLOAD;
    }

    isFoldersNeedsToBeDisplay() {
        return this.currentFilter === FilterBy.ALL;
    }

    isFileNeedsToBeDisplay(file: MyFile): boolean {
        console.log("Bylem tu");

        return file.state !== State.ERROR
            && file.state !== State.ENCRYPT
            && file.state !== State.UPLOAD
            && this.isFilePassesFilter(file);
    }

    isFilePassesFilter(file: MyFile): boolean {
        if (this.currentFilter === FilterBy.ALL)
            return true;
        if (this.currentFilter === FilterBy.IMAGES && file.type === FileType.IMAGE)
            return true;
        if (this.currentFilter === FilterBy.VIDEOS && file.type === FileType.VIDEO)
            return true;
        if (this.currentFilter === FilterBy.MUSIC && file.type === FileType.MUSIC)
            return true;
        if (this.currentFilter === FilterBy.DOCUMENTS && file.type === FileType.DOCUMENT)
            return true;
        return false;
    }

    disableAlerts() {
        this.alert = false;
        this.changeNameAlert = false;
        this.deleteAlert = false;
        this.newBagAlert = false;
    }

    trackById(index: number, file: any): any {
        return file.id;
    }

    onSort($event: SortBy) {
        console.log("Sortuje...");

        this.currentSort = $event;
        if ($event === SortBy.DATE_DOWN)
            this.sortByOldest();
        else if ($event === SortBy.DATE_UP)
            this.sortByNewest();
        else if ($event === SortBy.SIZE_UP)
            this.sortByHeaviest();
        else if ($event === SortBy.SIZE_DOWN)
            this.sortByLightest();
        else if ($event === SortBy.NAME_DOWN)
            this.sortByNameAz();
        else if ($event === SortBy.NAME_UP)
            this.sortByNameZa();
    }

    sortByNewest() {
        this.bag.files = this.bag.files.sort((a, b) => new Date(b.create.toString()).getTime() - new Date(a.create.toString()).getTime());
    }
    sortByOldest() {
        this.bag.files = this.bag.files.sort((a, b) => new Date(a.create.toString()).getTime() - new Date(b.create.toString()).getTime());
    }
    sortByHeaviest() {
        this.bag.files = this.bag.files.sort((a, b) => b.size - a.size);
    }
    sortByLightest() {
        this.bag.files = this.bag.files.sort((a, b) => a.size - b.size);
    }
    sortByNameAz() {
        this.bag.files = this.bag.files.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }

    sortByNameZa() {
        this.bag.files = this.bag.files.sort((a, b) => b.name.toLowerCase().localeCompare(a.name.toLowerCase()));
    }
}
