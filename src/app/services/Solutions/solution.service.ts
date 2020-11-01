import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { Solution } from 'src/app/models/Solutions/Solution';
import { environment } from 'src/environments/environment';
import { UserStateService } from '../Users/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  constructor(private http: HttpClient, private usersService: UserStateService) { }

  public processStatus(solution: Solution): Solution {
    if (solution.hiddenStatus) {
      solution.status = solution.hiddenStatus;
      solution.hiddenStatus = undefined;
    }
    return solution;
  }

  public getSolutions(exerciseId: string): Promise<Array<Solution>> {
    return this.http.get<Array<Solution>>(Api.getSolutionsForExercise(exerciseId), this.usersService.authOptions)
      .pipe<Array<Solution>>(map(s => {
        s.forEach(S => S = this.processStatus(S));
        return s;
      })).toPromise();
  }
  public getBuildLogsForSolution(solutionId: string): Promise<string> {
    return this.http.get<string>(Api.getBuildLogsForSolution(solutionId), this.usersService.authOptions).toPromise();
  }

public getComments(solutionId: string): Promise<any> {
    return this.http.get<any>(`${environment.baseUrl}/api/comment?solutionId=${solutionId}`, this.usersService.authOptions).toPromise();
  }
  
}
