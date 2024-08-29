import { Component, EventEmitter, Output } from '@angular/core';
import { DragDropService } from '../../shared/services/drag-drop.service';

@Component({
    selector: 'app-drag-drop-controller',
    standalone: true,
    imports: [],
    templateUrl: './drag-drop-controller.component.html',
    styleUrl: './drag-drop-controller.component.scss'
})
export class DragDropControllerComponent {
    constructor(private dragDropService: DragDropService) { }

    emitClose() {
        this.dragDropService.setDragDrop(false);
    }
}
