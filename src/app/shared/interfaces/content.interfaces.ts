import { State } from "../enums/content.enums"

export interface DragBagEnd {
    x: number,
    y: number,
    id: number
}

export interface UploadState {
    started?: boolean,
    sliced?: boolean,
    encrypted?: boolean,
    sended?: boolean,
    slicedBlobs?: Blob[],
    encryptedBlobs?: Blob[],
    prevProgress?: number,
    entireSize?: number,
}

export interface DownloadState {
    downloaded?: boolean,
    decrypted?: boolean,
    downloadedBlobs?: Blob[],
    decryptedBlobs?: Blob[],
    prevProgress?: number,
    entireSize?: number
}

export interface PreviewFile {
    fileId?: string,
    size?: number,
    extension?: string,
    state?: State,
    url?: string
}
