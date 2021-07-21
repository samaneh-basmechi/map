import {Component, EventEmitter, Inject, Output} from '@angular/core';
import {IS_LOGIN, STATUS} from '../../shared-state';
import {BehaviorSubject} from 'rxjs';
import {Status} from '../../../../core/models/status.model';

@Component({
  selector: 'app-add-address-btn',
  templateUrl: './add-address-btn.component.html',
  styleUrls: ['add-address-btn.component.scss']
})
export class AddAddressBtnComponent {
  @Output()
  updateSelectedMarker: EventEmitter<any> = new EventEmitter();

  constructor(@Inject(STATUS) public status: BehaviorSubject<Status>,
              @Inject(IS_LOGIN) public isLogin: BehaviorSubject<boolean>) {
  }

  public onAddNewPublicAddress(): void {
    this.status.next('PUBLIC_ADDRESS_ADDING');
    this.updateSelectedMarker.emit();
  }

  public onAddNewFavouriteAddress(): void {
    this.status.next('FAVOURITE_ADDRESS_ADDING');
    this.updateSelectedMarker.emit();
  }
}
