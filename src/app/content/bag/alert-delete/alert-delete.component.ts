import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';

@Component({
  selector: 'app-alert-delete',
  standalone: true,
  imports: [],
  templateUrl: './alert-delete.component.html',
  styleUrl: './alert-delete.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertDeleteComponent {
    @Input('element') element!: ElementToEdit;
    @Output('ok') ok = new EventEmitter<ElementToEdit>();
    @Output('cancel') cancel = new EventEmitter<void>();


    onOk() {
        this.ok.emit(this.element);
    }

    onCancel() {
        this.cancel.emit();
    }
}
