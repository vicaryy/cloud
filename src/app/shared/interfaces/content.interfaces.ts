import { State } from "../enums/content.enums"

export interface DragBagEnd {
    x: number,
    y: number,
    id: number
}

export interface UploadState {
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
    entireSize?: number,
}
