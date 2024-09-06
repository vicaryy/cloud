import { Injectable } from '@angular/core';
import { OAuth2Response } from '../interfaces/google.interfaces';

@Injectable({
    providedIn: 'root'
})
export class GoogleService {
    private _clientId = "400395304378-6vvb8q6ouglk0ne3k0tdtg77h7k848fq.apps.googleusercontent.com";

    constructor() { }

    renderLoginButton(element: HTMLElement) {
        // @ts-ignore
        google.accounts.id.initialize({
            client_id: this._clientId,
            callback: this.handleLogin.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
        });
        // @ts-ignore
        google.accounts.id.renderButton(
            element,
            {
                theme: "filled_blue",
                size: "large",
                width: "350",
                type: "standard",
                shape: "rectangular",
                text: "continue_with",
                logo_aligment: "left"
            }
        );
    }

    renderRegisterButton(element: HTMLElement) {
        // @ts-ignore
        google.accounts.id.initialize({
            client_id: this._clientId,
            callback: this.handleRegister.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
        });
        // @ts-ignore
        google.accounts.id.renderButton(
            element,
            {
                theme: "filled_blue",
                size: "large",
                width: "350",
                type: "standard",
                shape: "rectangular",
                text: "signup_with",
                logo_aligment: "left"
            }
        );
    }

    private async handleLogin(response: OAuth2Response) {
        console.log(response);
    }

    private async handleRegister(response: OAuth2Response) {
        console.log(response);
    }
}
