import { FileState } from "../enums/content.enums";

export class User {
    constructor(
        public id: number,
        public email: string,
        public bags: Bag[]) { }

    static fromJSON(json: User): User {
        return new User(
            json.id,
            json.email,
            json.bags.map(e => Bag.fromJSON(e))
        );
    }
}

export class Bag {
    constructor(
        public id: number,
        public name: string,
        public directory: string,
        public create: Date,
        public size: string,
        public bags: Bag[],
        public files: File[],
        public x?: number,
        public y?: number
    ) { }

    static fromJSON(json: Bag): Bag {
        if (!json.bags)
            json.bags = [];
        if (!json.files)
            json.files = [];
        return new Bag(
            json.id,
            json.name,
            json.directory,
            json.create,
            json.size,
            json.bags.map(e => Bag.fromJSON(e)),
            json.files.map(e => File.fromJSON(e))
        );
    }

    getFullDirectory(): string {
        if (this.name === 'Main Bag')
            return this.name;
        if (this.directory === '/')
            return this.directory + this.name;
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

    static fromJSON(json: File) {
        return new File(
            json.id,
            json.name,
            json.extension,
            json.size,
            json.create,
            FileState.READY
        );
    }
}
