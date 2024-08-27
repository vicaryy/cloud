import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { Router } from '@angular/router';

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

    constructor(private router: Router) { }

    onClick($event: MouseEvent) {
        $event.stopPropagation();
    }

    @HostListener('document:click', ['$event'])
    closeBar() {
        if (this.firstClick++ !== 0)
            this.close.emit();
    }

    closeBarNow() {
        this.close.emit();
    }

    displaySettingsDialog($event: MouseEvent) {
        $event.stopPropagation();
        this.closeBarNow();
        this.router.navigate(['settings/general']);
    }
}
