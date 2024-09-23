import { Injectable } from '@angular/core';
import { LoginCredentials, RegisterCredentials, Verification } from '../interfaces/form.interfaces';
import { OAuth2Response } from '../interfaces/google.interfaces';
import { BackendApiService } from './backend-api.service';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { StateManagerService } from './state-manager.service';
import { catchError, tap, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Storage } from '../security/security';
import { ChangePasswordRequest, LoginWithGoogleRequest } from '../interfaces/backend.interfaces';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(private backend: BackendApiService, private router: Router, private alertService: AlertService, private stateManager: StateManagerService) { }

    login(credentials: LoginCredentials) {
        return this.backend.login(credentials).pipe(tap(() => {
            localStorage.removeItem('verificationEmail');
            this.alertService.displayInfo("Successfully logged in");
            this.router.navigate([""]);
        }),
            catchError((err: HttpErrorResponse) => {
                const result: string = err.error.result;
                if (result.toLowerCase().startsWith('email not verified')) {
                    localStorage.setItem('verificationEmail', credentials.email);
                    this.router.navigate(['/auth/confirmation']).then(() => this.alertService.displayInfo("To continue, you have to verify your account."));
                }
                else
                    this.alertService.displayError("Invalid login credentials, try again");
                return throwError(() => err);
            }));
    }

    register(credentials: RegisterCredentials) {
        return this.backend.register(credentials).pipe(
            tap(user => {
                this.alertService.displayInfo('Account created successfully')
                localStorage.setItem('verificationEmail', user.email)
                this.router.navigate(['/auth/confirmation']);
            }),
            catchError(err => {
                const error = err as HttpErrorResponse;
                this.alertService.displayError(error.error.result)
                return throwError(() => err);
            })
        );
    }

    loginWithGoogle(request: LoginWithGoogleRequest) {
        return this.backend.loginWithGoogle(request).pipe(
            tap(() => {
                localStorage.removeItem('verificationEmail');
                this.alertService.displayInfo("Successfully logged in");
                this.router.navigate([""]);
            }),
            catchError(err => {
                this.alertService.displayError("Cannot login with Google, please try again.")
                return throwError(() => err);
            })
        );
    }

    verificate(verification: Verification) {
        return this.backend.verificate(verification).pipe(
            tap(() => {
                localStorage.removeItem('verificationEmail');
                this.alertService.displayInfo("Email verified successfully");
                this.router.navigate([""]);
            }),
            catchError(err => {
                this.alertService.displayError("Invalid code, try again");
                return throwError(() => err);
            }));
    }

    resendVerificateCode(userEmail: string) {
        return this.backend.resendVerificateCode(userEmail).pipe(
            catchError(err => {
                this.alertService.displayError('Something goes wrong, try again.');
                return throwError(() => err);
            })
        );
    }

    forgotPassword(email: string) {
        return this.backend.forgotPassword(email).pipe(
            catchError(err => {
                if (err.status === 404)
                    this.alertService.displayError('User does not exists.');
                else
                    this.alertService.displayError('Something goes wrong, try again.');
                return throwError(() => err);
            })
        );
    }

    changePassword(request: ChangePasswordRequest) {
        return this.backend.changePassword(request).pipe(
            catchError(err => {
                this.alertService.displayError('Something goes wrong, try again.');
                return throwError(() => err);
            })
        );
    }

    logout() {
        this.stateManager.clearAllData();
        Storage.removeJwt();
        this.router.navigate(["/auth/login"]).then(() => this.alertService.displayInfo('Successfully logged out.'));
    }
}
