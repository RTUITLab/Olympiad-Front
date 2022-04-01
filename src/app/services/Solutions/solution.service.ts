import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { DocsSolutionRequest } from 'src/app/models/Solutions/DocsSolutionRequest';
import { DocsSolutionResponse } from 'src/app/models/Solutions/DocsSolutionResponse';
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


  sendCodeSolution(data: CodeSolutionViewModel): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', data.file, data.file.name);
    return this.http.post<Solution>(
      Api.sendCodeSolution(data), formData, this.usersService.authOptions);
  }

  sendDocsSolution(exerciseId: string, data: DocsSolutionRequest): Observable<DocsSolutionResponse> {
    return this.http.post<DocsSolutionResponse>(
      Api.sendDocsSolution(exerciseId), data, this.usersService.authOptions);
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
