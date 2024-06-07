import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';
import { Bag } from '../../../shared/models/content.models';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

    @Input('bag') bag!: Bag;
    @Output('change') change = new EventEmitter<ElementToEdit>();
    detailsActive: boolean = false;

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }

    emitChangeName() {

        this.change.emit({
            id: this.bag.id,
            name: this.bag.name,
            bag: true,
            changeName: true
        });
    }

    emitDelete() {
        this.change.emit({
            id: this.bag.id,
            bag: true,
            delete: true
        })
    }
}
