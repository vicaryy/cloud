import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag, User } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { UserService } from '../shared/services/user.service';
import { DragBagEnd } from '../shared/interfaces/content.interfaces';
import { BackdropService } from '../shared/services/backdrop.service';
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
    user!: User;
    openedBags: Bag[] = [];
    @ViewChildren("bag") activeBags!: QueryList<BagComponent>;
    deleteBar: boolean = false;
    chat = false;
    backdrop: boolean = false;
    dragDropController = false;

    constructor(private dragDropService: DragDropService, private bagService: BagService, private userService: UserService, private backdropService: BackdropService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.bagService.openedBags$.subscribe(next => {
            this.openedBags = [...next];
            this.cdr.markForCheck();
        });
        this.backdropService.turnOn$.subscribe(next => this.backdrop = true);
        this.backdropService.clicked$.subscribe(next => this.backdrop = false);
        this.dragDropService.dragDrop$.subscribe(next => {
            this.dragDropController = next
            this.bagService.setDragAndDrop(next);
        });
    }

    onClickedBackdrop() {
        this.backdropService.clicked();
    }

    onCloseDragDrop() {
        this.dragDropService.setDragDrop(false);
    }
    onDragOver($event: DragEvent) {
        $event.preventDefault();
        if (this.dragDropController)
            return;

        const mouseX = $event.clientX;
        const mouseY = $event.clientY;
        const windowX = window.innerWidth;
        const windowY = window.innerHeight;

        if ((mouseX > 60 && mouseY > 60) && (windowX - mouseX > 60 && mouseY > 60) && (mouseX > 60 && windowY - mouseY > 200) && (windowX - mouseX > 60 && windowY - mouseY > 200))
            this.dragDropService.setDragDrop(true);
    }

    onDragStart() {
        this.deleteBar = true;
    }

    onDragEnd($event: DragBagEnd) {
        if ($event.x < 140)
            this.bagService.removeOpenedBag($event.id);
        this.deleteBar = false;
    }

    trackById(index: number, bag: any): any {
        return bag.id;
    }

    turnOnChat() {
        this.chat = true;
    }

    onDragLeave($event: DragEvent) {
        $event.preventDefault();
        $event.stopPropagation();
        setTimeout(() => {
            if (!this.bagService.dragAndDropOnBag)
                this.bagService.setDragAndDrop(false)
        }, 100);

    }

    onDragStartt($event: DragEvent) {
        $event.preventDefault();
        this.bagService.setDragAndDrop(true);
    }
}
