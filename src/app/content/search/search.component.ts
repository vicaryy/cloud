import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { FolderComponent } from "../bag/folder/folder.component";
import { FileComponent } from "../bag/file/file.component";
import { BagService } from '../../shared/services/bag.service';
import { MyFile } from '../../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { AlertDeleteComponent } from "../bag/alert-delete/alert-delete.component";
import { BlurBlockComponent } from "../../shared/components/blur-block/blur-block.component";
import { AlertNameComponent } from "../bag/alert-name/alert-name.component";
import { State } from '../../shared/enums/content.enums';
import { EmptySearchComponent } from "./empty-search/empty-search.component";

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [FormsModule, FolderComponent, FileComponent, CommonModule, AlertDeleteComponent, BlurBlockComponent, AlertNameComponent, EmptySearchComponent],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent {
    @ViewChild('placeholder') placeholder!: ElementRef;
    input: string = '';
    result = false;

    constructor(private bagService: BagService, private cdr: ChangeDetectorRef) { }

    get searchedFiles$() {
        return this.bagService.searchedFiles$;
    }

    search() {
        this.result = true;
        this.switchPlaceholder();
        this.searchFiles();
    }

    searchFiles() {
        this.bagService.searchFiles(this.input);
    }

    switchPlaceholder() {
        const element = this.placeholder.nativeElement as HTMLElement;
        if (this.input)
            element.style.opacity = '0';
        else
            element.style.opacity = '1';
    }

    onClick() {
        this.result = true;
        this.searchFiles();
    }

    onBlur() {
        this.result = false;
    }

    trackById(index: number, file: any): any {
        return file.id;
    }

    doesFileNeedsToBeDisplayed(file: MyFile) {
        return file.state === State.READY || file.state === State.DONE || file.state === State.DECRYPT || file.state === State.DOWNLOAD || file.state === State.ERROR;
    }

    onOpenInBag($event: number) {
        this.onBlur();
        this.bagService.openBagByFileId($event);
    }
}
