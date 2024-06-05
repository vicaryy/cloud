import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BagService {

    highestIndex: number = 1;

    constructor() { }

    focusElement(element: HTMLElement) {
        element.style.zIndex = `${this.highestIndex++}`;
        element.style.backgroundColor = `var(--bag-color-focus)`;
    }

    unfocusElement(element: HTMLElement) {
        element.style.backgroundColor = `var(--bag-color)`;
    }
}
