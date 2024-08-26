import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-image-dialog',
    standalone: true,
    imports: [],
    template: `
    <div class="dialog-content">
      <img [src]="data.name" alt="Zoomed Image">
    </div>
  `,
    styles: [`
    .dialog-content {
        width: 50vw;
        background-color: transparent;
        z-index: 1000000;
    }
    img {
        width: 100%;
        max-height: 90vh;
        background-color: transparent;
        z-index: 1000000;
    }
  `]
})
export class ImageDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) { }
}
