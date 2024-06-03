import { Component } from '@angular/core';
import { FileComponent } from "./file/file.component";

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent]
})
export class BagComponent {
    directory: string = "/root"
}
