import { PreviewFile } from "./content.interfaces";

export interface ServerResponse<T> {
    status: number;
    result?: T;
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
    fileParts: FilePart[],
    previewFile?: PreviewFile | null | undefined
}

export interface ChangePasswordRequest {
    email: string;
    verificationCode: string;
    password: string;
}

export interface FilePart {
    order: number;
    fileId: string;
    size: number;
}

export interface LoginWithGoogleRequest {
    jwt: string;
}

export interface FileResponse {
    id: number,
    name: string,
    extension: string
    size: string,
    create: Date,
}

