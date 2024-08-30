export interface Alert {
    id(): number;
    info(): string;
}

export class ErrorAlert implements Alert {
    constructor(private _id: number, private _info: string) { }

    id(): number {
        return this._id;
    }

    info(): string {
        return this._info;
    }
}

export class SuccessAlert implements Alert {
    constructor(private _id: number, private _info: string) { }

    id(): number {
        return this._id;
    }

    info(): string {
        return this._info;
    }
}

export class InfoAlert implements Alert {
    constructor(private _id: number, private _info: string) { }

    id(): number {
        return this._id;
    }

    info(): string {
        return this._info;
    }
}

export class AlertFactory {
    private static ID = 0;

    static successAlert(info: string): Alert {
        return new SuccessAlert(this.ID++, info);
    }

    static errorAlert(info: string): Alert {
        return new ErrorAlert(this.ID++, info);
    }

    static infoAlert(info: string): Alert {
        return new InfoAlert(this.ID++, info);
    }

}
