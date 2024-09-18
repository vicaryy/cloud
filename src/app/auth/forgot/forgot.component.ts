import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-forgot',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner, MatIconModule],
    templateUrl: './forgot.component.html',
    styleUrl: './forgot.component.scss'
})
export class ForgotComponent {
    forgotPasswordForm = this.formService.getForgotPasswordForm();
    resetPasswordForm = this.formService.getResetPasswordForm();
    waitForResponse = false;
    sended = true;
    hide: boolean = true;

    constructor(private formService: FormService, private router: Router, private authService: AuthService) { }

    get forgotControls() {
        return this.forgotPasswordForm.controls;
    }

    get resetControls() {
        return this.resetPasswordForm.controls;
    }

    getErrorMessage(control: FormControl<any>) {
        if (control.hasError('required'))
            return 'Email address is required.';

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

    isContinueButtonDisabled(): boolean {
        return this.forgotPasswordForm.invalid || this.waitForResponse;
    }

    isResetButtonDisabled(): boolean {
        return this.resetPasswordForm.invalid || this.waitForResponse;
    }

    onReset() {
        throw new Error('Method not implemented.');
    }

    onContinue() {
        this.waitForResponse = true;
        this.authService.forgotPassword(this.forgotControls.email.value).subscribe({
            next: () => {
                this.waitForResponse = false;
                this.sended = true;
            },
            error: () => {
                this.waitForResponse = false;
            }
        });
    }

    onCancel() {
        this.router.navigate(["/auth/login"]);
    }
}
