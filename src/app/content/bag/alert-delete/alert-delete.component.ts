import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';
import { ElementToEdit } from '../../../shared/interfaces/alert.interfaces';
import { MatButton } from '@angular/material/button';

@Component({
  selector: 'app-alert-delete',
  standalone: true,
  imports: [MatButton],
  templateUrl: './alert-delete.component.html',
  styleUrl: './alert-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertDeleteComponent {
    @Input('element') element!: ElementToEdit;
    @Output('ok') ok = new EventEmitter<ElementToEdit>();
    @Output('cancel') cancel = new EventEmitter<void>();

    @HostListener('window:keyup.enter')
    onEnter() {
        this.onOk();
    }

    onOk() {
        this.ok.emit(this.element);
    }

    onCancel() {
        this.cancel.emit();
    }
}
