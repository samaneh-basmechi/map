import {Component, Inject} from '@angular/core';
import {accessToken} from 'mapbox-gl';
import {IS_LOGIN} from '../../shared-state';
import {BehaviorSubject} from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['header.component.scss']
})
export class HeaderComponent {

  constructor(@Inject(IS_LOGIN) public isLogin: BehaviorSubject<boolean>) {
  }

  public logOut(): void {
    localStorage.removeItem('accessToken');
    this.isLogin.next(false);
  }
}
