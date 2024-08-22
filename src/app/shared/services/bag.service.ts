import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { TelegramApiService } from './telegram-api.service';
import { CryptoService } from './crypto.service';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { Observable, Subject } from 'rxjs';
import { UserService } from './user.service';
import { Bag } from '../models/content.models';
import { InfoService } from './info.service';

@Injectable({
    providedIn: 'root'
})
export class BagService {
    highestIndex: number = 1;
    private openedBagsSubject: Subject<Bag[]> = new Subject<Bag[]>;
    private refreshFolder = new Subject<number>;
    private bags!: Bag[];
    private openedBags!: Bag[];
    openedBags$: Observable<Bag[]> = this.openedBagsSubject.asObservable();
    refreshFolder$ = this.refreshFolder.asObservable();

    constructor(private userService: UserService, private backend: BackendApiService, private telegram: TelegramApiService, private crypto: CryptoService, private infoService: InfoService) {
        this.loadBags();
    }

    private loadBags() {
        this.userService.user$.subscribe({
            next: user => {
                this.bags = user.bags;
                this.openedBags = [...this.bags];
                this.emitOpenedBags();
            }
        });
    }

    private emitOpenedBags() {
        this.openedBagsSubject.next(this.openedBags);
    }

    createBag(parentId: number, name: string) {
        return this.backend.createBag(parentId, name);
    }

    openBag(bag: Bag) {
        if (this.openedBags.find(e => e.id === bag.id))
            return;
        this.openedBags.push(bag);
        this.emitOpenedBags();
    }

    changeBagName(bagId: number, newName: string) {
        this.backend.changeBagName(bagId, newName).subscribe({
            next: () => {
                const bag = this.getBagFromMainBag(bagId);
                if (bag) {
                    bag.name = newName;
                    this.refreshFolder.next(bagId);
                    this.infoService.displaySuccess(`Successfully changed bag name to: ${newName}`);
                }
            },
            error: (error) => {
                this.infoService.displayError(`Error in changing bag name to: ${newName}`);
            }
        });
    }

    deleteBag(bagId: number) {
        this.backend.deleteBag(bagId).subscribe({
            next: () => {
                const bag = this.deleteBagFromMainBag(bagId);
                if (bag) {
                    this.deleteBagFromOpenedBags(bagId);
                    this.refreshFolder.next(bagId);
                    this.infoService.displaySuccess(`Successfully deleted bag`);
                }
            },
            error: () => {
                this.infoService.displayError(`Error in deleteing bag`);
            }
        });
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

    focusElement(element: HTMLElement) {
        element.style.zIndex = `${this.highestIndex++}`;
        element.style.backgroundColor = `var(--bag-color-focus)`;
    }

    focusOnlyElement(element: HTMLElement) {
        element.style.backgroundColor = `var(--bag-color-focus)`;
    }

    unfocusElement(element: HTMLElement) {
        element.style.backgroundColor = `var(--bag-color)`;
    }


}
