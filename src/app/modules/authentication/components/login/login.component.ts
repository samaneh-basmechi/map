import {Component, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ErrorMatcher} from '../error-matcher';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnDestroy {
  public hidePass = true;
  public matcher = new ErrorMatcher();

  public form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  private loginSubscription: Subscription = new Subscription();

  constructor(private authenticationService: AuthenticationService,
              private router: Router) {
  }

  ngOnDestroy(): void {
    this.loginSubscription.unsubscribe();
  }

  public login(): void {
    this.loginSubscription = this.authenticationService.login(this.form.get('email').value, this.form.get('password').value)
      .subscribe((result: string) => {
        this.router.navigate(['home']);
      });
  }
}
