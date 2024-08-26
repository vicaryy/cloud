import { AfterViewInit, Component, EventEmitter, Host, HostListener, Output } from '@angular/core';

@Component({
    selector: 'app-options-bar',
    standalone: true,
    imports: [],
    templateUrl: './options-bar.component.html',
    styleUrl: './options-bar.component.scss'
})
export class OptionsBarComponent {
    firstClick = 0;
    @Output() close = new EventEmitter<void>();

    onClick($event: MouseEvent) {
        $event.stopPropagation();
    }

    @HostListener('document:click', ['$event'])
    closeBar() {
        if (this.firstClick++ !== 0)
            this.close.emit();
    }
}
