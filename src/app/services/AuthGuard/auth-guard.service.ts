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

    if (this.usersState.currentUser || token) {
      this.usersState.getMe(token)
        .subscribe(success => {
          if (!success) {
            this.router.navigate(['login']);
          }
        });
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}
