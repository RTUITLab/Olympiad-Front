import { Injectable, OnInit } from '@angular/core';
import { HubConnectionBuilder } from '@aspnet/signalr';
import { BehaviorSubject } from 'rxjs';
import { Api } from 'src/app/api';
import { ExerciseStatus } from 'src/app/models/Exercises/ExerciseStatus';
import { UserStateService } from '../Users/user-state.service';
import { Solution } from 'src/app/models/Solutions/Solution';

@Injectable({
  providedIn: 'root'
})
export class UpdateService {
  public connection: HubConnectionBuilder;

  private solutionsBehavior = new BehaviorSubject<Solution>(undefined);
  public solutionStream = this.solutionsBehavior.asObservable();

  private exerciseBehavior = new BehaviorSubject<ExerciseStatus>(undefined);
  public exerciseStream = this.exerciseBehavior.asObservable();

  private messageBehavior = new BehaviorSubject<string>(undefined);
  public messageStream = this.messageBehavior.asObservable();

  constructor(private usersService: UserStateService) {
    this.usersService.currentUserStream.subscribe(U => {
      if (U) this.connect(localStorage.getItem('userToken'))
    });
  }

  public connect (token: string) {
    const connection = new HubConnectionBuilder()
      .withUrl(Api.getSignalRHubUrl(), {
        accessTokenFactory: () => {
          return token;
        }
      })
      .build();
    
    connection.on('UpdateSolutionStatus', (solution: Solution) => this.solutionsBehavior.next(solution));
    connection.on('UpdateExerciseStatus', (exerciseStatus: ExerciseStatus) => this.exerciseBehavior.next(exerciseStatus));
    connection.on('InformationMessage', (message: string) => this.messageBehavior.next(message));
      
    connection.start()
      .then(() => console.log('Connected'))
      .catch(() => console.log('Can not connect'));
  }
}
