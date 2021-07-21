import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {LngLatBounds, LngLatLike} from 'mapbox-gl';
import {AddressService} from '../../core/services/address.service';
import {Geometry, MapboxMarkers} from '../../core/models/mapbox-marker.models';
import {IS_LOGIN, STATUS} from './shared-state';
import {BehaviorSubject, Subscription} from 'rxjs';
import {Status} from '../../core/models/status.model';
import {AddressInfo} from '../../core/models/address-info.model';
import {PointArray} from './point-array';
import {clearArray, clearDeepArray} from './utils/array-action';
import {MapboxAction} from './utils/mapbox-action';
import {Images} from './utils/images';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  public Images = new Images();
  public bounds: LngLatBounds;
  public publicAddressArray: Array<AddressInfo>;
  public favouriteAddressArray: Array<AddressInfo>;
  public mapZoomAmount: Array<number> = [14];
  public centerMapLngLat: LngLatLike = [51.414965497099814, 35.74520669562432];
  public selectedMarker: AddressInfo;
  public publicAddressMarkers: MapboxMarkers = {
    type: 'publicAddresses',
    geometry: []
  };
  public favouriteAddressMarkers: MapboxMarkers = {
    type: 'favouriteAddresses',
    geometry: []
  };

  private isLoginSubscription: Subscription = new Subscription();
  private publicAddressSubscription: Subscription = new Subscription();
  private favouriteAddressSubscription: Subscription = new Subscription();

  constructor(private addressService: AddressService,
              @Inject(STATUS) public status: BehaviorSubject<Status>,
              @Inject(IS_LOGIN) public isLogin: BehaviorSubject<boolean>) {
    this.logOutActions();
  }

  ngOnDestroy(): void {
    this.isLoginSubscription.unsubscribe();
    this.publicAddressSubscription.unsubscribe();
    this.favouriteAddressSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.isLoginCheck();
    MapboxAction.startMap();
    this.getAddressesArray();
  }

  public getAddressesArray(): void {
    this.getPublicAddressArray();
    this.getFavouriteAddressArray();
  }

  public getPublicAddressArray(): void {
    clearDeepArray(this.publicAddressMarkers, 'geometry');
    clearArray(this.publicAddressArray);
    this.publicAddressSubscription = this.addressService.getPublicAddresses().subscribe((result: Array<AddressInfo>) => {
      this.publicAddressArray = result;
      MapboxAction.fillGeometry(this.publicAddressArray, this.publicAddressMarkers);
    });
  }

  public getFavouriteAddressArray(): void {
    this.favouriteAddressMarkers.geometry = [];
    clearArray(this.favouriteAddressArray);
    this.favouriteAddressSubscription = this.addressService.getFavouriteAddresses().subscribe((result: Array<AddressInfo>) => {
      this.favouriteAddressArray = result;
      MapboxAction.fillGeometry(this.favouriteAddressArray, this.favouriteAddressMarkers);
    });
  }

  public zoomToBounds(): void {
    const points = new PointArray(this.publicAddressMarkers, this.favouriteAddressMarkers);
    points.fitBounds();

    this.bounds = points.bounds;
  }

  public fixFloatMarkerInCenterOfMap(evt): void {
    const lat = evt.target.transform._center.lat;
    const lng = evt.target.transform._center.lng;
    if (this.selectedMarker) {
      this.selectedMarker.latitude = lat;
      this.selectedMarker.longitude = lng;
    }
  }

  public removeSelectedMarkerOfMakers(addressItemId: number): void {
    if (this.status.value === 'PUBLIC_ADDRESS_EDITING') {
      this.publicAddressMarkers.geometry = this.spliceOfMakers(addressItemId, this.publicAddressMarkers);
      return;
    }
    this.favouriteAddressMarkers.geometry = this.spliceOfMakers(addressItemId, this.favouriteAddressMarkers);
  }

  public updateSelectedMarker(newSelectedMarker ?: AddressInfo): void {
    if (newSelectedMarker) {
      this.selectedMarker = {...newSelectedMarker};
      return;
    }
    this.createNewMarkerObj();
  }

  private logOutActions(): void {
    this.isLoginSubscription = this.isLogin.subscribe((result: boolean) => {
      if (!result) {
        this.favouriteAddressArray = [];
        this.favouriteAddressMarkers.geometry = [];
        this.status.next(null);
      }
    });
  }

  private isLoginCheck(): void {
    if (localStorage.getItem('accessToken')) {
      this.isLogin.next(true);
    }
  }

  private spliceOfMakers(addressItemId: number, markers: MapboxMarkers): Array<Geometry> {
    return markers.geometry.filter(x => {
      return x.item.info.id !== addressItemId;
    });
  }

  private createNewMarkerObj(): void {
    this.selectedMarker = {
      name: '',
      address: '',
      latitude: this.centerMapLngLat[1],
      longitude: this.centerMapLngLat[0],
      id: null,
    };
  }
}
