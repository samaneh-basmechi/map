import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {STATUS} from '../../shared-state';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Status} from '../../../../core/models/status.model';
import {AddressService} from '../../../../core/services/address.service';
import {AddressInfo} from '../../../../core/models/address-info.model';
import {ShareMethodService} from '../../../../shared/services/share-method.service';

@Component({
  selector: 'app-favourite-address-list',
  templateUrl: './favourite-address-list.component.html'
})
export class FavouriteAddressListComponent implements OnDestroy {
  @Input()
  addressArray: Array<AddressInfo>;
  @Output()
  getAddressInfoArray: EventEmitter<any> = new EventEmitter();
  @Output()
  updatesSelectedMarker: EventEmitter<AddressInfo> = new EventEmitter();
  @Output()
  removeSelectedMarkerOfMakers: EventEmitter<number> = new EventEmitter();
  public isEditing = false;
  public indexItem = 0;
  private saveEditingSubscription: Subscription = new Subscription();
  private saveDeletingSubscription: Subscription = new Subscription();


  constructor(@Inject(STATUS) public status: BehaviorSubject<Status>,
              private addressService: AddressService,
              private shareMethodService: ShareMethodService) {
  }

  ngOnDestroy(): void {
    this.saveEditingSubscription.unsubscribe();
    this.saveDeletingSubscription.unsubscribe();
  }

  public saveEditing(publicAddress: AddressInfo): void {
    this.updateIsEditing(false);
    this.saveEditingSubscription = this.addressService.editFavouriteAddress(publicAddress).subscribe(result => {
      this.shareMethodService.openSnackBar('آدرس منتخب موردنظر با موفقیت ویرایش شد');
      this.getAddressInfoArray.emit();
    });
  }

  public saveDeleting(addressItemId: number): void {
    this.saveDeletingSubscription = this.addressService.deleteFavouriteAddress(addressItemId).subscribe(result => {
      this.shareMethodService.openSnackBar('آدرس منتخب موردنظر با موفقیت حذف شد');
      this.getAddressInfoArray.emit();
    });
  }

  public onEditMarkerOnMap(addressItem: AddressInfo): void {
    this.status.next('FAVOURITE_ADDRESS_EDITING');
    this.updatesSelectedMarker.emit(addressItem);
    this.removeSelectedMarkerOfMakers.emit(addressItem.id);
  }

  private updateIsEditing(state: boolean): void {
    this.isEditing = state;
  }
}
