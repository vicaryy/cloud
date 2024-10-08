import { FileType, State } from "../enums/content.enums";
import { DownloadState, PreviewFile, UploadState } from "../interfaces/content.interfaces";
import { FilePart } from "../interfaces/backend.interfaces";

export class User {
    constructor(
        public id: number,
        public email: string,
        public verifiedEmail: boolean,
        public bags: Bag[]) { }

    static fromJSON(json: User): User {
        return new User(
            json.id,
            json.email,
            json.verifiedEmail,
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
        public bags: Bag[],
        public files: MyFile[],
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
            json.bags.map(e => Bag.fromJSON(e)),
            json.files.map(e => MyFile.fromJSON(e))
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

export class MyFile {
    static State: any;
    constructor(
        public id: number,
        public name: string,
        public extension: string,
        public size: number,
        public type: FileType,
        public create: Date,
        public url: string,
        public progress: number,
        public fileParts: FilePart[],
        public parentBag: Bag,
        public blob: Blob | null,
        public state: State,
        public downloadState: DownloadState,
        public uploadState: UploadState,
        public preview: PreviewFile | null
    ) { }

    static fromJSON(json: MyFile) {
        if (!json.fileParts)
            json.fileParts = [];

        return new MyFile(
            json.id,
            json.name,
            json.extension,
            json.size,
            json.type as FileType,
            json.create,
            '',
            100,
            json.fileParts,
            json.parentBag,
            null,
            State.READY,
            {},
            {},
            json.preview
        );
    }
}

export interface ProfilePhoto {
    fileId?: string;
    size?: number;
    url?: string;
    blob?: Blob;
    password?: string;
}

// public id: number,
// public name: string,
// public extension: string,
// public size: number,
// public type: FileType,
// public create: Date,
// public url: string,
// public progress: number,
// public fileParts: FilePart[],
// public parentBag: Bag,
// public blob: Blob | null,
// public state: State,
// public downloadState: DownloadState,
// public uploadState: UploadState,
// public preview: PreviewFile | null
