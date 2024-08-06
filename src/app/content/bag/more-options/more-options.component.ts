import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';
import { FilterBy, SortBy } from '../../../shared/enums/content.enums';

@Component({
    selector: 'app-more-options',
    standalone: true,
    imports: [MatButton],
    templateUrl: './more-options.component.html',
    styleUrl: './more-options.component.scss'
})
export class MoreOptionsComponent {

    FilterBy = FilterBy;
    SortBy = SortBy;
    @Output('remove') remove = new EventEmitter<void>;
    @Output('sort') sortEmit = new EventEmitter<SortBy>;
    @Output('filter') filterEmit = new EventEmitter<FilterBy>;
    sort: boolean = false;
    filter: boolean = false;
    sortBy = SortBy.DATE_DOWN;
    filterBy = FilterBy.ALL;

    onRemove() {
        this.remove.emit();
    }

    onSortBtn() {
        this.sort = !this.sort;
        this.filter = false;
    }
    onFilterBtn() {
        this.filter = !this.filter;
        this.sort = false;
    }

    onSort(type: string) {
        if (type === 'date') {
            if (this.sortBy === SortBy.DATE_DOWN)
                this.sortBy = SortBy.DATE_UP;
            else
                this.sortBy = SortBy.DATE_DOWN;
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

    onFilter(type: string) {
        // if (type === this.filterBy)
        //     return;
        // this.filterBy = type;
        // this.closeBlocks();
    }

    closeBlocks() {
        this.sort = false;
        this.filter = false;
    }
}
