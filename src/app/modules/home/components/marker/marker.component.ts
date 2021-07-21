import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {Geometry} from '../../../../core/models/mapbox-marker.models';
import {BehaviorSubject, Subscription} from 'rxjs';
import {STATUS} from '../../shared-state';
import {AddressService} from '../../../../core/services/address.service';
import {Status} from '../../../../core/models/status.model';
import {AddressInfo} from '../../../../core/models/address-info.model';
import {ShareMethodService} from '../../../../shared/services/share-method.service';

@Component({
  selector: 'app-marker',
  templateUrl: './marker.component.html'
})
export class MarkerComponent implements OnDestroy {
  @Input()
  type: Status;
  @Input()
  addressItem: Geometry;
  @Input()
  markerImg: string;
  @Output()
  updatesSelectedMarker: EventEmitter<AddressInfo> = new EventEmitter();
  @Output()
  removeSelectedMarkerOfMakers: EventEmitter<number> = new EventEmitter();
  @Output()
  setIsEditing: EventEmitter<boolean> = new EventEmitter();
  @Output()
  getAddressInfoArray: EventEmitter<any> = new EventEmitter();

  private deletePublicAddressSubscription: Subscription = new Subscription();
  private deleteFavouriteAddressSubscription: Subscription = new Subscription();

  constructor(@Inject(STATUS) public status: BehaviorSubject<Status>,
              private addressService: AddressService,
              private shareMethodService: ShareMethodService) {
  }

  ngOnDestroy(): void {
    this.deleteFavouriteAddressSubscription.unsubscribe();
    this.deletePublicAddressSubscription.unsubscribe();
  }

  public cancel(): void {
    this.resetFactory();
  }

  public onEdit(addressItem): void {
    this.status.next(this.type);
    this.updatesSelectedMarker.emit(addressItem.item.info);
    this.removeSelectedMarkerOfMakers.emit(addressItem.item.info.id);
  }

  public delete(markerSelected: Geometry): void {
    if (this.type === 'PUBLIC_ADDRESS_EDITING') {
      this.deletePublicAddress(markerSelected.item.info.id);
      return;
    }
    this.deleteFavouriteAddress(markerSelected.item.info.id);
  }

  private deletePublicAddress(itemId): void {
    this.deletePublicAddressSubscription = this.addressService.deletePublicAddress(itemId).subscribe(result => {
      this.shareMethodService.openSnackBar('آدرس عمومی موردنظر با موفقیت حذف شد');
      this.resetFactory();
    });
  }

  private deleteFavouriteAddress(itemId): void {
    this.deleteFavouriteAddressSubscription = this.addressService.deleteFavouriteAddress(itemId).subscribe(result => {
      this.shareMethodService.openSnackBar('آدرس منتخب موردنظر با موفقیت حذف شد');
      this.resetFactory();
    });
  }

  private resetFactory(): void {
    this.updateStatus(null);
    this.getAddressInfoArray.emit();
  }

  private updateStatus(status): void {
    this.status.next(status);
  }
}
