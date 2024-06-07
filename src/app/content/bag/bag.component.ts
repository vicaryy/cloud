import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { FileComponent } from "./file/file.component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, CdkDragStart } from '@angular/cdk/drag-drop';
import { Bag, File } from '../../shared/models/content.models';
import { AddComponent } from './add/add.component';
import { FolderComponent } from "./folder/folder.component";
import { AlertNameComponent } from "./alert-name/alert-name.component";
import { ModalComponent } from "../../shared/modal/modal.component";
import { CommonModule } from '@angular/common';
import { ElementToEdit } from '../../shared/interfaces/alert-interfaces';
import { AlertDeleteComponent } from "./alert-delete/alert-delete.component";

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle, AddComponent, FolderComponent, AlertNameComponent, ModalComponent, CommonModule, AlertDeleteComponent]
})
export class BagComponent implements AfterViewInit {

    @Input('bag') bag!: Bag;
    @Input() x!: any;
    @Input() y!: any;
    @Output('focus') focus = new EventEmitter<HTMLElement>();
    @Output('editElement') editElement = new EventEmitter<ElementToEdit>();
    @ViewChild("bagElement") bagElement!: ElementRef;
    alert: boolean = false;
    changeNameAlert: boolean = false;
    deleteAlert: boolean = false;
    elementToEdit!: ElementToEdit;


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

    displayAlert(event: ElementToEdit) {
        this.alert = true;
        if (event.changeName)
            this.changeNameAlert = true;
        if (event.delete)
            this.deleteAlert = true;
        this.elementToEdit = event;
    }

    alertOk() {
        this.editElement.emit(this.elementToEdit);
        this.disableAlerts();
    }

    alertCancel() {
        this.disableAlerts();
    }

    disableAlerts() {
        this.alert = false;
        this.changeNameAlert = false;
        this.deleteAlert = false;
    }
}
