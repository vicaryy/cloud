import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';

@Component({
    selector: 'app-alert-new-bag',
    standalone: true,
    imports: [],
    templateUrl: './alert-new-bag.component.html',
    styleUrl: './alert-new-bag.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlertNewBagComponent {
    @ViewChild('input') input!: ElementRef;
    @Input('element') element!: ElementToEdit;
    @Output('ok') ok = new EventEmitter<string>();
    @Output('cancel') cancel = new EventEmitter<void>();

    setSelect() {
        this.input.nativeElement.select();
    }

    ngAfterViewInit(): void {
        this.setSelect();
    }

    onOk() {
        this.ok.emit(this.input.nativeElement.value);
    }

    onCancel() {
        this.cancel.emit();
    }
}
