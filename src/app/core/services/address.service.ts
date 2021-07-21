import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {AddressInfo} from '../models/address-info.model';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) {
  }

  public getPublicAddresses(): Observable<Array<AddressInfo>> {
    return this.http.get<Array<AddressInfo>>(`${environment.baseUrl}/public-addresses`);
  }

  public addPublicAddress(addressIfo: AddressInfo): Observable<AddressInfo> {
    return this.http.post<AddressInfo>(`${environment.baseUrl}/public-addresses`, addressIfo);
  }

  public editPublicAddress(addressIfo: AddressInfo): Observable<AddressInfo> {
    return this.http.put<AddressInfo>(`${environment.baseUrl}/public-addresses/${addressIfo.id}`, addressIfo);
  }

  public deletePublicAddress(id: number): Observable<AddressInfo> {
    return this.http.delete<AddressInfo>(`${environment.baseUrl}/public-addresses/${id}`);
  }

  public getFavouriteAddresses(): Observable<Array<AddressInfo>> {
    return this.http.get<Array<AddressInfo>>(`${environment.baseUrl}/favorite-addresses`);
  }

  public addFavouriteAddress(addressIfo: AddressInfo): Observable<AddressInfo> {
    return this.http.post<AddressInfo>(`${environment.baseUrl}/favorite-addresses`, addressIfo);
  }

  public editFavouriteAddress(addressIfo: AddressInfo): Observable<AddressInfo> {
    return this.http.put<AddressInfo>(`${environment.baseUrl}/favorite-addresses/${addressIfo.id}`, addressIfo);
  }

  public deleteFavouriteAddress(id: number): Observable<AddressInfo> {
    return this.http.delete<AddressInfo>(`${environment.baseUrl}/favorite-addresses/${id}`);
  }
}
