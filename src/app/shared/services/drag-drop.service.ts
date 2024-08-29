import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class DragDropService {

    private _dragDrop = new BehaviorSubject<boolean>(false);
    private dragDrop = false;
    dragDrop$ = this._dragDrop.asObservable();

    constructor() { }

    setDragDrop(val: boolean) {
        if (val !== this.dragDrop) {
            this.dragDrop = val;
            this._dragDrop.next(this.dragDrop);
        }
    }
}
