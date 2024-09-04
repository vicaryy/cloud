import { Component } from '@angular/core';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-auth',
    standalone: true,
    imports: [RouterLink, RouterOutlet, RouterModule],
    templateUrl: './auth.component.html',
    styleUrl: './auth.component.scss'
})
export class AuthComponent  {

}
