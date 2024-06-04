import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class BagService {

    highestIndex: number = 1;

    constructor() { }
}
