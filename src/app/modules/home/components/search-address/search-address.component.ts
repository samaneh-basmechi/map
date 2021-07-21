import {Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild} from '@angular/core';
import {NeshanService} from '../../../../core/services/neshan.service';
import {NeshanAddress, SearchedAddress} from '../../../../core/models/neshan_address.model';
import {LngLatLike} from 'mapbox-gl';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-search-address',
  templateUrl: './search-address.component.html',
  styleUrls: ['./search-address.component.scss']
})
export class SearchAddressComponent implements OnDestroy {
  @ViewChild('addressText', {static: false}) addressText: ElementRef;
  @Output() setCenterMapLngLat: EventEmitter<LngLatLike> = new EventEmitter();
  @Output() setMapZoomAmount: EventEmitter<Array<number>> = new EventEmitter();
  public addressArray: Array<NeshanAddress> = [];

  private searchAddressSubscription: Subscription = new Subscription();

  constructor(private neshanService: NeshanService) {
  }

  ngOnDestroy(): void {
    this.searchAddressSubscription.unsubscribe();
  }

  public focusOutMapSearch(): void {
    setTimeout(() => {
      this.addressArray = [];
    }, 100);
  }

  public searchAddress(searchValue): void {
    if (searchValue.target.value) {
      const TehranLnglat = [51.4099659, 35.7157713];
      this.searchAddressSubscription = this.neshanService.searchAddress(searchValue.target.value, TehranLnglat)
        .subscribe((resp: SearchedAddress) => {
          this.addressArray = resp.items;
        });
    } else {
      this.addressArray = [];
    }
  }

  public selectAddress(item: NeshanAddress): void {
    this.addressArray = [];
    this.setMapZoomAmount.emit([16]);
    this.addressText.nativeElement.value = item.title;
    this.setCenterMapLngLat.emit([item.location.x, item.location.y]);
  }
}
