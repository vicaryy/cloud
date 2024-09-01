import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { DragBagEnd } from '../shared/interfaces/content.interfaces';
import { PasswordProtectedComponent } from "./password-protected/password-protected.component";
import { EmptyComponent } from "./empty/empty.component";
import { ChatComponent } from "./chat/chat.component";
import { DragDropControllerComponent } from "./drag-drop-controller/drag-drop-controller.component";
import { DragDropService } from '../shared/services/drag-drop.service';

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule, FolderComponent, PasswordProtectedComponent, EmptyComponent, ChatComponent, DragDropControllerComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {
    openedBags: Bag[] = [];
    deleteBar: boolean = false;
    chat = false;
    dragDropController = false;

    constructor(private dragDropService: DragDropService, private bagService: BagService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.initOpenedBags();
        this.initDragAndDrop();
    }

    initOpenedBags() {
        this.bagService.openedBags$.subscribe(next => {
            this.openedBags = [...next];
            this.cdr.markForCheck();
        });
    }

    initDragAndDrop() {
        this.dragDropService.dragDrop$.subscribe(next => {
            this.dragDropController = next;
            this.bagService.setDragAndDrop(next);
        });
    }

    onCloseDragDrop() {
        this.dragDropService.setDragDrop(false);
    }

    onDragOver($event: DragEvent) {
        $event.preventDefault();
        if (!this.dragDropController && this.isInContentElement($event))
            this.dragDropService.setDragDrop(true);
    }

    private isInContentElement($event: DragEvent) {
        const mouseX = $event.clientX;
        const mouseY = $event.clientY;
        const windowX = window.innerWidth;
        const windowY = window.innerHeight;
        return (mouseX > 60 && mouseY > 60) && (windowX - mouseX > 60 && mouseY > 60) && (mouseX > 60 && windowY - mouseY > 200) && (windowX - mouseX > 60 && windowY - mouseY > 200);
    }

    onGrabStart() {
        this.deleteBar = true;
    }

    onGrabEnd($event: DragBagEnd) {
        if ($event.x < 140)
            this.bagService.removeOpenedBag($event.id);
        this.deleteBar = false;
    }

    turnOnChat() {
        this.chat = true;
    }
}
