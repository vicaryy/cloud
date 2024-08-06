export enum State {
    READY, ENCRYPT, UPLOAD, DOWNLOAD, DECRYPT, ERROR, DONE

    // READY - ready to be downloaded
    // DONE - downloaded and ready to save on device
}

export enum SortBy {
    DATE_UP, DATE_DOWN, NAME_UP, NAME_DOWN, SIZE_UP, SIZE_DOWN
}

export enum FilterBy {
    ALL, IMAGES, VIDEOS, MUSIC, DOCUMENTS
}
