import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
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
import { HeaderComponent } from "../header/header.component";
import { RouterOutlet } from '@angular/router';
import { LoadingScreenComponent } from "../shared/components/loading-screen/loading-screen.component";
import { Subscription } from 'rxjs';
import { UserService } from '../shared/services/user.service';
import { StateManagerService } from '../shared/services/state-manager.service';

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule, FolderComponent, PasswordProtectedComponent, EmptyComponent, ChatComponent, DragDropControllerComponent, HeaderComponent, RouterOutlet, LoadingScreenComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit, OnDestroy {
    openedBags: Bag[] = [];
    deleteBar: boolean = false;
    chat = false;
    dragDropController = false;
    loading = true;
    subOpenedBags!: Subscription;
    subDragAndDrop!: Subscription;
    subLoadedUser!: Subscription;

    constructor(private dragDropService: DragDropService, private bagService: BagService, private cdr: ChangeDetectorRef, private userService: UserService, private stateManager: StateManagerService) { }

    ngOnInit(): void {
        this.initOpenedBags();
        this.initDragAndDrop();
        this.initLoadedUser();
        this.initLoadAllData();
    }

    ngOnDestroy(): void {
        this.subOpenedBags.unsubscribe();
        this.subDragAndDrop.unsubscribe();
        this.subLoadedUser.unsubscribe();
    }

    initOpenedBags() {
        this.subOpenedBags = this.bagService.openedBags$.subscribe(next => {
            this.openedBags = [...next];
            this.cdr.markForCheck();
        });
    }

    initDragAndDrop() {
        this.subDragAndDrop = this.dragDropService.dragDrop$.subscribe(next => {
            this.dragDropController = next;
            this.bagService.setDragAndDrop(next);
        });
    }

    initLoadedUser() {
        this.subLoadedUser = this.userService.user$.subscribe(() => this.loading = false);
    }

    initLoadAllData() {
        this.stateManager.loadAllData();
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
