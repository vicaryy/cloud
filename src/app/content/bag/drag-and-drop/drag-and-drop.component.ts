import { Component, EventEmitter, Output } from '@angular/core';
import { BagService } from '../../../shared/services/bag.service';
import { DragDropService } from '../../../shared/services/drag-drop.service';

@Component({
    selector: 'app-drag-and-drop',
    standalone: true,
    imports: [],
    templateUrl: './drag-and-drop.component.html',
    styleUrl: './drag-and-drop.component.scss'
})
export class DragAndDropComponent {
    @Output() dropFiles = new EventEmitter<DragEvent>();
    dragOver = false;

    constructor(private bagService: BagService, private dragDropService: DragDropService) { }

    onDragEnter($event: DragEvent) {
        this.bagService.dragAndDropOnBag = true;
        $event.preventDefault();
        this.dragOver = true;
    }

    onDragLeave($event: DragEvent) {
        this.bagService.dragAndDropOnBag = false;
        $event.preventDefault();
        $event.stopPropagation();
        this.dragOver = false;
    }

    onDragOver($event: DragEvent) {
        $event.preventDefault()
        $event.stopPropagation();
    }

    onDrop($event: DragEvent) {
        $event.preventDefault();
        $event.stopPropagation();
        this.dragDropService.setDragDrop(false);
        this.dropFiles.emit($event);
    }
}
