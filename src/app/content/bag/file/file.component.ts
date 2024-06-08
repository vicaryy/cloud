import { Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from '../../../shared/models/content.models';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';

@Component({
    selector: 'app-file',
    standalone: true,
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss',
    imports: []
})
export class FileComponent {
    @Input('file') file!: File;
    @Output('change') change = new EventEmitter<ElementToEdit>();
    detailsActive: boolean = false;

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }

    emitChangeName() {
        this.change.emit({
            id: this.file.id,
            name: this.file.name,
            file: true,
            changeName: true
        });
    }

    emitDelete() {
        this.change.emit({
            id: this.file.id,
            name: this.file.name,
            file: true,
            delete: true
        })
    }
}
