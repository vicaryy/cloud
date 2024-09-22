import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { ResetPasswordForm } from '../../../shared/interfaces/form.interfaces';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-verification',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner, MatIconModule],
    templateUrl: './verification.component.html',
    styleUrl: './verification.component.scss'
})
export class VerificationComponent {
    @Input('form') resetPasswordForm!: FormGroup<ResetPasswordForm>;
    @Output('done') done = new EventEmitter<void>;
    waitForResponse = false;
    hide = true;

    constructor(private authService: AuthService, private router: Router) { }

    get controls() {
        return this.resetPasswordForm.controls;
    }

    getVerificationCodeErrorMessage(control: FormControl<any>) {
        if (control.hasError('required'))
            return 'Verification code is required.';

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

    isResetButtonDisabled(): boolean {
        return this.resetPasswordForm.invalid || this.waitForResponse;
    }

    onReset() {
        throw new Error('Method not implemented.');
    }

    onCancel() {
        throw new Error('Method not implemented.');
    }
}
