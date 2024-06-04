import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FileComponent } from "./file/file.component";
import { CdkDrag, CdkDragEnd, CdkDragHandle, CdkDragStart } from '@angular/cdk/drag-drop';
import { Bag, File } from '../../shared/models/content.models';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import { BagService } from '../../shared/services/bag.service';

@Component({
    selector: 'app-bag',
    standalone: true,
    templateUrl: './bag.component.html',
    styleUrl: './bag.component.scss',
    imports: [FileComponent, CdkDrag, CdkDragHandle]
})
export class BagComponent implements AfterViewInit {

    @Input() directory!: string;
    @Input() bags!: Bag[];
    @Input() files!: File[];
    @Input() x!: any;
    @Input() y!: any;
    @ViewChild("bag") bagElement!: ElementRef;

    constructor(private bagService: BagService) { }

    onDragEnd(event: CdkDragEnd) {
        this.setTransformOriginAfterDragEnd(event.dropPoint.x, event.dropPoint.y);
    }

    setHighestIndex() {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.zIndex = `${this.bagService.highestIndex++}`
    }

    setTransformOriginAfterDragEnd(x: any, y: any) {
        this.bagElement.nativeElement.style.transformOrigin = `calc(${x}px - ${this.x}px) calc(${y}px - ${this.y}px)`;
    }

    ngAfterViewInit(): void {
        const el = this.bagElement.nativeElement as HTMLElement;
        el.style.left = `${this.x}px`;
        el.style.top = `${this.y}px`;
        el.style.transformOrigin = ``;
    }

    onMouseDown() {
        this.setHighestIndex();
    }
}
