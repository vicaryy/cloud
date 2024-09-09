import { Routes } from '@angular/router';
import { SettingsDialogComponent } from './content/settings-dialog/settings-dialog.component';
import { GeneralComponent } from './content/settings-dialog/general/general.component';
import { EncryptionPasswordComponent } from './content/settings-dialog/encryption-password/encryption-password.component';
import { SecurityComponent } from './content/settings-dialog/security/security.component';
import { ContentComponent } from './content/content.component';
import { AuthComponent } from './auth/auth.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotComponent } from './auth/forgot/forgot.component';
import { ConfirmationComponent } from './auth/confirmation/confirmation.component';
import { authGuard, confirmationGuard, contentGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
        canActivate: [contentGuard],
        children: [
            {
                path: 'settings',
                component: SettingsDialogComponent,
                children: [
                    {
                        path: 'general',
                        component: GeneralComponent,
                    },
                    {
                        path: 'encryption',
                        component: EncryptionPasswordComponent,
                    },
                    {
                        path: 'security',
                        component: SecurityComponent,
                    },
                ]
            }
        ]
    },
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [authGuard],
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                component: LoginComponent
            },
            {
                path: 'register',
                component: RegisterComponent
            },
            {
                path: 'forgot',
                component: ForgotComponent
            },
            {
                path: 'confirmation',
                component: ConfirmationComponent,
                canActivate: [confirmationGuard]
            }
        ]
    }
]
