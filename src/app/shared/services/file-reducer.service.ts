import { Injectable } from '@angular/core';
import { DOC_ORIENTATION, NgxImageCompressService } from 'ngx-image-compress';
import { MyFile } from '../models/content.models';
import { BlobUtils } from '../utils/blob.utils';

@Injectable({
    providedIn: 'root'
})
export class FileReducerService {

    private MAX_REDUCE_SIZE = 0.4;

    constructor(private imageCompress: NgxImageCompressService) { }

    async compressImage(blob: Blob): Promise<Blob> {
        if (blob.size < 500000)
            return blob;
        let dataURL = await BlobUtils.blobToDataURL(blob)
        let dataURLAfter = await this.imageCompress.getImageWithMaxSizeAndMetas({fileName: 'asd', image: dataURL, orientation: DOC_ORIENTATION.Default}, this.MAX_REDUCE_SIZE);
        return BlobUtils.dataURLToBlob(dataURLAfter.image);
    }
}
