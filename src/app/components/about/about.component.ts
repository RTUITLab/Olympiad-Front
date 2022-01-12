import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AboutService } from 'src/app/services/About/about.service';
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
    private currentExerciseState: ExerciseStateService,
    private aboutService: AboutService
  ) { }
  
  private _apiBuildNumber: string = "no-build-id";

  get buildNumber(): string {
    return environment.buildNumber;
  }

  get apiBuildNumber(): string {
    return this._apiBuildNumber;
  }


  ngOnInit(): void {
    this.titleService.setTitle('О сайте');
    this.currentExerciseState.setChallengeId('');
    this.aboutService.getBuildInfo().then(r => {
      this._apiBuildNumber = r.buildNumber
    });
  }

}
