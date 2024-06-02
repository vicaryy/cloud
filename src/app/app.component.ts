import { HttpClient, HttpClientModule, HttpEvent, HttpEventType } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SendMessage, Update, UpdateResponse } from './shared/interfaces/telegram-interfaces';
import { Observable } from 'rxjs';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, HttpClientModule, ReactiveFormsModule, CommonModule],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    title = 'cloud';
    token = '7213892988:AAEbGdX8Od8DN868XspWWVf65A63TQ8p0Js';
    url = 'https://api.telegram.org/bot' + this.token;
    userId = '1935527130';

    file!: File;

    fileForm: FormGroup = new FormGroup({
        file: new FormControl('')
    });

    @ViewChild("plik") plik!: ElementRef;

    constructor(private http: HttpClient) { }

    ngOnInit(): void {
    }


    setFile(event: any) {
        console.log("bylem tu");
        const input = this.plik.nativeElement as HTMLInputElement;

        const input = this.fileForm.controls.file as unknown as HTMLInputElement;
        if (!input.files)
            return;

        const file: File = input.files[0];

        const formData: FormData = new FormData();
        formData.append("chat_id", this.userId);
        formData.append("document", file);

        this.http.post(this.url + "/sendDocument", formData,
            { reportProgress: true, observe: "events" }
        ).subscribe((event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
                let progress = event.loaded / event.total * 100;
                progress = Math.round(progress);
                console.log(progress + "%");
            }
        });

    }

    send() {

    }
}
