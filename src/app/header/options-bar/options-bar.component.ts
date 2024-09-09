import { Component, EventEmitter, HostListener, Output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';

@Component({
    selector: 'app-options-bar',
    standalone: true,
    imports: [MatButton],
    templateUrl: './options-bar.component.html',
    styleUrl: './options-bar.component.scss'
})
export class OptionsBarComponent {
    firstClick = 0;
    @Output() close = new EventEmitter<void>();

    constructor(private router: Router, private authService: AuthService) { }

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

    onLogout() {
        this.authService.logout();
    }
}
