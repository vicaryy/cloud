import { AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewChildren } from '@angular/core';
import { FileComponent } from "./file/file.component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, CdkDragStart } from '@angular/cdk/drag-drop';
import { Bag, File } from '../../shared/models/content.models';
import { AddComponent } from './add/add.component';
import { FolderComponent } from "./folder/folder.component";
import { AlertNameComponent } from "./alert-name/alert-name.component";

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle, AddComponent, FolderComponent, AlertNameComponent]
})
export class BagComponent implements AfterViewInit {

    @Input() directory!: string;
    @Input() bags!: Bag[];
    @Input() files!: File[];
    @Input() x!: any;
    @Input() y!: any;
    @Output('focus') focus = new EventEmitter<HTMLElement>();
    @ViewChild("bag") bagElement!: ElementRef;

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
}
