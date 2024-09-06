import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm, RegisterForm } from '../interfaces/form.interfaces';
import { confirmPasswordValidator, passwordValidator } from '../validators/auth.validators';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor() { }

    getLoginForm(): FormGroup<LoginForm> {
        return new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), passwordValidator()])
        });
    }

    getRegisterForm(): FormGroup<RegisterForm> {
        const form = new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email]),
            password: new FormControl('', [Validators.required, Validators.minLength(8), passwordValidator()]),
            confirmPassword: new FormControl('', [Validators.required])
        });
        form.setControl('confirmPassword', new FormControl('', [Validators.required, confirmPasswordValidator(form.controls.password)]));
        return form;
    }
}
