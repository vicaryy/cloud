import { Injectable } from '@angular/core';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ServerResponse } from '../interfaces/http-interfaces';

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


    // todo
    deleteBag(element: ElementToEdit): Observable<ServerResponse<string>> {
        const sub = new BehaviorSubject({ status: 200 });
        return sub;
    }
    changeBagName(element: ElementToEdit): Observable<ServerResponse<string>> {
        const sub = new BehaviorSubject({ status: 200 });
        return sub;
    }
    deleteFile(element: ElementToEdit): Observable<ServerResponse<string>> {
        const sub = new BehaviorSubject({ status: 200 });
        return sub;
    }
    changeFileName(element: ElementToEdit): Observable<ServerResponse<string>> {
        const sub = new BehaviorSubject({ status: 200 });
        return sub;
    }
}
