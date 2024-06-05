import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule, FolderComponent]
})
export class ContentComponent implements OnInit {

    bags: Bag[] = new Array();
    @ViewChildren("bag") activeBags!: QueryList<BagComponent>;

    constructor(private bagService: BagService) { }

    ngOnInit(): void {
        this.bags.push(new Bag('Main Bag', new Array(), new Array()));
        this.bags.push(new Bag('/photos', new Array(), new Array()));
        this.bags.push(new Bag('/photos/wedding', new Array(), new Array()));
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
}
