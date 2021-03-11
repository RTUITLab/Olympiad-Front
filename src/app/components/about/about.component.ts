import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(
    private titleService: Title,
    private currentExerciseState: ExerciseStateService
  ) { }

  get buildNumber(): string {
    return environment.buildNumber;
  }

  ngOnInit(): void {
    this.titleService.setTitle('О сайте');
    this.currentExerciseState.setChallengeId('');
  }

}
