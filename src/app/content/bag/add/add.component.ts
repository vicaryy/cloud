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

    @Output('addFile') addFile = new EventEmitter<void>();
    @Output('addBag') addBag = new EventEmitter<void>();


    emitAddBag() {
        this.active = false;
        this.addBag.emit();
    }

    emitAddFile() {
        let fileInput = this.file.nativeElement as HTMLInputElement;
        if (!fileInput.files) {
            return;
        }

        console.log(fileInput.files[0]);

    }
}
