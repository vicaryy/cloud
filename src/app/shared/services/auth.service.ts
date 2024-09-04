import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor() { }

    getLoginForm(): FormGroup<any> {
        return new FormGroup({
            email: new FormControl('', Validators.required),
            password: new FormControl('', Validators.required)
        });
    }

    getRegisterForm(): FormGroup<any> {
        return new FormGroup({
            email: new FormControl(''),
            password: new FormControl(''),
            repeatPassword: new FormControl('')
        });
    }
}
