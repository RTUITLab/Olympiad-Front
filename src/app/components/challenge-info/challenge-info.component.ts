import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { ChallengesService } from 'src/app/services/Challenges/challenges.service';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { UserStateService } from 'src/app/services/Users/user-state.service';
//import { MatDialog } from '@angular/material';

@Component({
  selector: 'app-challenge-info',
  templateUrl: './challenge-info.component.html',
  styleUrls: ['./challenge-info.component.scss']
})
export class ChallengeInfoComponent implements OnInit {
  public challenge?: Challenge;
  public dump: object;
  public exercises: Array<ExerciseCompact>;
  public exerciseNames: string[] = [];
  public statusMode = 'allPics';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usersService: UserStateService,
    private titleService: Title,
    private currentExerciseState: ExerciseStateService,
    private challengesService: ChallengesService,
    //public dialog: MatDialog,
    private toastr: ToastrService,
    private exerciseService: ExerciseService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      const id = params.get('ChallengeId');
      this.currentExerciseState.setChallengeId(id);
      
      this.challengesService.getChallenge(id)
        .then(challenge => {
          this.challenge = challenge;
          this.currentExerciseState.setChallenge(this.challenge);
          this.titleService.setTitle(`${this.challenge.Name}`);

          this.loadExercises();
        })

      this.challengesService.getDump(id)
        .then(dump => {
          for (const userId in dump) {
            if (dump.hasOwnProperty(userId)) {
              const userData = dump[userId];
              for (const exerciseName in userData) {
                if (userData.hasOwnProperty(exerciseName)) {
                  const exercise = userData[exerciseName];
                  if (this.exerciseNames.indexOf(exerciseName) === -1 && exerciseName !== 'summaryScore') {
                    this.exerciseNames.push(exerciseName);
                  }
                }
              }
            }
          }
          this.exerciseNames.sort();
          this.dump = dump;
        })
    });
  }

  private async loadExercises() {
    this.exerciseService.getExercises(this.challenge.Id)
      .then((_exercises) => {
        this.exercises = _exercises;
        this.exercises.forEach(exercise => { // TODO Change back?
          this.exerciseService.getExercise(exercise.Id).then(ex => {
            if (!ex.Solutions.length)
              exercise.Status = -1;
          })
        })
      });
  }

  public convertDate(time: string): string {
    return DateHelpers.convertTime(time);
  }

  public solutionStatusPresent(status: SolutionStatus): string {
    return SolutionStatusConverter.convertToPretty(status);
  }

  public statusClass(exercise: ExerciseCompact) {
    if (exercise.Status === -1) {
      return '';
    }
    if (exercise.Status < 5) {
      return 'error';
    }
    if (exercise.Status < 7) {
      return 'processing';
    }
    if (exercise.Status === 7) {
      return 'ok';
    }
  }

  public start() {
    this.router.navigate([`exercises/${this.exercises[0].Id}`])
  }
}
