import { Component, DoCheck, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { LoadingComponent } from 'src/app/models/LoadingComponent';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { ChallengesService } from 'src/app/services/Challenges/challenges.service';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss']
})
export class ChallengeInfoComponent extends LoadingComponent implements OnInit, DoCheck {
  public challenge?: Challenge;
  public dump: object;
  public exercises: Array<ExerciseCompact>;
  public exerciseNames: string[] = [];
  public statusMode = 'allPics';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private currentExerciseState: ExerciseStateService,
    private challengesService: ChallengesService,
    private exerciseService: ExerciseService
  ) { super() }

  async ngDoCheck() {
    if (this.isReady() && this.challenge && this.challenge.Id !== this.route.snapshot.paramMap.get('ChallengeId')) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.startLoading();

    const id = this.route.snapshot.paramMap.get('ChallengeId');
    this.currentExerciseState.setChallengeId(id);
     
    this.challengesService.getChallenge(id)
      .then(challenge => {
        this.challenge = challenge;
        this.currentExerciseState.setChallenge(this.challenge);
        this.titleService.setTitle(`${this.challenge.Name}`);
        
        this.loadExercises();
        this.finishLoading();
      });
  }

  private async loadExercises() {
    this.startLoading();
    this.exerciseService.getExercises(this.challenge.Id)
      .then((_exercises) => {
        this.exercises = _exercises;
        this.exercises.forEach((exercise) => {
          this.startLoading();
          this.exerciseService.getExercise(exercise.Id)
            .then(ex => {
              if (!ex.Solutions.length)
                exercise.Status = -1;
              this.finishLoading();
            })
        })
        this.finishLoading();
      });
  }

  public convertDate(time: string): string {
    return DateHelpers.convertTime(time);
  }

  public solutionStatusPresent(status: SolutionStatus): string {
    return SolutionStatusConverter.convertToPretty(status);
  }

  public statusClass(exercise: ExerciseCompact) {
    if (exercise.Status === -1) {
      return '';
    }
    if (exercise.Status < 5) {
      return 'error';
    }
    if (exercise.Status < 7) {
      return 'processing';
    }
    if (exercise.Status === 7) {
      return 'ok';
    }
  }

  public start() {
    this.router.navigate([`exercises/${this.exercises[0].Id}`])
  }

  public isReady(): boolean {
    return !this.isLoading();
  }
}
