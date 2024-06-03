import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BagComponent } from './bag/bag.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, BagComponent]
})
export class AppComponent {
}
