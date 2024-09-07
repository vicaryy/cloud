import { Component, OnInit } from '@angular/core';
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
import { AlertService } from '../../shared/services/alert.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

    hide: boolean = true;
    waitForResponse = false;
    loginForm: FormGroup<LoginForm> = this.formService.getLoginForm();
    errorMessage = '';

    constructor(private formService: FormService, private googleService: GoogleService, private alertService: AlertService, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.initGoogleButton();
    }

    get controls() {
        return this.loginForm.controls;
    }

    onLogin() {
        console.log('Wysyłam do backendu login');
        console.log('Email: ');
        console.log(this.controls.email.value);
        console.log('Password: ');
        console.log(this.controls.password.value);
        this.waitForResponse = true;
        this.authService.login({ email: this.controls.email.value, password: this.controls.password.value }).subscribe({
            next: () => {
                localStorage.removeItem('verificationEmail');
                this.alertService.displayInfo("You have successfully logged in");
                this.waitForResponse = false;
                this.router.navigate([""]);
            },
            error: () => {
                this.alertService.displayError("Invalid login credentials. Try again");
                this.waitForResponse = false;
            }
        });
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

    initGoogleButton() {
        this.googleService.renderLoginButton(document.getElementById("google-button-login")!);
    }
}
