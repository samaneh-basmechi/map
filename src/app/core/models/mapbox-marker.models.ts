import {LngLatLike} from 'mapbox-gl';
import {AddressInfo} from './address-info.model';

interface GeometryItem {
  info: AddressInfo;
  lngLat: LngLatLike;
}

export interface Geometry {
  type: string;
  item: GeometryItem;
}

export interface MapboxMarkers {
  type: string;
  geometry: Array<Geometry>;
}
