import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BagComponent } from './content/bag/bag.component';
import { HeaderComponent } from "./header/header.component";
import { GlowComponent } from "./glow/glow.component";
import { FooterComponent } from "./footer/footer.component";
import { ContentComponent } from "./content/content.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, BagComponent, HeaderComponent, GlowComponent, FooterComponent, ContentComponent]
})
export class AppComponent {
}
