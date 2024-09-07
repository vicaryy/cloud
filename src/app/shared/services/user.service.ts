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
        this.getUser().subscribe({
            next: user => {
                this.user = User.fromJSON(user);
                this.userSubject.next(this.user);
                this.userSubject.complete();
            },
            error: () => this.alertService.displayError("Fail in fetching user data")
        }
        );
    }

    private getUser(): Observable<User> {
        return this.backend.getUser();
    }

    get currentUser() {
        return this.user;
    }
}
