import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from '../models/content.models';
import { BackendApiService } from './backend-api.service';
import { AlertService } from './alert.service';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userSubject = new Subject<User>();
    private user!: User | null;
    user$ = this.userSubject.asObservable();
    subGetUser!: Subscription;

    constructor(private backend: BackendApiService, private alertService: AlertService) { }

    loadUser(): void {
        this.subGetUser = this.backend.getUser().subscribe({
            next: user => {
                this.user = User.fromJSON(user);
                this.userSubject.next(this.user);
            },
            error: () => this.alertService.displayError("Fail in fetching user data")
        }
        );
    }

    get currentUser() {
        return this.user;
    }

    loadData() {
        this.loadUser();
    }

    clearData() {
        this.subGetUser.unsubscribe();
        this.user = null;
    }
}
