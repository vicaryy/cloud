import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FilterBy, SortBy } from '../../../shared/enums/content.enums';
import { BackdropService } from '../../../shared/services/backdrop.service';
import { Observable, Subject, Subscription } from 'rxjs';

@Component({
    selector: 'app-more-options',
    standalone: true,
    imports: [MatButton],
    templateUrl: './more-options.component.html',
    styleUrl: './more-options.component.scss'
})
export class MoreOptionsComponent implements OnInit {

    FilterBy = FilterBy;
    SortBy = SortBy;
    @Output('remove') remove = new EventEmitter<void>;
    @Output('sort') sortEmit = new EventEmitter<SortBy>;
    @Output('filter') filterEmit = new EventEmitter<FilterBy>;
    sort: boolean = false;
    filter: boolean = false;
    sortBy = SortBy.DATE_UP;
    filterBy = FilterBy.ALL;
    backdropClicked$!: Subscription;

    constructor(private backdrop: BackdropService) { }

    ngOnInit(): void {
        // this.backdrop.clicked$.subscribe();
    }

    onRemove() {
        this.remove.emit();
    }

    onSortBtn() {
        this.sort = !this.sort;
        this.filter = false;
        this.backdrop.turnOn();
        this.backdropClicked$ = this.backdrop.clicked$.subscribe(() => {
            this.sort = false;
            this.backdropClicked$.unsubscribe();
        });
    }
    onFilterBtn() {
        this.filter = !this.filter;
        this.sort = false;
        this.backdropClicked$ = this.backdrop.clicked$.subscribe(() => {
            this.filter = false;
            this.backdropClicked$.unsubscribe();
        });
    }

    onSort(type: string) {
        if (type === 'date') {
            if (this.sortBy === SortBy.DATE_UP)
                this.sortBy = SortBy.DATE_DOWN;
            else
                this.sortBy = SortBy.DATE_UP;
        }
        else if (type === 'name') {
            if (this.sortBy === SortBy.NAME_DOWN)
                this.sortBy = SortBy.NAME_UP;
            else
                this.sortBy = SortBy.NAME_DOWN;
        }
        else if (type === 'size') {
            if (this.sortBy === SortBy.SIZE_DOWN)
                this.sortBy = SortBy.SIZE_UP
            else
                this.sortBy = SortBy.SIZE_DOWN;
        }
        this.sortEmit.emit(this.sortBy);
    }

    onFilter(type: FilterBy) {
        this.filterBy = type;
        this.filterEmit.emit(type);
    }

    closeBlocks() {
        this.sort = false;
        this.filter = false;
    }

    getZIndex() {
        return this.backdrop.getHigherZIndex();
    }
}
