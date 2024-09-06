import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { GoogleService } from '../../shared/services/google.service';
import { AlertService } from '../../shared/services/alert.service';
import { AuthService } from '../../shared/services/auth.service';
import { RegisterForm } from '../../shared/interfaces/form.interfaces';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    hideFirst: boolean = true;
    hideSecond: boolean = true;
    waitForResponse = false;
    registerForm: FormGroup<RegisterForm> = this.formService.getRegisterForm();
    errorMessage = '';
    repeatPasswordErrorMessage = '';

    constructor(private formService: FormService, private googleService: GoogleService, private alertService: AlertService, private authService: AuthService, private router: Router) { }

    ngOnInit(): void {
        this.initGoogleButton();
    }

    initGoogleButton() {
        this.googleService.renderRegisterButton(document.getElementById("google-button-register")!);
    }

    get controls() {
        return this.registerForm.controls;
    }

    getEmailErrorMessage(control: FormControl) {
        if (control.hasError('required'))
            return 'Email address is required.'

        if (control.hasError('email'))
            return 'Invalid email address.'

        return '';
    }

    getPasswordErrorMessage(control: FormControl) {
        if (control.hasError('required'))
            return 'Password is required.'

        if (control.hasError('minlength'))
            return 'Password must contain at least 8 letters.';

        if (control.hasError('noSpecialChar'))
            return 'Password must contain a special character.';

        if (control.hasError('noUppercase'))
            return 'Password must contain an uppercase letter.';

        if (control.hasError('noLowercase'))
            return 'Password must contain a lowercase letter.';

        if (control.hasError('noNumber'))
            return 'Password must contain a number.';

        return '';
    }

    getConfirmPasswordErrorMessage(control: FormControl) {
        if (control.hasError('required'))
            return 'Confirm password is required.';

        if (control.hasError('noConfirm'))
            return 'Passwords are not the same.';

        return '';
    }

    onRegister() {
        this.waitForResponse = true;
        this.authService.register({ email: this.controls.email.value, password: this.controls.password.value }).subscribe({
            next: () => {
                this.alertService.displayInfo('Account created successfully')
                this.waitForResponse = false;
                this.router.navigate(['/auth/confirmation']);
            },
            error: (err) => {
                const error = err as HttpErrorResponse;
                this.alertService.displayError(error.error.result)
                this.waitForResponse = false;
            }
        });
    }
}
