import { Component } from '@angular/core';
import { AlertNameComponent } from "../alert-name/alert-name.component";

@Component({
    selector: 'app-file',
    standalone: true,
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss',
    imports: [AlertNameComponent]
})
export class FileComponent {
    detailsActive: boolean = false;

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }
}
