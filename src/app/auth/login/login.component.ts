import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormService } from '../../shared/services/form.service';
import { LoginForm } from '../../shared/interfaces/form.interfaces';
import { GoogleService } from '../../shared/services/google.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
    hide: boolean = true;
    loginForm: FormGroup<LoginForm> = this.formService.getLoginForm();
    errorMessage = ''

    constructor(private formService: FormService, private googleService: GoogleService) { }

    ngOnInit(): void {
        this.initGoogleButton();
    }

    get controls() {
        return this.loginForm.controls;
    }

    getEmailErrorMessage(control: FormControl) {
        if (control.hasError('required')) {
            return 'Email address is required'
        }
        return '';
    }

    initGoogleButton() {
        this.googleService.renderLoginButton(document.getElementById("google-button-login")!);
    }
}
