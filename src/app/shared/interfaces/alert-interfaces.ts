export interface ElementToEdit {
    id: number;
    name: string;
    newName?: string;
    file?: boolean;
    bag?: boolean;
    delete?: boolean;
    changeName?: boolean;
}
