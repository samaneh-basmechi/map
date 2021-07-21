import * as mapboxgl from 'mapbox-gl';
import {AddressInfo} from '../../../core/models/address-info.model';
import {MapboxMarkers} from '../../../core/models/mapbox-marker.models';

export class MapboxAction {
  public static startMap(): void {
    if (mapboxgl.getRTLTextPluginStatus() !== 'loaded') {
      mapboxgl.setRTLTextPlugin('/assets/js/mapbox-persian.js', null);
    }
  }

  public static fillGeometry(addressArray: Array<AddressInfo>, markersArray: MapboxMarkers): void {
    for (const addressInfo of addressArray) {
      markersArray.geometry.push(
        {
          type: 'Point',
          item: {
            info: addressInfo,
            lngLat: [addressInfo.longitude, addressInfo.latitude],
          }
        }
      );
    }
  }
}
