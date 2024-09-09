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
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner],
    templateUrl: './forgot.component.html',
    styleUrl: './forgot.component.scss'
})
export class ForgotComponent {
    forgotPasswordForm = this.formService.getForgotPasswordForm();
    waitForResponse = false;
    sended = false;

    constructor(private formService: FormService, private router: Router, private authService: AuthService) { }

    get controls() {
        return this.forgotPasswordForm.controls;
    }

    getErrorMessage(control: FormControl<any>) {
        if (control.hasError('required'))
            return 'Email address is required.';

        if (control.hasError('email'))
            return 'Invalid email address.'
        return '';
    }

    isContinueButtonDisabled(): boolean {
        return this.forgotPasswordForm.invalid || this.waitForResponse;
    }

    onContinue() {
        this.waitForResponse = true;
        this.authService.forgotPassword(this.controls.email.value).subscribe({
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
