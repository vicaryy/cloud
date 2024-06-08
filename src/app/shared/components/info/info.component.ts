import { Component, Input } from '@angular/core';
import { Info } from '../../models/alert.models';

@Component({
    selector: 'app-info',
    standalone: true,
    imports: [],
    templateUrl: './info.component.html',
    styleUrl: './info.component.scss'
})
export class InfoComponent {
    @Input() info!: Info;
}
