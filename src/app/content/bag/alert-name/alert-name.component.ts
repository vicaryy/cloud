import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { ElementToEdit } from '../../../shared/interfaces/alert.interfaces';
import { MatButton } from '@angular/material/button';

@Component({
    selector: 'app-alert-name',
    standalone: true,
    imports: [MatButton],
    templateUrl: './alert-name.component.html',
    styleUrl: './alert-name.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertNameComponent {
    @ViewChild('input') input!: ElementRef;
    @Input('element') element!: ElementToEdit;
    @Output('ok') ok = new EventEmitter<ElementToEdit>();
    @Output('cancel') cancel = new EventEmitter<void>();

    setSelect() {
        this.input.nativeElement.select();
        this.input.nativeElement.focus();
    }

    ngAfterViewInit(): void {
        this.setSelect();
    }

    onOk() {
        if (this.element.name === this.input.nativeElement.value) {
            this.onCancel();
            return;
        }
        this.element.newName = this.input.nativeElement.value;
        this.ok.emit(this.element);
    }

    onCancel() {
        this.cancel.emit();
    }
}
