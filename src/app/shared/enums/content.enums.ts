export enum State {
    READY, ENCRYPT, UPLOAD, DOWNLOAD, DECRYPT, ERROR, DONE

    // READY - ready to be downloaded
    // DONE - downloaded and ready to save on device
}
