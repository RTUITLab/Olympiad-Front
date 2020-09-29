import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';
import { Exercise } from 'src/app/models/Exercises/Exercise';

@Injectable({
  providedIn: 'root'
})
export class ExerciseStateService {
  private currentExerciseIdObserver = new BehaviorSubject<string>(null);
  public currentExerciseId = this.currentExerciseIdObserver.asObservable();
  public exerciseId: string;

  private currentExerciseObserver = new BehaviorSubject<Exercise>(null);
  public currentExercise = this.currentExerciseObserver.asObservable();
  public exercise: Exercise;

  private currentChallengeIdObserver = new BehaviorSubject<string>(null);
  public currentChallengeId = this.currentChallengeIdObserver.asObservable();
  public challengeId: string;

  private currentChallengeObserver = new BehaviorSubject<Challenge>(null);
  public currentChallenge = this.currentChallengeObserver.asObservable();
  public challenge: Challenge;

  private currentChallengeStateObserver = new BehaviorSubject<ChallengeState>(null);
  public currentChallengeState = this.currentChallengeStateObserver.asObservable();
  public challengeState: ChallengeState;

  public setExerciseId(exerciseId: string): void {
    this.currentExerciseIdObserver.next(exerciseId);
    this.exerciseId = exerciseId;
  }
  public setExercise(exercise: Exercise): void {
    this.currentExerciseObserver.next(exercise);
    this.exercise = exercise;
  }
  public setChallengeId(challengeId: string): void {
    this.currentChallengeIdObserver.next(challengeId);
    this.challengeId = challengeId;
  }
  public setChallenge(challenge: Challenge): void {
    this.currentChallengeObserver.next(challenge);
    this.currentChallengeIdObserver.next(challenge.Id);
    this.challenge = challenge;
  }
  public setChallengeState(challengeState: ChallengeState): void {
    this.currentChallengeStateObserver.next(challengeState);
    this.challengeState = challengeState;
  }
}
