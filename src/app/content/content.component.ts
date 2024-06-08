import { Component, ElementRef, OnInit, QueryList, ViewChildren, numberAttribute } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag, File } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { ElementToEdit } from '../shared/interfaces/alert-interfaces';
import { Observable } from 'rxjs';
import { InfoComponent } from "../shared/components/info/info.component";
import { Info } from '../shared/models/alert.models';

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule, FolderComponent, InfoComponent]
})
export class ContentComponent implements OnInit {
    bags: Bag[] = new Array();
    @ViewChildren("bag") activeBags!: QueryList<BagComponent>;
    info: Info | undefined;

    constructor(private bagService: BagService) { }

    ngOnInit(): void {
        let bagFile1 = new File(55, 'photo-ac123-445.png', ".png", "5MB", new Date('2024-06-07T12:30:00'));
        let bagFile2 = new File(57, 'wczasy.png', ".png", "15MB", new Date('2024-06-07T12:30:00'));
        let bagFile3 = new File(62, 'selfie.jpg', ".jpg", "2MB", new Date('2024-06-07T12:30:00'));
        let bagFile4 = new File(99, 'zoo.jpg', ".jpg", "8MB", new Date('2024-06-07T12:30:00'));

        let mainBagFile1 = new File(10, 'metin2.exe', ".exe", "500MB", new Date('2024-06-07T12:30:00'));
        let mainBagFile2 = new File(11, 'photo-ac123-445.png', ".png", "5MB", new Date('2024-06-07T12:30:00'));
        let mainBagFile3 = new File(13, 'harry potter i wiezien azkabanu.mov', ".mov", "2GB", new Date('2024-06-07T12:30:00'));
        let bag1: Bag = new Bag(5, "images", "/", new Date('2024-06-07T12:30:00'), "10MB", [], [bagFile1, bagFile2, bagFile3, bagFile4]);
        let mainBag: Bag = new Bag(1, 'Main Bag', "", new Date('2024-06-07T12:30:00'), "50MB", [bag1], [mainBagFile1, mainBagFile2, mainBagFile3]);

        this.bags.push(mainBag);
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
}
