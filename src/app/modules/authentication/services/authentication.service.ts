import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';
import {Register} from '../models/register.model';
import {AuthResponse} from '../models/auth-response.model';


@Injectable({providedIn: 'root'})
export class AuthenticationService {
  private tokenSubject: BehaviorSubject<string>;
  public user: Observable<string>;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.tokenSubject = new BehaviorSubject<string>(null);
    this.tokenSubject.next(localStorage.getItem('accessToken'));
    this.user = this.tokenSubject.asObservable();
  }

  public get userValue(): string {
    return this.tokenSubject.value;
  }

  public register(registerFormData: Register): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/register`, registerFormData);
  }

  public login(email: number, password: string): Observable<string> {
    return this.http.post<AuthResponse>(`${environment.baseUrl}/login`, {email, password})
      .pipe(map((result: AuthResponse) => {
        localStorage.setItem('accessToken', result.accessToken);
        this.tokenSubject.next(result.accessToken);
        return result.accessToken;
      }));
  }

  public logout(): void {
    sessionStorage.removeItem('accessToken');
    this.tokenSubject.next(null);
  }
}

