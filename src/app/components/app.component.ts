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
}
