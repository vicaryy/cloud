export interface ServerResponse<T> {
    status: number;
    message?: string;
    data?: T;
    error?: any;
}

export interface NewBagRequest {
    name: string,
    directory: string
}

export interface NewFileRequest {
    name: string,
    extension: string,
    size: number,
    parts: FilePart[]
}

export interface FilePart {
    order: number,
    file_id: string
}

export interface FileResponse {
    id: number,
    name: string,
    extension: string
    size: string,
    create: Date,
}
