import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {AddressService} from '../../../../core/services/address.service';
import {STATUS} from '../../shared-state';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Status} from '../../../../core/models/status.model';
import {AddressInfo} from '../../../../core/models/address-info.model';
import {ShareMethodService} from '../../../../shared/services/share-method.service';

@Component({
  selector: 'app-public-address-list',
  templateUrl: './public-address-list.component.html',
  styleUrls: ['./public-address-list.component.scss']
})
export class PublicAddressListComponent implements OnDestroy {
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
    this.saveEditingSubscription = this.addressService.editPublicAddress(publicAddress).subscribe(result => {
      this.shareMethodService.openSnackBar('آدرس عمومی موردنظر با موفقیت ویرایش شد');
      this.resetFactory();
    });
  }

  public saveDeleting(addressItemId: number): void {
    this.saveDeletingSubscription = this.addressService.deletePublicAddress(addressItemId).subscribe(result => {
      this.shareMethodService.openSnackBar('آدرس عمومی موردنظر با موفقیت حذف شد');
      this.resetFactory();
    });
  }

  public onEditMarkerOnMap(addressItem: AddressInfo): void {
    this.status.next('PUBLIC_ADDRESS_EDITING');
    this.updatesSelectedMarker.emit(addressItem);
    this.removeSelectedMarkerOfMakers.emit(addressItem.id);
  }

  private resetFactory(): void {
    this.updateIsEditing(false);
    this.getAddressInfoArray.emit();
  }

  private updateIsEditing(state: boolean): void {
    this.isEditing = state;
  }
}
