export abstract class Alert {
    constructor(protected _id: number, protected _info: string) {
        this._info = this.addDot(_info);
    }

    abstract id(): number;
    abstract info(): string;

    addDot(info: string): string {
        if (info[info.length - 1] !== '.')
            info = info + '.';
        return info;
    }
}

export class ErrorAlert extends Alert {
    id(): number {
        return this._id;
    }

    info(): string {
        return this._info;
    }
}

export class SuccessAlert extends Alert {
    id(): number {
        return this._id;
    }

    info(): string {
        return this._info;
    }
}

export class InfoAlert extends Alert {
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
