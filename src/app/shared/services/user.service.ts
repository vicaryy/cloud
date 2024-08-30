import { Injectable } from '@angular/core';
import { AsyncSubject, Observable } from 'rxjs';
import { User } from '../models/content.models';
import { BackendApiService } from './backend-api.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
    private userSubject = new AsyncSubject<User>();
    private user!: User;
    user$ = this.userSubject.asObservable();

    constructor(private backend: BackendApiService, private alertService: AlertService) {
        this.loadUser();
    }

    loadUser(): void {
        this.getUser(7).subscribe({
            next: user => {
                this.user = User.fromJSON(user);
                this.userSubject.next(this.user);
                this.userSubject.complete();
            },
            error: () => this.alertService.displayError("Fail in fetching user")
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
