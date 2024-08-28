import { Component } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { BagService } from '../../shared/services/bag.service';

@Component({
    selector: 'app-empty',
    standalone: true,
    imports: [MatButton],
    templateUrl: './empty.component.html',
    styleUrl: './empty.component.scss'
})
export class EmptyComponent {

    constructor(private bagService: BagService) { }

    onOpenMainBag() {
        this.bagService.openMainBag();
    }
}
