import { Component, OnInit } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule]
})
export class ContentComponent implements OnInit {

    bags: Bag[] = new Array();

    constructor(private bagService: BagService) { }

    ngOnInit(): void {
        this.bags.push(new Bag('Main Bag', new Array(), new Array()));
        this.bags.push(new Bag('/photos', new Array(), new Array()));
        this.bags.push(new Bag('/photos/wedding', new Array(), new Array()));
    }
}
