import {Injectable} from '@angular/core';
import jwt_decode from 'jwt-decode';
import {DecodedToken} from '../../modules/profile/models/decoded-token.model';

@Injectable({
  providedIn: 'root'
})
export class JwtService {

  public decodeJwtToken(): string {
    const decodedToken: DecodedToken = jwt_decode(localStorage.getItem('accessToken'), {header: false});
    return decodedToken.sub;
  }
}
