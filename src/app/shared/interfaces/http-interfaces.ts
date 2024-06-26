export interface ServerResponse<T> {
    status: number;
    message?: string;
    data?: T;
}

export interface NewBagRequest {
    id: number,
    name: string
}

export interface NewFileRequest {
    bagId: number,
    name: string,
    extension: string,
    size: number,
    fileParts: FilePart[]
}

export interface FilePart {
    order: number,
    fileId: string
}

export interface FileResponse {
    id: number,
    name: string,
    extension: string
    size: string,
    create: Date,
}
