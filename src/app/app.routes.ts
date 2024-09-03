import { Routes } from '@angular/router';
import { SettingsDialogComponent } from './content/settings-dialog/settings-dialog.component';
import { GeneralComponent } from './content/settings-dialog/general/general.component';
import { EncryptionPasswordComponent } from './content/settings-dialog/encryption-password/encryption-password.component';
import { SecurityComponent } from './content/settings-dialog/security/security.component';
import { HeaderComponent } from './header/header.component';

export const routes: Routes = [
    {
        path: '',
        component: HeaderComponent
    },
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
    },
];
