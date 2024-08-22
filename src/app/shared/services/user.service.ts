import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { User } from '../models/content.models';
import { environment } from '../../../environments/environment.development';
import { BackendApiService } from './backend-api.service';
import { InfoService } from './info.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private userSubject = new AsyncSubject<User>();
    private user!: User;
    user$ = this.userSubject.asObservable();

    constructor(private backend: BackendApiService, private infoService: InfoService) {
        this.loadUser();
    }

    loadUser(): void {
        this.getUser(7).subscribe({
            next: user => {
                this.user = User.fromJSON(user);
                this.userSubject.next(this.user);
                this.userSubject.complete();
            },
            error: () => this.infoService.displayError("Fail in fetching user")
        }
        );
    }

    private getUser(userId: number): Observable<User> {
        return this.backend.getUser(userId);
    }

    getCurrentUser() {
        return this.user;
    }
}
