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
}
