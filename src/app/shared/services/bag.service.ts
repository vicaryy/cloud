import { Injectable } from '@angular/core';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ServerResponse } from '../interfaces/http-interfaces';
import { Bag } from '../models/content.models';
import { HttpClient } from '@angular/common/http';
import { Message } from '../interfaces/telegram-interfaces';

@Injectable({
    providedIn: 'root'
})
export class BagService {
    highestIndex: number = 1;
    token = '7213892988:AAEbGdX8Od8DN868XspWWVf65A63TQ8p0Js';
    url = 'https://api.telegram.org/bot' + this.token;
    userId = '1935527130';

    constructor(private http: HttpClient) { }

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

    addNewFile(file: Blob) {
        const formData: FormData = new FormData();
        formData.append("document", file);
        formData.append("chat_id", this.userId);
        return this.http.post(this.url + "/sendDocument", formData).subscribe(e => console.log(e));
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
