import { AfterViewInit, Component, EventEmitter, Input, Output } from '@angular/core';
import { File } from '../../../shared/models/content.models';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';
import { CommonModule } from '@angular/common';
import { FileState } from '../../../shared/enums/content.enums';

@Component({
    selector: 'app-file',
    standalone: true,
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss',
    imports: [CommonModule]
})
export class FileComponent implements AfterViewInit {
    ngAfterViewInit(): void {
        setInterval(() => {
            this.procent++;
        }, 100);
    }
    @Input('file') file!: File;
    @Output('change') change = new EventEmitter<ElementToEdit>();
    @Output('download') download = new EventEmitter<File>();
    detailsActive: boolean = false;
    State = FileState;
    procent: number = 0;

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }

    emitDownload() {
        this.download.emit(this.file);
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
