import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OptionsBarComponent } from "./options-bar/options-bar.component";
import { Router } from '@angular/router';
import { MatButton } from '@angular/material/button';
import { AuthService } from '../shared/services/auth.service';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [OptionsBarComponent, MatButton],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {

    constructor(private router: Router, private authService: AuthService) { }

    optionsBar = false;

    onProfileClick($event: any) {
        this.optionsBar = !this.optionsBar;
    }

    onCloseOptions() {
        this.optionsBar = false;
    }

    onLogout() {
        this.authService.logout();
    }
}
