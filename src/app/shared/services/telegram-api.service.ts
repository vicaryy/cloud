import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTelegram, Message, TelegramResponse } from '../interfaces/telegram-interfaces';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TelegramApiService {

    token = '7213892988:AAEbGdX8Od8DN868XspWWVf65A63TQ8p0Js';
    url = 'https://api.telegram.org/bot' + this.token;
    userId = '1935527130';

    constructor(private http: HttpClient) { }

    getFilePath(fileId: string): Observable<TelegramResponse<FileTelegram>> {
        return this.http.post<TelegramResponse<FileTelegram>>(this.url + "/getFile", { "file_id": fileId });
    }

    downloadBlob(filePath: string) {
        return this.http.get<Blob>(`https://api.telegram.org/file/bot${this.token}/${filePath}`, { responseType: 'blob' as 'json', reportProgress: true, observe: 'events' });
    }


    sendBlob(file: Blob) {
        const formData: FormData = new FormData();
        formData.append("document", file);
        formData.append("chat_id", this.userId);
        return this.http.post<TelegramResponse<Message>>(this.url + "/sendDocument", formData, { reportProgress: true, observe: 'events' });
    }

}
