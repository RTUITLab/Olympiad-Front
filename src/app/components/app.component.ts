import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/Users/User';
import { UserStateService } from '../services/Users/user-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user: User;

  constructor(private router: Router, private usersService: UserStateService) {}

  ngOnInit() {
    if (window.location.hash) {
      sessionStorage.setItem('userToken', window.location.hash.slice(1));
    }

    this.usersService.currentUserStream.subscribe(U => this.user = U);
  }

  public isGlobalAdmin(): boolean {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return false;
    }

    const payload = token.split('.')[1];
    if (!payload) {
      return false;
    }

    const parsedToken = JSON.parse(atob(payload) || '{}') || {};
    if (!parsedToken || !parsedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) {
      return false;
    }

    const roles = parsedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    return roles.indexOf('Admin') !== -1;
  }

  public underAnotherUser(): boolean {
    return !!sessionStorage.getItem('userToken');
  }
}
