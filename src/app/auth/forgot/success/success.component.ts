import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
    selector: 'app-success',
    standalone: true,
    imports: [MatButton],
    templateUrl: './success.component.html',
    styleUrl: './success.component.scss'
})
export class SuccessComponent {
    constructor(private router: Router) { }

    onCancel() {
        this.router.navigate(["/auth/login"]);
    }

}
