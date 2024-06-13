import { Component, ElementRef, OnInit, QueryList, ViewChildren, numberAttribute } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag, File, User } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { ElementToEdit } from '../shared/interfaces/alert-interfaces';
import { Observable } from 'rxjs';
import { InfoComponent } from "../shared/components/info/info.component";
import { Info } from '../shared/models/alert.models';
import { FileState } from '../shared/enums/content.enums';
import { UserService } from '../shared/services/user.service';

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

    constructor(private bagService: BagService, private userService: UserService) { }

    ngOnInit(): void {
        this.userService.getUser(7).subscribe(e => {
            this.user = User.fromJSON(e.data!);
            this.bags = this.user.bags;
        });
    }

    onFocusEvent($event: HTMLElement) {
        this.unfocusActiveBags();
        this.focusBag($event);
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
        console.log($event);

        this.bags.push($event);
    }
}
