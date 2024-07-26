import { Component, ElementRef, OnInit, QueryList, ViewChildren, numberAttribute } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag, File, User } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { InfoComponent } from "../shared/components/info/info.component";
import { Info } from '../shared/models/alert.models';
import { UserService } from '../shared/services/user.service';
import { DragBagEnd } from '../shared/interfaces/content.interfaces';

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule, FolderComponent, InfoComponent]
})
export class ContentComponent implements OnInit {
    user!: User;
    bags: Bag[] = new Array();
    @ViewChildren("bag") activeBags!: QueryList<BagComponent>;
    info: Info | undefined;
    deleteBar: boolean = false;

    constructor(private bagService: BagService, private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getUser(7).subscribe({
            next: user => {
                this.user = User.fromJSON(user);
                this.bags = this.user.bags;
                this.bags[0].x = 100;
                this.bags[0].y = 250;
            },
            error: error => {
                console.log("Error: ", error);
                error.
            }
        });
    }

    onDeleteActiveChildBag($event: number) {
        this.deleteActiveBag($event);
    }

    deleteActiveBag(id: number) {
        this.bags = this.bags.filter(e => e.id !== id);
    }

    onFocusEvent($event: HTMLElement) {
        this.unfocusActiveBags();
        this.focusBag($event);
    }

    onDragStart() {
        this.deleteBar = true;
    }

    onDragEnd($event: DragBagEnd) {
        if ($event.x < 140)
            this.deleteActiveBag($event.id);
        this.deleteBar = false;
    }

    onFocusOnlyEvent($event: HTMLElement) {
        this.bagService.focusOnlyElement($event);
    }


    unfocusActiveBags() {
        this.activeBags.forEach(e => this.bagService.unfocusElement(e.bagElement.nativeElement));
    }

    focusBag(element: HTMLElement) {
        this.bagService.focusElement(element);
    }
    onInfo(event: Info) {
        this.info = event;
        setTimeout(() => this.info = undefined, 4000);
    }
    onOpenBag($event: Bag) {
        if (!this.bags.find(e => e.id === $event.id))
            this.bags = [...this.bags, $event];
    }

    trackById(index: number, bag: any): any {
        return bag.id;
    }
}
