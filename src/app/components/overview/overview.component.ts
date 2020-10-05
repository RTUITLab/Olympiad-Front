import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/models/Users/User';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  user: User;

  constructor(
    private titleService: Title,
    private usersService: UserStateService,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Общие положения');
    this.usersService.currentUserStream.subscribe(U => this.user = U);
  }

}
