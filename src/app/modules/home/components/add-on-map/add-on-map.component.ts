import {Component, EventEmitter, Inject, Input, OnDestroy, Output} from '@angular/core';
import {AddressService} from '../../../../core/services/address.service';
import {NeshanService} from '../../../../core/services/neshan.service';
import {STATUS} from '../../shared-state';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Status} from '../../../../core/models/status.model';
import {NeshanConverterAddress} from '../../../../core/models/neshan_address.model';
import {AddressInfo} from '../../../../core/models/address-info.model';
import {JwtService} from '../../../../core/services/jwt.service';
import {ShareMethodService} from '../../../../shared/services/share-method.service';
import {Images} from '../../utils/images';

@Component({
  selector: 'app-add-on-map',
  templateUrl: './add-on-map.component.html'
})
export class AddOnMapComponent implements OnDestroy {
  @Input()
  selectedMarker: AddressInfo;
  @Output()
  getAddressesInfo: EventEmitter<any> = new EventEmitter();
  public images: Images = new Images();
  private convertLatLngToAddressSubscription: Subscription = new Subscription();
  private addPublicAddressSubscription: Subscription = new Subscription();
  private addFavouriteAddressSubscription: Subscription = new Subscription();


  constructor(private addressService: AddressService,
              private shareMethodService: ShareMethodService,
              private neshanService: NeshanService,
              private jwtService: JwtService,
              @Inject(STATUS) public status: BehaviorSubject<Status>) {
  }

  ngOnDestroy(): void {
    this.convertLatLngToAddressSubscription.unsubscribe();
    this.addPublicAddressSubscription.unsubscribe();
    this.addFavouriteAddressSubscription.unsubscribe();
  }

  public cancel(): void {
    this.updateStatus(null);
  }

  public convertLatLngToAddress(): void {
    const point: Array<number> = [this.selectedMarker.longitude, this.selectedMarker.latitude];
    this.convertLatLngToAddressSubscription = this.neshanService.convertLatLngToAddress(point).subscribe(
      (neshanAddress: NeshanConverterAddress) => {
        this.selectedMarker.address = neshanAddress.formatted_address;
        this.add();
      }
    );
  }

  private updateStatus(status): void {
    this.status.next(status);
  }

  private add(): void {
    if (this.status.value === 'PUBLIC_ADDRESS_ADDING') {
      this.addPublicAddress();
      return;
    }
    this.addFavouriteAddress();
  }

  private addPublicAddress(): void {
    this.addPublicAddressSubscription = this.addressService.addPublicAddress(this.selectedMarker).subscribe((result: AddressInfo) => {
      this.shareMethodService.openSnackBar('آدرس عمومی جدید با موفقیت افزوده شد');
      this.resetFactory();
    });
  }

  private addFavouriteAddress(): void {
    const userId: string = this.jwtService.decodeJwtToken();
    this.selectedMarker.userId = Number(userId);
    this.addFavouriteAddressSubscription = this.addressService.addFavouriteAddress(this.selectedMarker).subscribe((result: AddressInfo) => {
      this.shareMethodService.openSnackBar('آدرس منتخب جدید با موفقیت افزوده شد');
      this.resetFactory();
    });
  }

  private resetFactory(): void {
    this.updateStatus(null);
    this.getAddressesInfo.emit();
  }
}
