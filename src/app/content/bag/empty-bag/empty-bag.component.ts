import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-empty-bag',
    standalone: true,
    imports: [MatButton],
    templateUrl: './empty-bag.component.html',
    styleUrl: './empty-bag.component.scss'
})
export class EmptyBagComponent {

    @Output('addFile') addFile = new EventEmitter<void>();
    @Output('addBag') addBag = new EventEmitter<void>();

    emitAddBag() {
        this.addBag.emit();
    }

    emitAddFile() {
        this.addFile.emit();
    }
}
