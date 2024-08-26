import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { MyFile } from '../../../shared/models/content.models';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';
import { CommonModule } from '@angular/common';
import { State } from '../../../shared/enums/content.enums';
import { FileService } from '../../../shared/services/file.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { BagComponent } from '../bag.component';
import { ImageDialogComponent } from '../../../shared/components/image-dialog/image-dialog.component';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-file',
    standalone: true,
    templateUrl: './file.component.html',
    styleUrl: './file.component.scss',
    imports: [CommonModule, MatProgressSpinnerModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileComponent implements OnInit, OnDestroy {
    @Input({ required: true }) file!: MyFile;
    @Input() parentId!: number;
    @Input() inSearchBar!: boolean;
    @Output('change') change = new EventEmitter<ElementToEdit>();
    @Output() openInBag = new EventEmitter<number>();
    @ViewChild("f") fileElement!: ElementRef;
    detailsActive: boolean = false;
    glowUp = false;
    State = State;
    size: string = '';
    date: string = '';
    logoUrl: string = "./assets/images/extensions/";
    subRefresh!: Subscription;

    constructor(private fileService: FileService, private dialog: MatDialog, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.initSize();
        this.initDate();
        this.initLogoUrl();
        this.initPreview();
        this.initRefresh();
    }

    ngOnDestroy(): void {
        this.subRefresh.unsubscribe();
    }

    initRefresh() {
        this.subRefresh = this.fileService.refreshFile$.subscribe(id => {
            if (id === this.file.id)
                this.cdr.markForCheck();
        });
    }

    initPreview() {
        if (this.file.preview)
            this.file.preview.state = State.READY;
    }

    initLogoUrl() {
        let ext = this.file.extension.split(".")[1];

        //todo zoptymalizować to troche trzeba

        if (ext === 'dmg')
            this.logoUrl = this.logoUrl + "dmg.png";
        else if (ext === 'docx' || ext === 'doc')
            this.logoUrl = this.logoUrl + "docx.png";
        else if (ext === 'exe')
            this.logoUrl = this.logoUrl + "exe.png";
        else if (ext === 'gif')
            this.logoUrl = this.logoUrl + "gif.png";
        else if (ext === 'html')
            this.logoUrl = this.logoUrl + "html.png";
        else if (ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'webp' || ext === 'svg' || ext === 'raw' || ext === 'ico' || ext === 'bmp' || ext === 'tiff' || ext === 'heif')
            this.logoUrl = this.logoUrl + "img.png";
        else if (ext === 'mp3' || ext === 'wav' || ext === 'aac' || ext === 'flac' || ext === 'ogg' || ext === 'm4a' || ext === 'wma' || ext === 'alac' || ext === 'aiff' || ext === 'opus')
            this.logoUrl = this.logoUrl + "mp3.png";
        else if (ext === 'mp4' || ext === 'avi' || ext === 'mkv' || ext === 'mov' || ext === 'wmv' || ext === 'flv' || ext === 'webm' || ext === 'mpeg' || ext === 'mpg' || ext === '3gp' || ext === 'rm')
            this.logoUrl = this.logoUrl + "mp4.png";
        else if (ext === 'pdf')
            this.logoUrl = this.logoUrl + "pdf.png";
        else if (ext === 'rar')
            this.logoUrl = this.logoUrl + "rar.png";
        else if (ext === 'txt' || ext === 'xml' || ext === 'json')
            this.logoUrl = this.logoUrl + "txt.png";
        else if (ext === 'zip')
            this.logoUrl = this.logoUrl + "zip.png";
        else
            this.logoUrl = this.logoUrl + "default.png";
    }

    initDate() {
        let date = new Date(this.file.create.toString());
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        this.date = `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    initSize() {
        let reducedSize = (this.file.size / 1000000);
        if (reducedSize >= 1000) {
            reducedSize = reducedSize / 1000;
            this.size = reducedSize.toFixed(2) + " GB";
        }
        else
            this.size = reducedSize.toFixed(2) + " MB";
    }

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }

    emitDownload() {
        this.fileService.downloadFile(this.file);
    }

    async emitTryAgain() {
        await this.fileService.tryAgain(this.file);
        this.fileService.sortBagById(this.parentId);
    }

    emitChangeName() {
        this.change.emit({
            id: this.file.id,
            name: this.file.name,
            file: true,
            changeName: true
        });
    }

    emitDelete() {
        this.change.emit({
            id: this.file.id,
            name: this.file.name,
            file: true,
            delete: true
        })
    }

    emitOpenInBag() {
        this.openInBag.emit(this.file.id);
    }

    emitDownloadPreview() {
        this.fileService.downloadPreview(this.file);
    }

    displayPreviewPhoto() {
        this.dialog.open(ImageDialogComponent, {
            data: { name: this.file.preview?.url }
        })
    }

    glowUpFile() {
        console.log("eeee?");
        console.log(this.glowUp);


        this.glowUp = true;
        this.cdr.detectChanges();
        setTimeout(() => {
            this.glowUp = false;
            this.cdr.markForCheck();
        }, 2000);
    }
}
