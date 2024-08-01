import { Injectable } from '@angular/core';
import { DataUrl, NgxImageCompressService } from 'ngx-image-compress';

@Injectable({
  providedIn: 'root'
})
export class FileReducerService {

  constructor(private imageCompress: NgxImageCompressService) { }

  compressImage(image: any) {
    this.imageCompress.uploadFile().then();
  }
}
