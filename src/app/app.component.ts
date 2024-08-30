import { ChangeDetectionStrategy, Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BagComponent } from './content/bag/bag.component';
import { HeaderComponent } from "./header/header.component";
import { GlowComponent } from "./glow/glow.component";
import { FooterComponent } from "./footer/footer.component";
import { ContentComponent } from "./content/content.component";
import { ChatComponent } from "./content/chat/chat.component";
import { AlertsComponent } from "./shared/components/alerts/alerts.component";

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    imports: [RouterOutlet, BagComponent, HeaderComponent, GlowComponent, FooterComponent, ContentComponent, ChatComponent, AlertsComponent]
})
export class AppComponent {
}
