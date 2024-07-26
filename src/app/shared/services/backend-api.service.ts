import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NewBagRequest, NewFileRequest, ServerResponse } from '../interfaces/http-interfaces';
import { Bag, File, User } from '../models/content.models';
import { environment } from '../../../environments/environment.development';
import { ElementToEdit } from '../interfaces/alert-interfaces';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {

    constructor(private http: HttpClient) { }

    createBag(parentId: number, name: string): Observable<HttpResponse<Bag>> {
        const request: NewBagRequest = { id: parentId, name: name };
        return this.http.post<HttpResponse<Bag>>(environment.apiUrl + "/api/bag/create", request);
    }
    addNewFile(newFileRequest: NewFileRequest): Observable<HttpResponse<File>> {
        return this.http.post<HttpResponse<File>>(environment.apiUrl + "/api/file/create", newFileRequest);
    }
    deleteBag(element: ElementToEdit): Observable<HttpResponse<string>> {
        return this.http.delete<HttpResponse<string>>(environment.apiUrl + "/api/bag/delete/" + element.id);
    }
    changeBagName(element: ElementToEdit): Observable<HttpResponse<string>> {
        return this.http.patch<HttpResponse<string>>(`${environment.apiUrl}/api/bag/edit/${element.id}`, {"name": element.newName});
    }
    deleteFile(element: ElementToEdit): Observable<HttpResponse<string>> {
        return this.http.delete<HttpResponse<string>>(environment.apiUrl + "/api/file/delete/" + element.id);
    }
    changeFileName(element: ElementToEdit): Observable<HttpResponse<string>> {
        return this.http.patch<HttpResponse<string>>(`${environment.apiUrl}/api/file/edit/${element.id}`, {"name": element.newName});
    }
    getUser(userId: number): Observable<User> {
        return this.http.get<User>(environment.apiUrl + "/api/user/" + userId);
    }
}
