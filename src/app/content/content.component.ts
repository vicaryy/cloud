import { Component, ElementRef, OnInit, QueryList, ViewChildren, numberAttribute } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag, File } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { ElementToEdit } from '../shared/interfaces/alert-interfaces';
import { Observable } from 'rxjs';

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

    onEdit(element: ElementToEdit) {
        if (element.bag) {
            if (element.changeName)
                this.changeBagName(element);
            if (element.delete)
                this.deleteBag(element);
        }

        if (element.file) {
            if (element.changeName)
                this.changeFileName(element)
            if (element.delete)
                this.deleteFile(element)
        }
    }

    private deleteFile(element: ElementToEdit) {
        this.bagService.deleteFile(element)
            .subscribe(e => {
                if (e.status === 200) { }
                //wyswietla modal z sukces
                else { }
                //wyswietla modal z cos poszlo nie tak
                //todo
            });

        this.deleteFileInRecursion(element.id, this.bags);
    }

    private deleteBag(element: ElementToEdit) {
        this.bagService.deleteBag(element)
            .subscribe(e => {
                if (e.status === 200) { }
                //wyswietla modal z sukces
                else { }
                //wyswietla modal z cos poszlo nie tak
                //todo
            });

        this.deleteBagInRecursion(element.id, this.bags);
    }

    private changeFileName(element: ElementToEdit) {
        this.bagService.changeFileName(element)
            .subscribe(e => {
                if (e.status === 200) { }
                //wyswietla modal z sukces
                else { }
                //wyswietla modal z cos poszlo nie tak
                //todo
            });

        this.changeFileNameInRecursion(element.id, element.newName!, this.bags);
    }

    private changeBagName(element: ElementToEdit) {
        this.bagService.changeBagName(element)
            .subscribe(e => {
                if (e.status === 200) { }
                //wyswietla modal z sukces
                else { }
                //wyswietla modal z cos poszlo nie tak
                //todo
            });
        this.changeBagNameInRecursion(element.id, element.newName!, this.bags);
    }

    private deleteBagInRecursion(id: number, bags: Bag[]): boolean {
        let deleted = false;

        for (let i = 0; i < bags.length; i++) {
            if (bags[i].id === id) {
                bags.splice(i, 1);
                return true;
            }

            deleted = this.deleteBagInRecursion(id, bags[i].bags);
        }

        return deleted;
    }
    private deleteFileInRecursion(id: number, bags: Bag[]): boolean {
        let deleted = false;

        for (const bag of bags) {

            for (let i = 0; i < bag.files.length; i++) {
                if (bag.files[i].id === id) {
                    bag.files.splice(i, 1);
                    return true;
                }
            }

            deleted = this.deleteFileInRecursion(id, bag.bags);
        }
        return deleted;
    }

    private changeBagNameInRecursion(id: number, newName: string, bags: Bag[]): boolean {
        let changed = false;
        for (const bag of bags) {

            if (bag.id === id) {
                bag.name = newName;
                return true;
            }

            changed = this.changeBagNameInRecursion(id, newName, bag.bags);
            if (changed)
                break;
        }
        return changed;
    }

    private changeFileNameInRecursion(id: number, newName: string, bags: Bag[]): boolean {
        let changed = false;
        for (const bag of bags) {
            for (let i = 0; i < bag.files.length; i++) {
                if (bag.files[i].id === id) {
                    const extension = bag.files[i].extension;
                    if (!newName.endsWith(extension))
                        newName = newName + extension;
                    bag.files[i].name = newName;
                    return true;
                }
            }
            changed = this.changeFileNameInRecursion(id, newName, bag.bags);
            if (changed)
                break;
        }
        return changed;
    }
}
