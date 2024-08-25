import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, NgModule, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { FolderComponent } from "../bag/folder/folder.component";
import { FileComponent } from "../bag/file/file.component";
import { BagService } from '../../shared/services/bag.service';
import { Bag, MyFile } from '../../shared/models/content.models';

@Component({
    selector: 'app-search',
    standalone: true,
    imports: [FormsModule, FolderComponent, FileComponent],
    templateUrl: './search.component.html',
    styleUrl: './search.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SearchComponent implements OnInit {


    @ViewChild('placeholder') placeholder!: ElementRef;
    files: MyFile[] = [];
    input: string = '';
    result = true;

    constructor(private bagService: BagService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        // this.bagService.openedBags$.subscribe(bags => {
        //     this.files = bags[0].files
        //     this.cdr.markForCheck();
        // });
        this.bagService.searchedFiles.subscribe(files => this.files = files);
    }

    search() {
        this.result = true;
        this.switchPlaceholder();
        this.searchFiles();
    }

    searchFiles() {
        this.bagService.searchedFiles(this.input);
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
        }

    onBlur() {
        this.result = false;
    }
}
