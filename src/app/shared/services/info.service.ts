import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Info } from '../models/alert.models';

@Injectable({
    providedIn: 'root'
})
export class InfoService {

    sub$: Subject<Info> = new Subject();

    constructor() { }

    displaySuccess(message: string) {
        this.sub$.next(Info.getSuccessInfo(message));
    }

    displayError(message: string) {
        this.sub$.next(Info.getErrorInfo(message));
    }
}
