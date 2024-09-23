import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../shared/services/form.service';
import { LoginForm } from '../../shared/interfaces/form.interfaces';
import { GoogleService } from '../../shared/services/google.service';
import { MatProgressSpinner, MatSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../shared/services/auth.service';
import { SocialAuthService, GoogleSigninButtonModule, SocialUser } from '@abacritt/angularx-social-login';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner, GoogleSigninButtonModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit, OnDestroy {
    hide: boolean = true;
    waitForResponse = false;
    loginForm: FormGroup<LoginForm> = this.formService.getLoginForm();
    errorMessage = '';
    authSub!: Subscription;

    constructor(private formService: FormService, private googleService: GoogleService, private authService: AuthService, private socialAuth: SocialAuthService) { }

    ngOnInit(): void {
        this.authSub = this.socialAuth.authState.subscribe(user => {
            console.log(user);

            if (user) {
                this.onLoginWithGoogle(user);
                this.socialAuth.signOut();
            }
        });
    }

    ngOnDestroy(): void {
        this.authSub.unsubscribe();
    }

    get controls() {
        return this.loginForm.controls;
    }

    onLogin() {
        this.waitForResponse = true;
        this.authService.login({ email: this.controls.email.value, password: this.controls.password.value }).subscribe({
            next: () => this.waitForResponse = false,
            error: () => this.waitForResponse = false
        })
    }

    onLoginWithGoogle(user: SocialUser) {
        this.waitForResponse = true;
        this.authService.loginWithGoogle({ jwt: user.idToken }).subscribe({
            next: () => this.waitForResponse = false,
            error: () => this.waitForResponse = false
        })
    }

    getEmailErrorMessage(control: FormControl) {
        if (control.hasError('required'))
            return 'Email address is required.';

        return '';
    }

    getPasswordErrorMessage(control: FormControl) {
        if (control.hasError('required'))
            return 'Password is required.'

        return '';
    }
}
