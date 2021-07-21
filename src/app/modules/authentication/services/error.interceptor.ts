import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from './authentication.service';
import {ShareMethodService} from '../../../shared/services/share-method.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private shareMethodService: ShareMethodService,
    private authenticationService: AuthenticationService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(response => {
      const errorMessage = (response && response.error && response.error.Message) || response.statusText;
      console.log(response);
      if (response.status == 0) {
        this.shareMethodService.openSnackBar('خطا در اتصال، لطفا دقایقی دیگر مجددا تلاش کنید.');
      } else if (response.status == 401 && this.authenticationService.userValue) {
        this.authenticationService.logout();
      } else if (response.status == 404) {
        this.shareMethodService.openSnackBar('آدرس مورد نظر یافت نشد');
      } else if (response.status == 400) {
        this.shareMethodService.openSnackBar('اطلاعات وارد شده غلط است');
      } else if (response.status == 500) {
        this.shareMethodService.openSnackBar('خطای سیستمی!');
      } else if (response && response.error && response.error.Message) {
        this.shareMethodService.openSnackBar(response.error.Message);
      }
      return throwError(errorMessage);
    }));
  }
}
