import { ChangeDetectionStrategy, Component, ElementRef, ViewChild } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { AlertService } from '../../shared/services/alert.service';
import { ProfilePhotoService } from '../../shared/services/profile-photo.service';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [RouterModule, MatButton],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent {
    @ViewChild('profilePhotoInput') input!: ElementRef;

    constructor(private route: Router, private alertService: AlertService, private profilePhotoService: ProfilePhotoService) { }

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

    inputOnChange($event: Event) {
        const input = this.input.nativeElement as HTMLInputElement;
        console.log(input.files![0]);
        if (!input.files || !input.files[0])
            return;

        const file = input.files[0];
        if (file.size > 2_000_000)
            this.alertService.displayError("Profile picture cannot be larger than 2MB.")

        this.profilePhotoService.uploadProfilePhoto(file);
    }
}
