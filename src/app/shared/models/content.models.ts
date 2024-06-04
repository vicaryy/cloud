export class Bag {
    constructor(public directory: string, public bags: Bag[], public files: File[]) { }
}

export class File {
    constructor(public name: string, public extension: string, public create: Date) { }
}
