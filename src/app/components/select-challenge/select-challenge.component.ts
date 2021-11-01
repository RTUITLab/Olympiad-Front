import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';
import { CurrentChallenge } from 'src/app/models/Challenges/CurrentChallenge';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { User } from 'src/app/models/Users/User';
import { ChallengesService } from 'src/app/services/Challenges/challenges.service';
import { ChallengeUtils } from 'src/app/services/Challenges/ChallengeUtils';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { UserStateService } from 'src/app/services/Users/user-state.service';

@Component({
  selector: 'app-select-challenge',
  templateUrl: './select-challenge.component.html',
  styleUrls: ['./select-challenge.component.scss']
})
export class SelectChallengeComponent implements OnInit {
  public user: User;

  public challenges: Array<Challenge> = [];

  public currentExercise: ExerciseCompact;
  public exercises: Array<ExerciseCompact> = [];

  private initChallengeId: string;
  private initExerciseId: string;

  constructor(
    private challengeService: ChallengesService,
    private exerciseService: ExerciseService,
    private currentExerciseState: ExerciseStateService,
    private cdRef: ChangeDetectorRef,
    private usersState: UserStateService,
    public currentChallenge: CurrentChallenge
  ) { }

  async ngOnInit(): Promise<void> {
    this.usersState.currentUserStream.subscribe(U => {
      this.user = U;
      if (this.user) {
        this.loadChallenges();
      }
    });
  }

  public async loadChallenges(): Promise<void> {
    this.challenges = await this.challengeService.getChallengeList();

    if (this.initChallengeId) {
      this.currentChallenge.challenge = this.challenges.find(challenge => challenge.id === this.initChallengeId);
      this.loadExercises();
    }

    this.currentExerciseState.currentChallengeId.subscribe(challengeId => {
      if (!challengeId) {
        this.initChallengeId = '';
        this.currentChallenge = new CurrentChallenge();
        return;
      }


      this.initChallengeId = challengeId;
      if (this.challenges) {
        this.currentChallenge.challenge = this.challenges.find(challenge => challenge.id === this.initChallengeId);
        this.cdRef.detectChanges();
        this.loadExercises();
      }
    });

    this.currentExerciseState.currentExerciseId.subscribe(exerciseId => {
      if (!exerciseId) {
        return;
      }

      this.initExerciseId = exerciseId;
      if (this.exercises) {
        this.currentExercise = this.exercises.find(ex => ex.id === exerciseId);
      }
    });

    this.currentExerciseState.currentChallengeState.subscribe(state => this.updateState(state));
    const timer = setInterval(() => this.timeToEnd(), 1000);
  }

  private async loadExercises(): Promise<void> {
    this.exerciseService.getExercises(this.currentChallenge.challenge.id)
      .then((_exercises) => {
        this.exercises = _exercises;
        if (this.initExerciseId) {
          this.currentExercise = this.exercises.find(exercise => exercise.id === this.initExerciseId);
        }
      });
  }

  private timeToEnd(): void {
    if (!this.currentChallenge) {
      return;
    }

    const state = ChallengeUtils.CalcChallengeState(this.currentChallenge.challenge);
    this.currentExerciseState.setChallengeState(state);
  }

  public challengeTime(challenge: Challenge): string {
    return ChallengeUtils.ChallengeTime(challenge);
  }

  private async updateState(state: ChallengeState): Promise<void> {
    if (state === null) {
      return;
    }

    this.currentChallenge.state = state;
    this.currentChallenge.timeLeft = this.challengeTime(this.currentChallenge.challenge);
    if ((state === ChallengeState.InProgress ||
      state === ChallengeState.Ended) &&
      !this.exercises && this.initChallengeId) {
      this.loadExercises();
    }
  }

  setDefaultExercise(): void {
    this.currentExercise = null;
    this.initExerciseId = null;
  }
}
