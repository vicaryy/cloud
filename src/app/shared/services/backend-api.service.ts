import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ChangePasswordRequest, LoginWithGoogleRequest, NewBagRequest, NewFileRequest } from '../interfaces/backend.interfaces';
import { Bag, MyFile, User } from '../models/content.models';
import { environment } from '../../../environments/environment.development';
import { LoginCredentials, RegisterCredentials, Verification } from '../interfaces/form.interfaces';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {
    constructor(private http: HttpClient) { }

    login(credentials: LoginCredentials): Observable<User> {
        return this.http.post<User>(environment.apiUrl + "/auth/login", credentials);
    }
    register(credentials: RegisterCredentials): Observable<User> {
        return this.http.post<User>(environment.apiUrl + "/auth/register", credentials);
    }
    loginWithGoogle(credentials: LoginWithGoogleRequest) {
        return this.http.post<User>(environment.apiUrl + "/auth/google", credentials);
    }
    verificate(verification: Verification): Observable<void> {
        return this.http.post<void>(environment.apiUrl + "/auth/verify", verification);
    }
    resendVerificateCode(userEmail: string) {
        return this.http.post<void>(environment.apiUrl + "/auth/verify/resend", { "email": userEmail });
    }
    forgotPassword(email: string) {
        return this.http.post<void>(environment.apiUrl + "/auth/forgot", { "email": email });
    }
    changePassword(request: ChangePasswordRequest): Observable<void> {
        return this.http.patch<void>(environment.apiUrl + "/auth/forgot", request);
    }
    getRandomPassword(): Observable<string> {
        return this.http.get<string>(environment.apiUrl + "randomPassword");
    }

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
        return this.http.patch<void>(`${environment.apiUrl}/api/bag/edit/${bagId}`, { "name": newName });
    }
    deleteFile(id: number): Observable<void> {
        return this.http.delete<void>(environment.apiUrl + "/api/file/delete/" + id);
    }
    changeFileName(id: number, newName: string): Observable<void> {
        return this.http.patch<void>(`${environment.apiUrl}/api/file/edit/${id}`, { "name": newName });
    }
    getUser(): Observable<User> {
        return this.http.get<User>(environment.apiUrl + "/api/user");
    }
}
