import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { User } from 'src/app/models/Users/User';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: User;
  url: string;

  constructor(private router: Router, private route: ActivatedRoute, private usersService: UserStateService) { }

  ngOnInit(): void {
    this.usersService.currentUserStream.subscribe(U => this.user = U);
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) 
        this.url = event.url;
    })
  }
}
