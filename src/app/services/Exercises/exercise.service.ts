import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Api } from 'src/app/api';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { InOutData } from 'src/app/models/Exercises/InOutData';
import { UserStateService } from '../Users/user-state.service';

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

  downloadSolution(solutionId: string): Observable<HttpResponse<string>> {
    return this.http.get(Api.downloadSolution(solutionId), { headers: this.usersService.bearer, responseType: 'text', observe: 'response' });
  }
}
