import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ShareMethodService} from '../../../../shared/services/share-method.service';
import {ErrorMatcher} from '../error-matcher';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';
import {AuthResponse} from '../../models/auth-response.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnDestroy {
  public hidePass = true;
  public matcher = new ErrorMatcher();
  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
  });

  private registerSubscription: Subscription = new Subscription();

  constructor(private authenticationService: AuthenticationService,
              private shareMethodService: ShareMethodService,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.registerSubscription.unsubscribe();
  }

  public register(): void {
    this.registerSubscription = this.authenticationService.register(this.form.value).subscribe((result: AuthResponse) => {
      localStorage.setItem('accessToken', result.accessToken);
      this.shareMethodService.openSnackBar('ثبت نام شما با موفقیت انجام شد');
      this.router.navigate(['home']);
    });
  }
}
