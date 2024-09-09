import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BagService } from './bag.service';
import { CryptoService } from './crypto.service';

@Injectable({
    providedIn: 'root'
})
export class StateManagerService {

    constructor(private userService: UserService, private bagService: BagService, private cryptoService: CryptoService) { }

    clearAllData() {
        this.userService.clearData();
        this.bagService.clearData();
        this.cryptoService.clearData();
    }

    loadAllData() {
        this.userService.loadData();
        this.cryptoService.loadData();
    }
}
