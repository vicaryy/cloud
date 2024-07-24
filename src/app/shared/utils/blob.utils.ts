export class BlobUtils {

    private static _defaultChunkSize = 10_000_000;

    static sliceBlob(blob: Blob, chunkSize?: number): Blob[] {
        if (!chunkSize)
            chunkSize = this._defaultChunkSize;

        const blobSize = blob.size;
        if (blobSize < 10_000_000)
            return [blob];

        const amountOfChunks = Math.ceil(blobSize / chunkSize);
        const slicedBlob: Blob[] = [];
        for (let i = 0; i < amountOfChunks; i++) {
            let b = blob.slice(chunkSize * i, chunkSize * (i + 1));
            slicedBlob.push(b);
        }
        return slicedBlob;
    }

    static getExtensionFromName(blobName: string): string {
        let extension = 'unknown';
        for (let i = blobName.length - 3; i > blobName.length - 6 && i > 0; i--) {
            let char = blobName.charAt(i);
            if (blobName.charAt(i) === '.')
                extension = blobName.slice(i, blobName.length);
        }
        return extension;
    }
}
