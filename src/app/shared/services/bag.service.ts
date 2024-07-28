import { Injectable } from '@angular/core';
import { BackendApiService } from './backend-api.service';
import { TelegramApiService } from './telegram-api.service';
import { CryptoService } from './crypto.service';
import { ElementToEdit } from '../interfaces/alert-interfaces';

@Injectable({
    providedIn: 'root'
})
export class BagService {
    highestIndex: number = 1;


    constructor(private backend: BackendApiService, private telegram: TelegramApiService, private crypto: CryptoService) { }

    deleteBag(element: ElementToEdit) {
        return this.backend.deleteBag(element);
    }

    createBag(parentId: number, name: string) {
        return this.backend.createBag(parentId, name);
    }

    changeBagName(element: ElementToEdit) {
        return this.backend.changeBagName(element);
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
