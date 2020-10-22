import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/api';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { Solution } from 'src/app/models/Solutions/Solution';
import { UserStateService } from '../Users/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  public userId?: string;
  public connection: HubConnection;

  private solutionsBehavior = new BehaviorSubject<Solution>(undefined);
  public solutionStream = this.solutionsBehavior.asObservable();

  private exerciseBehavior = new BehaviorSubject<ExerciseCompact>(undefined);
  public exerciseStream = this.exerciseBehavior.asObservable();

  private messageBehavior = new BehaviorSubject<string>(undefined);
  public messageStream = this.messageBehavior.asObservable();

  constructor(private usersService: UserStateService) {
    this.usersService.currentUserStream.subscribe(U => {
      if (U && (U.id !== this.userId || !this.userId)) {
        this.userId = U.id;
        this.connect(localStorage.getItem('userToken'));
      }
      if (!U) {
        this.userId = undefined;
        if (this.connection) this.connection.stop();
      }
    });
  }

  public connect(token: string): void {

    this.connection = new HubConnectionBuilder()
      .withUrl(Api.getSignalRHubUrl(), {
        accessTokenFactory: () => {
          return token;
        }
      })
      .build();
    
    this.connection.on('UpdateSolutionStatus', (solution: Solution) => {this.solutionsBehavior.next(solution)});
    this.connection.on('UpdateExerciseStatus', (exerciseStatus: ExerciseCompact) => this.exerciseBehavior.next(exerciseStatus));
    this.connection.on('InformationMessage', (message: string) => this.messageBehavior.next(message));
      
    this.connection.start()
      .catch(() => console.log('Can not connect'));
  }
}
