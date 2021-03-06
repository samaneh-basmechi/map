import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from 'src/environments/environment';
import {AuthenticationService} from './authentication.service';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('accessToken');
    const isLoggedIn = !!token;
    const isApiUrl = request.url.startsWith(environment.baseUrl);
    if (isLoggedIn && isApiUrl) {
      request = request.clone({
        setHeaders: {Authorization: `Bearer ${token}`}
      });
    }

    return next.handle(request);
  }
}
