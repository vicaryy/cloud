import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
    selector: 'app-add',
    standalone: true,
    imports: [],
    templateUrl: './add.component.html',
    styleUrl: './add.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddComponent {

    active: boolean = false;
    @ViewChild('file') file!: ElementRef;

    @Output('addFile') addFile = new EventEmitter<void>();
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
        this.addFile.emit();
    }
}
