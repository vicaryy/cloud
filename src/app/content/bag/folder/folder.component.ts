import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ElementToEdit } from '../../../shared/interfaces/alert-interfaces';
import { Bag } from '../../../shared/models/content.models';
import { Subscription } from 'rxjs';
import { BagService } from '../../../shared/services/bag.service';

@Component({
    selector: 'app-folder',
    standalone: true,
    imports: [],
    templateUrl: './folder.component.html',
    styleUrl: './folder.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FolderComponent implements OnInit {
    @Input({ required: true }) bag!: Bag;
    @Output('change') change = new EventEmitter<ElementToEdit>();
    @Output('open') open = new EventEmitter<Bag>();
    detailsActive: boolean = false;
    date: string = '';
    sub!: Subscription;

    constructor(private bagService: BagService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.initRefreshFolder();
        this.initDate();
    }

    initRefreshFolder() {
        this.sub = this.bagService.refreshBag$.subscribe(id => {
            if (id === this.bag.id)
                this.cdr.markForCheck();
        });
    }

    initDate() {
        let date = new Date(this.bag.create.toString());
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');

        this.date = `${day}.${month}.${year} ${hours}:${minutes}`;
    }

    toggleDetails() {
        this.detailsActive = !this.detailsActive;
    }

    emitChangeName() {
        this.change.emit({
            id: this.bag.id,
            name: this.bag.name,
            bag: true,
            changeName: true
        });
    }

    emitDelete() {
        this.change.emit({
            id: this.bag.id,
            name: this.bag.name,
            bag: true,
            delete: true
        })
    }

    emitOpenFolder() {
        this.open.emit(this.bag);
    }

}
