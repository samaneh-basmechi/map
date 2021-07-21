import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {NeshanConverterAddress, SearchedAddress} from '../models/neshan_address.model';

@Injectable({
  providedIn: 'root'
})
export class NeshanService {

  constructor(private http: HttpClient) {
  }

  public convertLatLngToAddress(pointer: Array<number>): Observable<NeshanConverterAddress> {
    const url = `${environment.neshanBaseUrl}/v2/reverse?lat=${pointer[1]}&lng=${pointer[0]}`;
    return this.http.get<NeshanConverterAddress>(url, {headers: {'api-key': environment.neshanApiKey}});
  }

  public searchAddress(searchTerm: string, pointer: Array<number>): Observable<SearchedAddress> {
    const url = `${environment.neshanBaseUrl}/v1/search?term=${searchTerm}&lat=${pointer[1]}&lng=${pointer[0]}`;
    return this.http.get<SearchedAddress>(url, {headers: {'api-key': environment.neshanApiKey}});
  }
}
