import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { MyFile } from '../models/content.models';

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {

  constructor(private fileService: FileService) { }

  uploadProfilePhoto(file: File) {
    const myFile: MyFile = {

    }
    this.fileService.uploadFiles
}
}
