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

export const routes: Routes = [
    {
        path: '',
        component: ContentComponent,
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
                loadComponent: () => import('./auth/register/register.component').then(e => e.RegisterComponent),
                // component: RegisterComponent
            },
            {
                path: 'forgot',
                component: ForgotComponent
            }
        ]
    }
]
