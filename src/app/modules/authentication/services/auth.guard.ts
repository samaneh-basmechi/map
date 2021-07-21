import {Injectable} from '@angular/core';
import {Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthGuard implements CanActivate {
  constructor(private router: Router) {
  }

  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('accessToken');
    if (token) {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
}
