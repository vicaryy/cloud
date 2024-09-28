import { Injectable } from '@angular/core';
import { FileService } from './file.service';
import { MyFile, ProfilePhoto } from '../models/content.models';
import { BackendApiService } from './backend-api.service';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePhotoService {

  constructor(private fileService: FileService, private backend: BackendApiService) { }

  async uploadProfilePhoto(file: File) {
    const profilePhoto: ProfilePhoto = {
        blob: file,
        password: await firstValueFrom(this.backend.getRandomPassword()),
    };
    await this.fileService.uploadProfilePicture(profilePhoto);
}
}
