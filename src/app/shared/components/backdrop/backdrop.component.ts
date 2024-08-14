import { Component, EventEmitter, Output } from '@angular/core';
import { BackdropService } from '../../services/backdrop.service';

@Component({
    selector: 'app-backdrop',
    standalone: true,
    imports: [],
    templateUrl: './backdrop.component.html',
    styleUrl: './backdrop.component.scss'
})
export class BackdropComponent {

    @Output('clicked') clicked = new EventEmitter<void>();

    constructor() { }

    onBackdropClick() {
        this.clicked.emit();
    }
}
