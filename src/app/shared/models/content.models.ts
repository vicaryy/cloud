import { FileState } from "../enums/content.enums";

export class Bag {
    constructor(
        public id: number,
        public name: string,
        public directory: string,
        public create: Date,
        public size: string,
        public bags: Bag[],
        public files: File[]) { }

    getFullDirectory(): string {
        if (this.name === 'Main Bag')
            return this.name;
        return this.directory + "/" + this.name;
    }

    getAmountOfBags(): number {
        return this.bags.length;
    }

    getAmountOfFiles(): number {
        return this.files.length;
    }
}

export class File {
    static State: any;
    constructor(
        public id: number,
        public name: string,
        public extension: string,
        public size: string,
        public create: Date,
        public state: FileState) { }
}
