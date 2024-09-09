import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-confirmation',
    standalone: true,
    imports: [MatButton, MatProgressSpinner],
    templateUrl: './confirmation.component.html',
    styleUrl: './confirmation.component.scss'
})
export class ConfirmationComponent implements OnInit {
    @ViewChild('first') first!: ElementRef;
    @ViewChild('second') second!: ElementRef;
    @ViewChild('third') third!: ElementRef;
    @ViewChild('fourth') fourth!: ElementRef;
    waitForResponse = false;
    waitForResendResponse = false;
    resendResponseSended = false;
    userEmail!: string;

    constructor(private router: Router, private authService: AuthService) { }

    ngOnInit(): void {
        this.initUserEmail();
    }

    initUserEmail() {
        const storageEmail = localStorage.getItem('verificationEmail');
        this.userEmail = storageEmail ? storageEmail : 'unknown';
    }

    onKeyDown($event: KeyboardEvent, prev: HTMLInputElement | null, curr: HTMLInputElement, next: HTMLInputElement | null) {
        $event.preventDefault();
        if (!this.isNumber($event) && $event.key !== 'Backspace')
            return;

        if ($event.key === 'Backspace') {
            if (prev && !curr.value)
                prev.focus();
            curr.value = '';
            return;
        }

        curr.value = $event.key[0];
        if (next)
            next.focus();
        else
            this.onValid(null);
    }

    onCancel() {
        this.router.navigate(["/auth/register"]);
    }

    onValid($event: Event | null) {
        if ($event)
            $event.preventDefault();
        if (this.areInputsInvalid())
            return;

        this.waitForResponse = true;
        this.authService.verificate({ email: this.userEmail, verificationCode: this.getCode() }).subscribe({
            next: () => this.waitForResponse = false,
            error: () => this.waitForResponse = false
        });
    }

    onResend() {
        this.waitForResendResponse = true;
        this.authService.resendVerificateCode(this.userEmail).subscribe({
            next: () => {
                this.waitForResendResponse = false;
                this.resendResponseSended = true;
            },
            error: () => this.waitForResendResponse = false
        });
    }

    isDisabled() {
        return this.areInputsInvalid() || this.waitForResponse;
    }

    areInputsInvalid() {
        return (this.first?.nativeElement.value + this.second?.nativeElement.value + this.third?.nativeElement.value + this.fourth?.nativeElement.value).length !== 4;
    }

    getCode(): string {
        return this.first?.nativeElement.value + this.second?.nativeElement.value + this.third?.nativeElement.value + this.fourth?.nativeElement.value;
    }

    isNumber($event: KeyboardEvent) {
        return $event.key.codePointAt(0)! >= 47 && $event.key.codePointAt(0)! <= 57;
    }
}
