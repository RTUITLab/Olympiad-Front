import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/models/Users/User';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  user: User;

  constructor(
    private usersState: UserStateService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.usersState.currentUserStream.subscribe(U => this.user = U);
    this.titleService.setTitle('Моя страница');
  }

}
