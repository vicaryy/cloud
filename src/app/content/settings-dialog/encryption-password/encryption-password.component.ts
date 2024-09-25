import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@Component({
    selector: 'app-encryption-password',
    standalone: true,
    imports: [MatButton, MatSlideToggleModule],
    templateUrl: './encryption-password.component.html',
    styleUrl: './encryption-password.component.scss'
})
export class EncryptionPasswordComponent {

}
