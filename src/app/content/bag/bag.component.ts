import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
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
import { DragBagEnd } from '../../shared/interfaces/content.interfaces';
import { FileService } from '../../shared/services/file.service';
import { MatButtonModule } from '@angular/material/button';
import { MoreOptionsComponent } from "./more-options/more-options.component";
import { SortBy, FilterBy, State, FileType } from '../../shared/enums/content.enums';
import { Subscription } from 'rxjs';
import { EmptyBagComponent } from "./empty-bag/empty-bag.component";
import { DragAndDropComponent } from "./drag-and-drop/drag-and-drop.component";
import { AlertService } from '../../shared/services/alert.service';

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle, AddComponent, FolderComponent, AlertNameComponent, CommonModule, AlertDeleteComponent, AlertNewBagComponent, BlurBlockComponent, MatButtonModule, MoreOptionsComponent, EmptyBagComponent, DragAndDropComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class BagComponent implements AfterViewInit, OnInit, OnDestroy {
    @Input('bag') bag!: Bag;
    @Output('dragStart') dragStart = new EventEmitter<void>();
    @Output('dragEnd') dragEnd = new EventEmitter<DragBagEnd>();
    @ViewChild("bagElement") bagElement!: ElementRef;
    @ViewChild("scrollElement") scrollElement!: ElementRef;
    @ViewChild('file') file!: ElementRef;
    @ViewChildren('filesElements') filesElements!: QueryList<FileComponent>;
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
    dragAndDrop: boolean = false;
    elementToEdit!: ElementToEdit;
    refreshSub!: Subscription;
    focusSub!: Subscription;
    sortSub!: Subscription;
    scrollSub!: Subscription;
    dragAndDropSub!: Subscription;

    constructor(private bagService: BagService, private fileService: FileService, private alertService: AlertService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.initRefreshSub()
        this.initFocusSub();
        this.initSortSub();
        this.initScrollSub();
        this.initDragAndDropSub();
        this.sortByNewest();
    }

    ngOnDestroy(): void {
        this.refreshSub.unsubscribe();
        this.focusSub.unsubscribe();
        this.sortSub.unsubscribe();
        this.scrollSub.unsubscribe();
        this.dragAndDropSub.unsubscribe();
    }

    initSortSub() {
        this.sortSub = this.bagService.sortBag$.subscribe(id => {
            if (id === this.bag.id)
                this.onSort(this.currentSort);
        })
    }

    initRefreshSub() {
        this.refreshSub = this.bagService.refreshBag$.subscribe(id => {
            if (id === this.bag.id)
                this.cdr.markForCheck();
        })
    }

    initDragAndDropSub() {
        this.dragAndDropSub = this.bagService.dragAndDrop$.subscribe(drag => {
            this.dragAndDrop = drag;
            this.cdr.markForCheck();
        })
    }

    initFocusSub() {
        this.focusSub = this.bagService.focusBag$.subscribe(id => {
            if (id === this.bag.id) {
                this.bagElement.nativeElement.style.backgroundColor = 'var(--bag-color-focus)';
                this.bagElement.nativeElement.style.zIndex = `${this.bagService.highestIndex++}`;
            }
            else
                this.bagElement.nativeElement.style.backgroundColor = 'var(--bag-color)';
        });
    }

    initScrollSub() {
        this.scrollSub = this.bagService.scrollToFile$.subscribe(id => {
            for (const a of this.filesElements) {
                if (id === a.file.id) {
                    this.scrollElement.nativeElement.scroll({
                        top: a.fileElement.nativeElement.offsetTop - 80,
                        behavior: 'smooth'
                    })
                    a.glowUpFile();
                }
            }
        });
    }

    ngAfterViewInit(): void {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.left = `${this.bag.x}px`;
        el.style.top = `${this.bag.y}px`;
        el.style.transformOrigin = ``;
        this.bagService.focusBag(this.bag.id);
    }

    isFoldersAndFilesEmpty() {
        return this.bag.getAmountOfBags() === 0 && this.bag.getAmountOfFiles() === 0;
    }

    onFilter($event: FilterBy) {
        this.currentFilter = $event;
    }

    onAddFile() {
        let fileInput = this.file.nativeElement as HTMLInputElement;
        fileInput.click();
    }

    onAddFileDragAndDrop($event: DragEvent) {
        this.addFilesDragAndDrop($event);
    }

    async addFilesDragAndDrop($event: DragEvent) {
        if (!$event.dataTransfer?.files)
            return;

        const files: File[] = [];
        for (let i = 0; i < $event.dataTransfer.files.length; i++) {
            if (this.isFileFolder($event.dataTransfer.items[i])) {
                this.alertService.displayError(`Cannot add '${$event.dataTransfer.files[i].name}', folders are not supported yet`)
            }
            else
                files.push($event.dataTransfer.files[i]);
        }

        await this.fileService.addFiles(files, this.bag);
        this.onSort(this.currentSort);
    }

    isFileFolder(item: DataTransferItem) {
        return item.webkitGetAsEntry()?.isDirectory;
    }

    async addFiles() {
        let fileInput = this.file.nativeElement as HTMLInputElement;
        if (!fileInput.files)
            return;

        const files: File[] = [];
        for (let i = 0; i < fileInput.files.length; i++)
            files.push(fileInput.files[i]);

        await this.fileService.addFiles(files, this.bag);
        this.onSort(this.currentSort);
    }

    onOpen($event: Bag) {
        this.setOpenBagCoords($event);
        this.bagService.openBag($event);
    }

    createNewBag(name: string) {
        this.bagService.createBag(this.bag.id, name).subscribe({
            next: e => {
                this.bag.bags.push(Bag.fromJSON(e));
                this.alertService.displaySuccess("Successfully created bag");
                this.cdr.markForCheck();
            },
            error: () => {
                this.alertService.displayError("Fail in creating bag, try again")
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

    onDelete($event: ElementToEdit) {
        this.disableAlerts();
        if ($event.bag)
            this.bagService.deleteBag($event.id);
        if ($event.file)
            this.fileService.deleteFile($event.id, this.bag.id);
    }

    onChangeName($event: ElementToEdit) {
        if ($event.bag) {
            if (this.isBagNameExists($event.newName!)) {
                this.alertService.displayError(`Bag name '${$event.newName}' already exist`);
                return;
            }
            this.bagService.changeBagName($event.id, $event.newName!);
        }
        if ($event.file)
            this.changeFileName($event);
        this.disableAlerts();
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
            this.alertService.displayError(`File name '${element.newName}' already exist`);
            return;
        }

        let fileToEdit = this.bag.files.find(e => e.id === element.id);
        if (fileToEdit?.extension !== 'unknown' && !element.newName?.endsWith(fileToEdit!.extension!))
            element.newName = element.newName + fileToEdit!.extension!;

        this.fileService.changeFileName(fileToEdit!, element.newName!);
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
        this.bagService.focusBag(this.bag.id);
    }

    onRemoveActiveBag() {
        this.bagService.removeOpenedBag(this.bag.id);
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
        if (this.isBagNameExists($event)) {
            this.alertService.displayError(`Bag name '${$event}' already exist`);
            return;
        }
        this.disableAlerts();
        this.createNewBag($event);
    }

    isUploadFileNeedsToBeDisplay(file: MyFile): boolean {
        return file.state === State.ERROR || file.state === State.ENCRYPT || file.state === State.UPLOAD || file.state === State.LOADING;
    }

    isFoldersNeedsToBeDisplay() {
        return this.currentFilter === FilterBy.ALL;
    }

    isFileNeedsToBeDisplay(file: MyFile): boolean {
        return file.state !== State.ERROR
            && file.state !== State.ENCRYPT
            && file.state !== State.UPLOAD
            && file.state !== State.LOADING
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
