import { Component } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';
import { FormService } from '../../shared/services/form.service';
import { RequestComponent } from "./request/request.component";
import { VerificationComponent } from "./verification/verification.component";
import { SuccessComponent } from "./success/success.component";

@Component({
    selector: 'app-forgot',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner, MatIconModule, RequestComponent, VerificationComponent, SuccessComponent],
    templateUrl: './forgot.component.html',
    styleUrl: './forgot.component.scss'
})
export class ForgotComponent {
    forgotPasswordForm = this.formService.getForgotPasswordForm();
    resetPasswordForm = this.formService.getResetPasswordForm();
    request = false;
    verification = false;

    constructor(private formService: FormService) { }

    isRequest() {
        return !this.request && !this.verification;
    }

    isVerification() {
        return this.request && !this.verification;
    }

    isSuccess() {
        return this.request && this.verification;
    }
}
