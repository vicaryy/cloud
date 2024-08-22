import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewBagRequest, NewFileRequest, ServerResponse } from '../interfaces/http-interfaces';
import { Bag, MyFile, User } from '../models/content.models';
import { environment } from '../../../environments/environment.development';
import { ElementToEdit } from '../interfaces/alert-interfaces';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {

    constructor(private http: HttpClient) { }

    createBag(parentId: number, name: string): Observable<Bag> {
        const request: NewBagRequest = { id: parentId, name: name };
        return this.http.post<Bag>(environment.apiUrl + "/api/bag/create", request);
    }
    addNewFile(newFileRequest: NewFileRequest): Observable<MyFile> {
        return this.http.post<MyFile>(environment.apiUrl + "/api/file/create", newFileRequest);
    }
    deleteBag(bagId: number): Observable<void> {
        return this.http.delete<void>(environment.apiUrl + "/api/bag/delete/" + bagId);
    }
    changeBagName(bagId: number, newName: string): Observable<void> {
        return this.http.patch<void>(`${environment.apiUrl}/api/bag/edit/${bagId}`, {"name": newName});
    }
    deleteFile(element: ElementToEdit): Observable<void> {
        return this.http.delete<void>(environment.apiUrl + "/api/file/delete/" + element.id);
    }
    changeFileName(element: ElementToEdit): Observable<void> {
        return this.http.patch<void>(`${environment.apiUrl}/api/file/edit/${element.id}`, {"name": element.newName});
    }
    getUser(userId: number): Observable<User> {
        return this.http.get<User>(environment.apiUrl + "/api/user/" + userId);
    }
}
