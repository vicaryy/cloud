import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-add',
    standalone: true,
    imports: [],
    templateUrl: './add.component.html',
    styleUrl: './add.component.scss'
})
export class AddComponent {

    active: boolean = false;
    @ViewChild('file') file!: ElementRef;

    @Output('addFile') addFile = new EventEmitter<File>();
    @Output('addBag') addBag = new EventEmitter<void>();


    emitAddBag() {
        this.toggleBlock();
        this.addBag.emit();
    }

    toggleBlock() {
        this.active = !this.active;
    }

    emitAddFile() {
        this.toggleBlock();
        let fileInput = this.file.nativeElement as HTMLInputElement;
        if (!fileInput.files) {
            return;
        }
        this.addFile.emit(fileInput.files[0]);
    }
}
