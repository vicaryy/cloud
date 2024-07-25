import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewBagRequest, NewFileRequest, ServerResponse } from '../interfaces/http-interfaces';
import { Bag, File } from '../models/content.models';
import { environment } from '../../../environments/environment.development';
import { ElementToEdit } from '../interfaces/alert-interfaces';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {

    constructor(private http: HttpClient) { }

    createBag(parentId: number, name: string): Observable<ServerResponse<Bag>> {
        const request: NewBagRequest = { id: parentId, name: name };
        return this.http.post<ServerResponse<Bag>>(environment.apiUrl + "/api/bag/create", request);
    }

    addNewFile(newFileRequest: NewFileRequest): Observable<ServerResponse<File>> {
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
        return this.http.delete<ServerResponse<string>>(environment.apiUrl + "/api/file/delete/" + element.id);
    }
    changeFileName(element: ElementToEdit): Observable<ServerResponse<string>> {
        const sub = new BehaviorSubject({ status: 200 });
        return sub;
    }
}
