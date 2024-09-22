import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordForm } from '../../../shared/interfaces/form.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
    selector: 'app-request',
    standalone: true,
    imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule, RouterLink, ReactiveFormsModule, MatError, MatProgressSpinner, MatIconModule],
    templateUrl: './request.component.html',
    styleUrl: './request.component.scss'
})
export class RequestComponent {
    @Input('form') forgotPasswordForm!: FormGroup<ForgotPasswordForm>;
    @Output('done') done = new EventEmitter<void>;
    waitForResponse = false;

    constructor(private authService: AuthService, private router: Router) { }

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

    isContinueButtonDisabled(): unknown {
        return this.forgotPasswordForm.invalid || this.waitForResponse;
    }

    onContinue() {
        this.waitForResponse = true;
        this.authService.forgotPassword(this.controls.email.value).subscribe({
            next: () => {
                this.waitForResponse = false;
                this.done.emit();
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
