import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {User} from '../models/user.model';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) {
  }

  public getUser(userId): Observable<User> {
    const url = `${environment.baseUrl}/users/${userId}`;
    return this.http.get<User>(url);
  }

  public editUser(userId, newUserInfo): Observable<User> {
    const url = `${environment.baseUrl}/users/${userId}`;
    return this.http.patch<User>(url, newUserInfo);
  }
}
