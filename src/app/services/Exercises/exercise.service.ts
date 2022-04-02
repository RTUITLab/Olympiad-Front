import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscriber } from 'rxjs';
import { Api } from 'src/app/api';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { InOutData } from 'src/app/models/Exercises/InOutData';
import { Solution } from 'src/app/models/Solutions/Solution';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { UserStateService } from '../Users/user-state.service';
import { DocsSolutionResponse } from 'src/app/models/Solutions/DocsSolutionResponse';

@Injectable({
  providedIn: 'root'
})
export class ExerciseService {

  constructor(private http: HttpClient, private usersService: UserStateService) { }

  public getExercises(challengeId: string): Promise<Array<ExerciseCompact>> {
    return this.http.get<Array<ExerciseCompact>>(Api.getExercises(challengeId), this.usersService.authOptions).toPromise();
  }

  public getExercise(exerciseId: string): Promise<ExerciseInfo> {
    return this.http.get<ExerciseInfo>(Api.getExercise(exerciseId), this.usersService.authOptions).toPromise();
  }

  public getExerciseInOutData(exerciseId: string): Promise<InOutData[]> {
    return this.http.get<InOutData[]>(
      Api.getExerciseInOutData(exerciseId), this.usersService.authOptions).toPromise();
  }

  downloadSolution(solutionId: string): Observable<any> {
    return this.http.get(
      Api.downloadSolution(solutionId), { headers: this.usersService.bearer, responseType: 'text' });
  }
}
