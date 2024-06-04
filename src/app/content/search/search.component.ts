import { Component, ElementRef, NgModule, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [FormsModule],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss'
})
export class SearchComponent {

    input: string = '';
    @ViewChild('placeholder') placeholder!: ElementRef;


    search() {
        this.switchPlaceholder();
    }

    switchPlaceholder() {
        const element = this.placeholder.nativeElement as HTMLElement;

        if (this.input) {
            element.style.opacity = '0';
            return;
        }
        element.style.opacity = '1';
    }
}
