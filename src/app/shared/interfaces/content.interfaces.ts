import { State } from "../enums/content.enums"
import { FilePart } from "./http-interfaces"

export interface DragBagEnd {
    x: number,
    y: number,
    id: number
}

export interface FileState {
    state?: State,
    fileParts?: FilePart[],
    download?: boolean,
    upload?: boolean,
    decryptedBlobs?: Blob[],
    encryptedBlobs?: Blob[]
}
