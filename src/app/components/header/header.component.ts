import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/models/Users/User';
import { UpdateService } from 'src/app/services/Updates/update.service';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  url: string;

  constructor(
    private router: Router,
    private usersService: UserStateService,
    private toastr: ToastrService,
    private updateService: UpdateService
  ) { }

  ngOnInit(): void {
    this.usersService.currentUserStream.subscribe(U => this.user = U);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.url = event.url;
      }
    });

    this.updateService.messageStream.subscribe(M => {
      if (M) {
        this.toastr.info(M);
      }
    });
  }
}
