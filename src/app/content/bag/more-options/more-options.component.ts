import { Component, EventEmitter, Output } from '@angular/core';
import { MatButton, MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-more-options',
    standalone: true,
    imports: [MatButton],
    templateUrl: './more-options.component.html',
    styleUrl: './more-options.component.scss'
})
export class MoreOptionsComponent {

    @Output('remove') remove!: EventEmitter<void>;
    sort: boolean = false;
    filter: boolean = false;
    sortBy = 'newest';
    filterBy = 'all';

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
        if (type === this.sortBy)
            return;
        this.sortBy = type;
        this.closeBlocks();
    }

    onFilter(type: string) {
        if (type === this.filterBy)
            return;
        this.filterBy = type;
        this.closeBlocks();
    }

    closeBlocks() {
        this.sort = false;
        this.filter = false;
    }
}
