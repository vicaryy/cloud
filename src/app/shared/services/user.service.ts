import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ServerResponse } from '../interfaces/http-interfaces';
import { User } from '../models/content.models';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUser(userId: number): Observable<ServerResponse<User>> {
    return this.http.get<ServerResponse<User>>(environment.apiUrl + "/api/user/" + userId);
  }
}
