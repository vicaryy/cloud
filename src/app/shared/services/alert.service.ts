import { Injectable } from '@angular/core';
import { Alert, AlertFactory } from '../models/alert.models';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AlertService {

    private _alert: Subject<Alert> = new Subject();
    alert$ = this._alert.asObservable();

    constructor() { }

    displaySuccess(text: string) {
        this._alert.next(AlertFactory.successAlert(text));
    }

    displayError(text: string) {
        this._alert.next(AlertFactory.errorAlert(text));
    }

    displayInfo(text: string) {
        this._alert.next(AlertFactory.infoAlert(text));
    }
}
