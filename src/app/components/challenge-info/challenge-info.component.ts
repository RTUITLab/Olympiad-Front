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
import { SolutionService } from 'src/app/services/Solutions/solution.service';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { UpdateService } from 'src/app/services/Updates/update.service';

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
    private exerciseService: ExerciseService,
    private updateService: UpdateService,
    private solutionService: SolutionService
  ) { super() }

  async ngDoCheck() {
    if (this.isReady() && this.challenge && this.challenge.id !== this.route.snapshot.paramMap.get('ChallengeId')) {
      this.ngOnInit();
    }
  }

  ngOnInit(): void {
    this.startLoading();

    this.updateService.exerciseStream.subscribe(S => {
      if (this.exercises && S) {
        const ex = this.exercises.find(E => E.id === S.id);
        if (ex) {
          ex.status = S.status;
        }
      }
    })

    const id = this.route.snapshot.paramMap.get('ChallengeId');
    this.currentExerciseState.setChallengeId(id);
     
    this.challengesService.getChallenge(id)
      .then(challenge => {
        this.challenge = challenge;
        this.currentExerciseState.setChallenge(this.challenge);
        this.titleService.setTitle(`${this.challenge.name}`);
        
        this.loadExercises();
        this.finishLoading();
      });
  }

  private async loadExercises() {
    this.startLoading();
    this.exerciseService.getExercises(this.challenge.id)
      .then((_exercises) => {
        this.exercises = _exercises;
        this.exercises.forEach((exercise) => {
          exercise.status = exercise.status || exercise.hiddenStatus || -1;
          console.log(exercise.status);
        });
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
    if (exercise.status === -1) {
      return '';
    }
    if (exercise.status < 5) {
      return 'error';
    }
    if (exercise.status < 7) {
      return 'processing';
    }
    if (exercise.status === 7) {
      return 'ok';
    }
  }

  public start() {
    this.router.navigate([`exercises/${this.exercises[0].id}`])
  }

  public isReady(): boolean {
    return !this.isLoading();
  }
}
