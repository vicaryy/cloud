import { Injectable } from '@angular/core';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ServerResponse } from '../interfaces/http-interfaces';
import { Bag } from '../models/content.models';

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


    addNewBag(name: string, directory: string): Observable<ServerResponse<Bag>> {
        let bag = new Bag(Math.floor(Math.random() * 1000) + 1, name, directory, new Date(), "0MB", [], []);
        const sub = new BehaviorSubject<ServerResponse<Bag>>({ status: 200, data: bag });
        return sub;
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
