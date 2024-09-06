import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginCredentials, RegisterCredentials } from '../interfaces/form.interfaces';
import { OAuth2Response } from '../interfaces/google.interfaces';
import { BackendApiService } from './backend-api.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(private backend: BackendApiService) { }

    login(credentials: LoginCredentials) {
        return this.backend.login(credentials);
    }

    register(credentials: RegisterCredentials) {
        return this.backend.register(credentials);
    }

    continueWithGoogle(credentials: OAuth2Response) {

    }
}
