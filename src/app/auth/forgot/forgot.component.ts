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
import { HttpErrorResponse } from '@angular/common/http';

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
    sended = false;
    reseted = false;
    hide: boolean = true;
    request = true;
    verification = false;
    success = false;

    constructor(private formService: FormService, private router: Router, private authService: AuthService) { }

    get forgotControls() {
        return this.forgotPasswordForm.controls;
    }

    get resetControls() {
        return this.resetPasswordForm.controls;
    }

    onReset() {
        this.waitForResponse = true;
        this.authService.changePassword({
            email: this.forgotControls.email.value,
            password: this.resetControls.password.value,
            verificationCode: this.resetControls.verificationCode.value
        }).subscribe({
            next: () => {
                this.waitForResponse = false;
                this.reseted = true;
            },
            error: () => {
                this.waitForResponse = false;
            }
        });
    }
}
