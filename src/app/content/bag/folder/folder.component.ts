import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-folder',
  standalone: true,
  imports: [],
  templateUrl: './folder.component.html',
  styleUrl: './folder.component.scss'
})
export class FolderComponent {

    @Input('name') name!: string;

    detailsActive: boolean = false;

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }
}
