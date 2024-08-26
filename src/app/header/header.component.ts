import { ChangeDetectionStrategy, Component } from '@angular/core';
import { OptionsBarComponent } from "./options-bar/options-bar.component";

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [OptionsBarComponent],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
    optionsBar = false;

    onProfileClick($event: any) {
        this.optionsBar = !this.optionsBar;
    }

    onCloseOptions() {
        this.optionsBar = false;
    }

}
