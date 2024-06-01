import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SendMessage, Update, UpdateResponse } from './shared/interfaces/telegram-interfaces';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'cloud';
    token = '7213892988:AAEbGdX8Od8DN868XspWWVf65A63TQ8p0Js';
    url = 'https://api.telegram.org/bot' + this.token;
    userId = '1935527130';

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
       const sendMessage: SendMessage = {
        chat_id: this.userId,
        text: "wiadomosc z angular"
       }

       this.http.post(this.url + "/sendMessage", sendMessage, {}).subscribe();
    }
}
