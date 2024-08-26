import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnInit, QueryList, ViewChildren, numberAttribute } from '@angular/core';
import { BagComponent } from "./bag/bag.component";
import { SearchComponent } from './search/search.component';
import { BagService } from '../shared/services/bag.service';
import { Bag, MyFile, User } from '../shared/models/content.models';
import { CommonModule } from '@angular/common';
import { FolderComponent } from "./bag/folder/folder.component";
import { InfoComponent } from "../shared/components/info/info.component";
import { Info } from '../shared/models/alert.models';
import { UserService } from '../shared/services/user.service';
import { DragBagEnd } from '../shared/interfaces/content.interfaces';
import { InfoService } from '../shared/services/info.service';
import { BackdropService } from '../shared/services/backdrop.service';
import { PasswordProtectedComponent } from "./password-protected/password-protected.component";

@Component({
    selector: 'app-content',
    standalone: true,
    templateUrl: './content.component.html',
    styleUrl: './content.component.scss',
    imports: [BagComponent, SearchComponent, CommonModule, FolderComponent, InfoComponent, PasswordProtectedComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentComponent implements OnInit {

    user!: User;
    openedBags: Bag[] = [];
    @ViewChildren("bag") activeBags!: QueryList<BagComponent>;
    info: Info | undefined;
    deleteBar: boolean = false;
    backdrop: boolean = false;

    constructor(private bagService: BagService, private userService: UserService, private infoService: InfoService, private backdropService: BackdropService, private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.bagService.openedBags$.subscribe(next => {
            this.openedBags = [...next];
            this.cdr.markForCheck();
        });

        this.infoService.sub$.subscribe(next => this.displayInfo(next));
        this.backdropService.turnOn$.subscribe(next => this.backdrop = true);
        this.backdropService.clicked$.subscribe(next => this.backdrop = false);
    }

    displayInfo(info: Info) {
        if (this.info)
            return;
        this.info = new Info(info.text, info.success, info.error);
        this.cdr.markForCheck();

        setTimeout(() => this.info = undefined, 3200);
    }

    onDeleteActiveChildBag($event: number) {
        this.deleteActiveBag($event);
    }

    onClickedBackdrop() {
        this.backdropService.clicked();
    }

    deleteActiveBag(id: number) {
        this.openedBags = this.openedBags.filter(e => e.id !== id);
    }

    onDragStart() {
        this.deleteBar = true;
    }

    onDragEnd($event: DragBagEnd) {
        if ($event.x < 140)
            this.deleteActiveBag($event.id);
        this.deleteBar = false;
    }

    trackById(index: number, bag: any): any {
        return bag.id;
    }
}
