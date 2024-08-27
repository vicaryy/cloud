import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-settings-dialog',
    standalone: true,
    imports: [MatButton, RouterOutlet, RouterModule],
    templateUrl: './settings-dialog.component.html',
    styleUrl: './settings-dialog.component.scss'
})
export class SettingsDialogComponent {

    constructor(private route: Router) { }

    onClickSettings($event: MouseEvent) {
        $event.stopPropagation();
    }

    closeSettings() {
        this.route.navigate(['']);
    }
}
