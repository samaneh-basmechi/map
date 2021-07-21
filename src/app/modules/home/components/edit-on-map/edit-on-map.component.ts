import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {NeshanConverterAddress} from '../../../../core/models/neshan_address.model';
import {AddressService} from '../../../../core/services/address.service';
import {NeshanService} from '../../../../core/services/neshan.service';
import {STATUS} from '../../shared-state';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Status} from '../../../../core/models/status.model';
import {AddressInfo} from '../../../../core/models/address-info.model';
import {ShareMethodService} from '../../../../shared/services/share-method.service';
import {Images} from '../../utils/images';

@Component({
  selector: 'app-edit-on-map',
  templateUrl: './edit-on-map.component.html'
})
export class EditOnMapComponent implements OnDestroy {
  @Input()
  selectedMarker: AddressInfo;
  @Output()
  getAddressesInfo: EventEmitter<any> = new EventEmitter();
  public images: Images = new Images();

  private convertLatLngToAddressSubscription: Subscription = new Subscription();
  private editPublicAddressSubscription: Subscription = new Subscription();
  private editFavouriteAddressSubscription: Subscription = new Subscription();


  constructor(private addressService: AddressService,
              private neshanService: NeshanService,
              private shareMethodService: ShareMethodService,
              @Inject(STATUS) public status: BehaviorSubject<Status>) {
  }

  ngOnDestroy(): void {
    this.convertLatLngToAddressSubscription.unsubscribe();
    this.editPublicAddressSubscription.unsubscribe();
    this.editFavouriteAddressSubscription.unsubscribe();
  }

  public save(): void {
    const point = [this.selectedMarker.longitude, this.selectedMarker.latitude];
    this.convertLatLngToAddress(point);
  }

  public cancel(): void {
    this.resetFactory();
  }

  private convertLatLngToAddress(point): void {
    this.convertLatLngToAddressSubscription = this.neshanService.convertLatLngToAddress(point).subscribe(
      (neshanAddress: NeshanConverterAddress) => {
        const newAddressItem: AddressInfo = {...this.selectedMarker};
        newAddressItem.address = neshanAddress.formatted_address;
        this.edit(newAddressItem);
      }
    );
  }

  private edit(newAddressItem: AddressInfo): void {
    if (this.status.value === 'PUBLIC_ADDRESS_EDITING') {
      this.editPublicAddress(newAddressItem);
      return;
    }
    this.editFavouriteAddress(newAddressItem);
  }

  private editPublicAddress(newAddressItem: AddressInfo): void {
    this.editPublicAddressSubscription = this.addressService.editPublicAddress(newAddressItem).subscribe((editedResult: AddressInfo) => {
      this.shareMethodService.openSnackBar('آدرس عمومی موردنظر با موفقیت ویرایش شد');
      this.resetFactory();
    });
  }

  private editFavouriteAddress(newAddressItem: AddressInfo): void {
    this.editFavouriteAddressSubscription = this.addressService.editFavouriteAddress(newAddressItem)
      .subscribe((editedResult: AddressInfo) => {
        this.shareMethodService.openSnackBar('آدرس منتخب موردنظر با موفقیت ویرایش شد');
        this.resetFactory();
      });
  }

  private resetFactory(): void {
    this.updateStatus(null);
    this.getAddressesInfo.emit();
  }

  private updateStatus(status): void {
    this.status.next(status);
  }
}
