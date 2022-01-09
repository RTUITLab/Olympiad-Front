import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UserStateService } from '../Users/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private router: Router, private usersState: UserStateService) { }

  canActivate(): boolean {
    const token = sessionStorage.getItem('userToken') || localStorage.getItem('userToken');

    let returnTo = location.pathname;

    if (this.usersState.currentUser || token) {
      this.usersState.getMe(token)
        .subscribe(success => {
          if (!success) {
            returnTo = location.pathname;
            this.redirectToLogin(returnTo);
          }
        });
      return true;
    }

    this.redirectToLogin(returnTo);

    return false;
  }

  private redirectToLogin(path): void {
    if (path === '/') {
      this.router.navigate(['login']);
    } else {
      this.router.navigate(['login'], { queryParams: { returnTo: path } });
    }
  }
}
