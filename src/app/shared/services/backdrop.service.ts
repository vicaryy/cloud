import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class BackdropService {

    turnOn$ = new Subject<void>();
    clicked$ = new Subject<void>();

    constructor() { }

    turnOn() {
        this.turnOn$.next();
    }

    clicked() {
        this.clicked$.next();
    }

    getHigherZIndex() {
        return "1001";
    }
}
