import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { last, map } from 'rxjs/operators';
import { Api } from 'src/app/api';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { UserStateService } from '../Users/user-state.service';

@Injectable({
  providedIn: 'root'
})
export class ChallengesService {
  constructor(private http: HttpClient, private usersState: UserStateService) { }

  public getChallengeList(): Promise<Array<Challenge>> {
    return this.http.get<Array<Challenge>>(Api.getChallengesList(), this.usersState.authOptions)
      .pipe(map(CA => {
        for (let i = 0; i < CA.length; i++) {
          CA[i].last = 0;
          CA[i].lenght = 0;
          if (CA[i].toStart) {
            let currentDate = new Date();
            const sign = CA[i].toStart[0] === '-' ? -1 : 1;

            let date = CA[i].toStart.split('.');
            date.pop();

            if (date[0][0] === '-') {
              date[0] = date[0].slice(1);
            }

            let time = date.pop().split(':');

            if (date.length) {
              currentDate = new Date(currentDate.getTime() + 1000*(60*60*24*parseInt(date.pop())));
            }

            currentDate = new Date(currentDate.getTime() + 1000 * sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2])));

            CA[i].startTime = currentDate.toISOString();
            CA[i].lenght -= sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2]));
          }
          if (CA[i].toEnd) {
            let currentDate = new Date();
            const sign = CA[i].toEnd[0] === '-' ? -1 : 1;

            let date = CA[i].toEnd.split('.');
            date.pop();

            if (date[0][0] === '-') {
              date[0] = date[0].slice(1);
            }

            let time = date.pop().split(':');

            if (date.length) {
              currentDate = new Date(currentDate.getTime() + 1000*(60*60*24*parseInt(date.pop())));
            }

            currentDate = new Date(currentDate.getTime() + 1000 * sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2])));

            CA[i].endTime = currentDate.toISOString();
            CA[i].last += sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2]));
            CA[i].lenght += sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2]));

            setInterval(() => {
              CA[i].last!--;
            }, 1000);
          }
        }

        return CA;
      })).toPromise();
  }
  
  public getChallenge(id: string): Promise<Challenge> {
    return this.http.get<Challenge>(Api.getChallenge(id), this.usersState.authOptions)
      .pipe(map(C => {
        
        C.last = 0;
        C.lenght = 0;
        if (C.toStart) {
          let currentDate = new Date();
          const sign = C.toStart[0] === '-' ? -1 : 1;

          let date = C.toStart.split('.');
          date.pop();

          if (date[0][0] === '-') {
            date[0] = date[0].slice(1);
          }

          let time = date.pop().split(':');

          if (date.length) {
            currentDate = new Date(currentDate.getTime() + 1000*(60*60*24*parseInt(date.pop())));
          }
          
          currentDate = new Date(currentDate.getTime() + 1000 * sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2])));

          C.startTime = currentDate.toISOString();
          C.lenght -= sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2]));
        }
        if (C.toEnd) {
          let currentDate = new Date();
          const sign = C.toEnd[0] === '-' ? -1 : 1;

          let date = C.toEnd.split('.');
          date.pop();

          if (date[0][0] === '-') {
            date[0] = date[0].slice(1);
          }

          let time = date.pop().split(':');

          if (date.length) {
            currentDate = new Date(currentDate.getTime() + 1000*(60*60*24*parseInt(date.pop())));
          }
          
          currentDate = new Date(currentDate.getTime() + 1000 * sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2])));

          C.endTime = currentDate.toISOString();
          C.last += sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2]));
          C.lenght += sign * (60*60*parseInt(time[0]) + 60*parseInt(time[1]) + parseInt(time[2]));

          setInterval(() => {
            C.last!--;
          }, 1000);
        }
        return C;
      })).toPromise();
  }

  getDump(id: string): Promise<object> {
    return this.http.get<object>(Api.getDump(id), this.usersState.authOptions).toPromise();
  }
}
