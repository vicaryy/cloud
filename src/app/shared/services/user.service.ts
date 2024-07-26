import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/content.models';
import { environment } from '../../../environments/environment.development';
import { BackendApiService } from './backend-api.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private backend: BackendApiService) { }

  getUser(userId: number): Observable<User> {
    return this.backend.getUser(userId);
  }
}
