import {LngLatBounds, LngLatLike} from 'mapbox-gl';
import {MapboxMarkers} from '../../core/models/mapbox-marker.models';

export class PointArray {
  public bounds: LngLatBounds;
  private readonly values: LngLatLike[];

  constructor(publicAddressMarkers: MapboxMarkers, favouriteAddressMarkers: MapboxMarkers) {
    const publicAddressPoints = publicAddressMarkers.geometry.map(item => item.item.lngLat);
    const favouriteAddressPoints = favouriteAddressMarkers.geometry.map(item => item.item.lngLat);
    this.values = [...publicAddressPoints, ...favouriteAddressPoints];

    this.fitBounds();
  }

  public fitBounds(): void {
    this.bounds = this.values.reduce((bounds, point) => {
      return bounds.extend(point as any);
    }, new LngLatBounds(this.values[0], this.values[1]));
  }
}
