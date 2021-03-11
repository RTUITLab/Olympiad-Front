import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { User } from 'src/app/models/Users/User';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
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
    private currentExerciseState: ExerciseStateService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Общие положения');
    this.usersService.currentUserStream.subscribe(U => this.user = U);
    this.currentExerciseState.setChallengeId('');
  }
}
