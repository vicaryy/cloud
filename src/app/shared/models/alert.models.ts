export class Info {
    constructor(public text: string, public success: boolean, public error: boolean) { }

    static getSuccessInfo(text: string): Info {
        return new Info(text, true, false);
    }
    static getErrorInfo(text: string): Info {
        return new Info(text, false, true);
    }
}
