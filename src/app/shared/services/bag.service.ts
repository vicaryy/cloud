import { Injectable } from '@angular/core';
import { ElementToEdit } from '../interfaces/alert-interfaces';
import { BehaviorSubject, firstValueFrom, lastValueFrom, Observable, Subject, tap } from 'rxjs';
import { NewBagRequest, NewFileRequest, ServerResponse } from '../interfaces/http-interfaces';
import { Bag, File } from '../models/content.models';
import { HttpClient, HttpEvent, HttpResponse } from '@angular/common/http';
import { FileTelegram, Message, TelegramResponse } from '../interfaces/telegram-interfaces';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class BagService {




    highestIndex: number = 1;
    token = '7213892988:AAEbGdX8Od8DN868XspWWVf65A63TQ8p0Js';
    url = 'https://api.telegram.org/bot' + this.token;
    userId = '1935527130';

    constructor(private http: HttpClient) { }


    getFilePath(fileId: string): Observable<TelegramResponse<FileTelegram>> {
        return this.http.post<TelegramResponse<FileTelegram>>(this.url + "/getFile", { "file_id": fileId });
    }

    downloadBlobFromTelegram(filePath: string) {
        return this.http.get<Blob>(`https://api.telegram.org/file/bot${this.token}/${filePath}`, { responseType: 'blob' as 'json', reportProgress: true, observe: 'events' });
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


    addNewBag(parentId: number, name: string): Observable<ServerResponse<Bag>> {
        const request: NewBagRequest = { id: parentId, name: name };
        return this.http.post<ServerResponse<Bag>>(environment.apiUrl + "/api/bag/create", request);
    }

    sendBlobToTelegram(file: Blob): Observable<TelegramResponse<Message>> {
        const formData: FormData = new FormData();
        formData.append("document", file);
        formData.append("chat_id", this.userId);
        return this.http.post<TelegramResponse<Message>>(this.url + "/sendDocument", formData);
    }

    sendNewFileToServer(newFileRequest: NewFileRequest): Observable<ServerResponse<File>> {
        return this.http.post<ServerResponse<File>>(environment.apiUrl + "/api/file/create", newFileRequest);
    }

    deleteBag(element: ElementToEdit): Observable<ServerResponse<string>> {
        return this.http.post<ServerResponse<string>>(environment.apiUrl + "/api/bag/delete/" + element.id, null);
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
