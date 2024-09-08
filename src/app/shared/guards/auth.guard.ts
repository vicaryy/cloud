import { CanActivateFn, Router } from '@angular/router';
import { getJwtFromStorage } from '../security/security';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert.service';

export const authGuard: CanActivateFn = (route, state) => {
    if (getJwtFromStorage())
        return true;

    const router = inject(Router);
    const alerts = inject(AlertService);
    router.navigate(['auth/login']).then(() => alerts.displayInfo('Your session expired, please log in.'));
    return false;
};
