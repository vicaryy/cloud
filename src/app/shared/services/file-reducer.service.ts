import { Injectable } from '@angular/core';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { BlobUtils } from '../utils/blob.utils';

@Injectable({
    providedIn: 'root'
})
export class FileReducerService {

    constructor(private imageCompress: NgxImageCompressService) { }

    async compressImage(blob: Blob): Promise<Blob> {
        if (blob.size < 500000)
            return blob;
        let dataURL = await BlobUtils.blobToDataURL(blob);
        let compressedDataURL = await this.compress(dataURL);
        return BlobUtils.dataURLToBlob(compressedDataURL);
    }

    private async compress(dataURL: string): Promise<string> {
        console.log(this.getDataUrlSize(dataURL));

        if (this.getDataUrlSize(dataURL) < 400000)
            return dataURL;
        let dataURLAfter = await this.imageCompress.compressFile(dataURL, DOC_ORIENTATION.Default, 90, 90);
        return this.compress(dataURLAfter);
    }

    getDataUrlSize(dataUrl: string): number {
        const base64String = dataUrl.split(',')[1];
        const padding = (base64String.match(/=+$/) || [''])[0].length;
        const sizeInBytes = (base64String.length * 3) / 4 - padding;
        return sizeInBytes;
    }

    // async compressImage(blob: Blob): Promise<Blob> {
    //     if (blob.size < 500000)
    //         return blob;
    //     let dataURL = await BlobUtils.blobToDataURL(blob);

    //     let dataURLAfter = await this.imageCompress.getImageWithMaxSizeAndMetas({fileName: 'blob', image: dataURL, orientation: DOC_ORIENTATION.Default}, this.MAX_REDUCE_SIZE);
    //     return BlobUtils.dataURLToBlob(dataURLAfter.image);
    // }
}
