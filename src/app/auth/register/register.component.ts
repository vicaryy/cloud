import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButton, MatIconModule, RouterLink],
    templateUrl: './register.component.html',
    styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
    hideFirst: boolean = true;
    hideSecond: boolean = true;

    constructor() {

    }

    ngOnInit(): void {
        // const asd = document.createElement('div');
        // asd.id = 'google-button';
        // document.querySelector('.social-buttons')?.appendChild(asd);
        // @ts-ignore
        google.accounts.id.initialize({
            client_id: "400395304378-6vvb8q6ouglk0ne3k0tdtg77h7k848fq.apps.googleusercontent.com",
            callback: this.handleCredentialResponse.bind(this),
            auto_select: false,
            cancel_on_tap_outside: true,
        });

        // @ts-ignore
        google.accounts.id.renderButton(
            // @ts-ignore
            document.getElementById("google-button-register"),
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

        // @ts-ignore
        // google.accounts.id.prompt((notification: PromptMomentNotification) => { });
    }

    async handleCredentialResponse(response: any) {
        // Here will be your response from Google.
        console.log(response);
    }
}
