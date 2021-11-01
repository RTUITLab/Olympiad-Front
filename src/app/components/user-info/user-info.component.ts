import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { User } from 'src/app/models/Users/User';
import { UserStateService } from 'src/app/services/Users/user-state.service';
import { MatIconRegistry } from '@angular/material/icon';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit {
  user: User;

  constructor(private router: Router, private usersService: UserStateService, iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      'profile',
      sanitizer.bypassSecurityTrustResourceUrl('../../../assets/icon/profile.svg'));
  }

  ngOnInit(): void {
    this.usersService.currentUserStream.subscribe(U => this.user = U);
  }

  myPage(): void {
    this.router.navigate(['user', this.user.id ]);
  }

  isAdmin(): boolean {
    return this.usersService.isAdmin();
  }

  adminFunctions(): void {
    this.router.navigate(['admin-functions']);
  }

  logout(): void {
    this.usersService.logOut();
    this.router.navigate(['/login']);
  }
}
