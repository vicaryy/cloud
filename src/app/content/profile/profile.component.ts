import { Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [RouterModule, MatButton],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {

    @ViewChild('profilePhotoInput') input!: ElementRef;

    constructor(private route: Router) { }

    onClickSettings($event: MouseEvent) {
        $event.stopPropagation();
    }

    closeSettings() {
        this.route.navigate(['']);
    }

    onEditAccount() {
        this.route.navigate(['/settings/general']);
    }

    onChangePhoto() {
        this.input.nativeElement.click();
    }
}
