import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AlertService } from '../services/alert.service';
import { Storage } from '../security/security';

export const contentGuard: CanActivateFn = (route, state) => {
    if (Storage.jwt)
        return true;

    const router = inject(Router);
    const alerts = inject(AlertService);
    router.navigate(['auth/login']).then(() => alerts.displayInfo('Your session expired, please log in.'));
    return false;
};

export const confirmationGuard: CanActivateFn = (route, state) => {
    if (Storage.verifyEmail)
        return true;

    const router = inject(Router);
    router.navigate(['auth/login']);
    return false;
}

export const authGuard: CanActivateFn = (route, state) => {
    if (!Storage.jwt)
        return true;

    const router = inject(Router);
    router.navigate(['']);
    return false;
}
