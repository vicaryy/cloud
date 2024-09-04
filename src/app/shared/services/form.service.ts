import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginForm, RegisterForm } from '../interfaces/form.interfaces';

@Injectable({
  providedIn: 'root'
})
export class FormService {

    constructor() { }

    getLoginForm(): FormGroup<LoginForm> {
        return new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    getRegisterForm(): FormGroup<RegisterForm> {
        return new FormGroup({
            email: new FormControl(''),
            password: new FormControl(''),
            repeatPassword: new FormControl('')
        });
    }
}
