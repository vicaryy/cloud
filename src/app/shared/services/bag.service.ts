import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { TelegramApiService } from './telegram-api.service';
import { CryptoService } from './crypto.service';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { Bag, MyFile } from '../models/content.models';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class BagService {
    highestIndex: number = 1;
    private _openedBags: Subject<Bag[]> = new Subject<Bag[]>;
    private _refreshBag = new Subject<number>;
    private _focusBag = new Subject<number>;
    private _sortBag = new Subject<number>;
    private _searchedFiles = new BehaviorSubject<MyFile[]>([]);
    private _scrollToFile = new Subject<number>;
    private _dragAndDrop = new BehaviorSubject<boolean>(false);
    private bags: Bag[] = [];
    private openedBags: Bag[] = [];
    private searchedFiles: MyFile[] = [];
    private dragAndDrop = false;
    dragAndDropOnBag = false;
    openedBags$: Observable<Bag[]> = this._openedBags.asObservable();
    refreshBag$ = this._refreshBag.asObservable();
    focusBag$ = this._focusBag.asObservable();
    sortBag$ = this._sortBag.asObservable();
    searchedFiles$ = this._searchedFiles.asObservable();
    scrollToFile$ = this._scrollToFile.asObservable();
    dragAndDrop$ = this._dragAndDrop.asObservable();

    constructor(private userService: UserService, private backend: BackendApiService, private telegram: TelegramApiService, private crypto: CryptoService, private alertService: AlertService) {
        this.loadBags();
    }

    clearData() {
        this.highestIndex = 1;
        this.bags = [];
        this.openedBags = [];
        this.searchedFiles = [];
    }

    private loadBags() {
        this.userService.user$.subscribe({
            next: user => {
                this.bags = user.bags;
                this.bags[0].x = 100;
                this.bags[0].y = 250;
                this.emitOpenedBags();
            }
        });
    }

    scrollToFile(id: number) {
        this._scrollToFile.next(id);
    }

    setDragAndDrop(dragAndDrop: boolean) {
        if (dragAndDrop !== this.dragAndDrop) {
            this.dragAndDrop = dragAndDrop;
            this._dragAndDrop.next(this.dragAndDrop);
        }
    }

    searchFiles(word: string) {
        this.searchedFiles = this.searchFilesRecursive(word, this.bags);
        this.emitSearchedFiles();
    }

    private searchFilesRecursive(word: string, bags: Bag[]): MyFile[] {
        const found: MyFile[] = [];

        for (const bag of bags) {
            if (bag.bags)
                found.push(...this.searchFilesRecursive(word, bag.bags));
            for (const file of bag.files)
                if (file.name.toLowerCase().includes(word.toLowerCase()))
                    found.push(file);
        }
        return found;
    }

    private emitOpenedBags() {
        this._openedBags.next(this.openedBags);
    }

    private emitSearchedFiles() {
        this._searchedFiles.next(this.searchedFiles);
    }

    removeOpenedBag(id: number) {
        this.openedBags = this.openedBags.filter(e => e.id !== id);
        this.emitOpenedBags();
    }

    createBag(parentId: number, name: string) {
        return this.backend.createBag(parentId, name);
    }

    openBagByFileId(id: number) {
        const bag = this.getBagFromMainBagByFileId(id);
        if (bag) {
            this.setOpenBagCoords(bag);
            this.openBag(bag);
            setTimeout(() => this.scrollToFile(id), 200);
        }
    }

    private setOpenBagCoords(bag: Bag) {
        bag.x = window.innerWidth / 2 - 150;
        bag.y = window.innerHeight / 2 - 200;
    }

    openBag(bag: Bag) {
        if (this.openedBags.find(e => e.id === bag.id)) {
            this.focusBag(bag.id);
            return;
        }
        this.openedBags.push(bag);
        this.emitOpenedBags();
    }

    openMainBag() {
        this.openedBags = [this.bags[0]];
        this.emitOpenedBags();
    }

    addFileAsView(bagId: number, newFile: MyFile) {
        for (let i = 0; i < this.openedBags.length; i++) {
            if (bagId === this.openedBags[i].id) {
                this.openedBags[i].files.push(newFile);
                this._refreshBag.next(bagId);
                break;
            }
        }
    }

    changeBagName(bagId: number, newName: string) {
        this.backend.changeBagName(bagId, newName).subscribe({
            next: () => {
                const bag = this.getBagFromMainBag(bagId);
                if (bag) {
                    bag.name = newName;
                    this._refreshBag.next(bagId);
                    this.alertService.displaySuccess(`Successfully changed bag name to: ${newName}`);
                }
            },
            error: (error) => {
                this.alertService.displayError(`Error in changing bag name to: ${newName}`);
            }
        });
    }

    deleteBag(bagId: number) {
        this.backend.deleteBag(bagId).subscribe({
            next: () => {
                const bag = this.deleteBagFromMainBag(bagId);
                if (bag) {
                    this.deleteBagFromOpenedBags(bagId);
                    this._refreshBag.next(bagId);
                    this.alertService.displaySuccess(`Successfully deleted bag`);
                }
            },
            error: () => {
                this.alertService.displayError(`Error in deleteing bag`);
            }
        });
    }

    deleteFileFromBag(id: number, parentBagId: number) {
        const parentBag = this.getBagFromMainBag(parentBagId);
        if (!parentBag)
            return;

        for (let i = 0; i < parentBag.files.length; i++) {
            if (parentBag.files[i].id === id) {
                parentBag.files.splice(i, 1);
                this._refreshBag.next(parentBagId);
                break;
            }
        }
    }

    private deleteBagFromOpenedBags(id: number) {
        for (let i = 0; i < this.openedBags.length; i++) {
            if (this.openedBags[i].id === id) {
                this.openedBags.splice(i, 1);
                this.emitOpenedBags();
                break;
            }
        }
    }

    private deleteBagFromMainBag(id: number) {
        return this.deleteBagByIdRecursive(id, this.bags);
    }

    private deleteBagByIdRecursive(id: number, bags: Bag[]): boolean {
        for (let i = 0; i < bags.length; i++) {
            if (bags[i].id === id) {
                bags.splice(i, 1);
                return true;
            }
            if (bags[i].bags) {
                let deleted = this.deleteBagByIdRecursive(id, bags[i].bags);
                if (deleted)
                    return deleted;
            }
        }
        return false;
    }

    private getBagFromMainBagByFileId(id: number) {
        return this.getBagFromMainBagByFileIdRevursive(id, this.bags);
    }

    private getBagFromMainBagByFileIdRevursive(id: number, bags: Bag[]): Bag | null {
        for (const bag of bags) {
            if (bag.bags) {
                const foundBag = this.getBagFromMainBagByFileIdRevursive(id, bag.bags);
                if (foundBag)
                    return foundBag;
            }
            for (const file of bag.files)
                if (file.id === id)
                    return bag;
        }
        return null;
    }

    private getBagFromMainBag(id: number) {
        return this.getBagByIdRecursive(id, this.bags);
    }

    private getBagByIdRecursive(id: number, bags: Bag[]): Bag | null {
        for (const bag of bags) {
            if (bag.id === id)
                return bag;
            if (bag.bags) {
                let foundBag = this.getBagByIdRecursive(id, bag.bags);
                if (foundBag)
                    return foundBag;
            }
        }
        return null;
    }

    focusBag(id: number) {
        this._focusBag.next(id);
    }

    sortBag(id: number) {
        this._sortBag.next(id);
    }

}
