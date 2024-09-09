import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgotPasswordForm, LoginForm, RegisterForm, VerificationCodeForm } from '../interfaces/form.interfaces';
import { confirmPasswordValidator, passwordValidator } from '../validators/auth.validators';

@Injectable({
    providedIn: 'root'
})
export class FormService {

    constructor() { }

    getLoginForm(): FormGroup<LoginForm> {
        return new FormGroup({
            email: new FormControl('', [Validators.required]),
            password: new FormControl('', [Validators.required])
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

    getVerificationCodeForm(): FormGroup<VerificationCodeForm> {
        return new FormGroup({
            inputFirst: new FormControl(''),
            inputSecond: new FormControl(''),
            inputThird: new FormControl(''),
            inputFourth: new FormControl(''),
        })
    }

    getForgotPasswordForm(): FormGroup<ForgotPasswordForm> {
        return new FormGroup({
            email: new FormControl('', [Validators.required, Validators.email])
        })
    }
}
