import {Component, OnDestroy, OnInit} from '@angular/core';
import {UserService} from './services/user.service';
import {User} from './models/user.model';
import {JwtService} from '../../core/services/jwt.service';
import {ShareMethodService} from '../../shared/services/share-method.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  public isEditing = false;
  public userInfo: User = {name: '', phone: '', email: '', password: '', id: 0};
  private userId: string;
  private editSubscription: Subscription = new Subscription();
  private userSubscription: Subscription = new Subscription();

  constructor(private userService: UserService,
              private shareMethodService: ShareMethodService,
              private jwtService: JwtService) {
  }

  ngOnDestroy(): void {
    this.editSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.getUser();
  }

  public edit(): void {
    this.isEditing = false;
    this.editSubscription = this.userService.editUser(this.userId, this.userInfo).subscribe((result: User) => {
      this.shareMethodService.openSnackBar('ویرایش اطلاعات شما با موفقیت انجام شد');
    });
  }

  private getUser(): void {
    this.decodeJwtToken();
    this.userSubscription = this.userService.getUser(this.userId).subscribe((result: User) => {
      this.userInfo = result;
    });
  }

  private decodeJwtToken(): void {
    this.userId = this.jwtService.decodeJwtToken();
  }
}
