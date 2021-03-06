import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { Solution } from 'src/app/models/Solutions/Solution';
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
        s.forEach(S => {
          S = this.processStatus(S);
          this.getSolutionLogs(S.id).then((d) => S.logs = d[0]).catch((e) => console.log(e));
        });
        return s;
      })).toPromise();
  }

  public getSolutionLogs(solutionId: string): Promise<string> {
    return this.http.get<string>(Api.getSolutionLogs(solutionId), this.usersService.authOptions).toPromise();
  }
}
