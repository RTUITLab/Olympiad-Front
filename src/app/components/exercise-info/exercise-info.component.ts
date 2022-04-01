import { Component, DoCheck, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { LanguageConverter } from 'src/app/models/Language/LanguageConverter';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { ChallengesService } from 'src/app/services/Challenges/challenges.service';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { InOutData } from 'src/app/models/Exercises/InOutData';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { LoadingComponent } from 'src/app/models/LoadingComponent';
import { UpdateService } from 'src/app/services/Updates/update.service';
import { SolutionService } from 'src/app/services/Solutions/solution.service';
import { environment } from 'src/environments/environment';
import { UserStateService } from 'src/app/services/Users/user-state.service';
import { ChallengeUtils } from 'src/app/services/Challenges/ChallengeUtils';
import { ExerciseType } from 'src/app/models/Exercises/ExerciseType';

@Component({
  selector: 'app-exercise-info',
  templateUrl: './exercise-info.component.html',
  styleUrls: ['./exercise-info.component.scss']
})
export class ExerciseInfoComponent extends LoadingComponent implements OnInit, DoCheck {
  challenge: Challenge;
  inOutData: InOutData[];
  exerciseInfo: ExerciseInfo;
  availableLanguages: string[] = LanguageConverter.languages();
  model: CodeSolutionViewModel;
  sendMode: boolean;
  exercises: Array<ExerciseCompact>;

  constructor(
    private challengesService: ChallengesService,
    private exercisesService: ExerciseService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private titleService: Title,
    private currentExerciseState: ExerciseStateService,
    private updateService: UpdateService,
    private solutionService: SolutionService,
    private usersService: UserStateService
  ) { super(); }

  ngOnInit(): void {
    this.startLoading();

    this.updateService.solutionStream.subscribe(S => {
      if (this.exerciseInfo && S && S.exerciseId === this.exerciseInfo.id) {
        if (this.exerciseInfo.solutions) {
          const solution = this.exerciseInfo.solutions.find(s => s.id === S.id);
          if (solution) {
            solution.startCheckingTime = S.startCheckingTime;
            solution.checkedTime = S.checkedTime;
            solution.status = S.status || S.hiddenStatus;
            solution.logs = S.logs;
          } else {
            this.exerciseInfo.solutions.unshift(S);
          }
        } else {
          this.exerciseInfo.solutions.unshift(S);
        }
      }
    });

    this.updateService.exerciseStream.subscribe(S => {
      if (this.exercises && S) {
        const ex = this.exercises.find(E => E.id === S.id);
        if (ex) {
          ex.status = S.status || S.hiddenStatus;
        }
      }
    });

    this.challenge = new Challenge();
    this.sendMode = false;
    this.exerciseInfo = new ExerciseInfo();
    this.model = new CodeSolutionViewModel();
    this.model.content = null;
    this.model.language = null;
    this.model.exerciseId = this.route.snapshot.paramMap.get('ExerciseID');

    this.exercisesService.getExercise(this.model.exerciseId)
      .then((exInfo: ExerciseInfo) => {
        this.exerciseInfo = exInfo;
        if (this.exerciseInfo.type === ExerciseType.Code) {
          this.availableLanguages = exInfo.restrictions.code.allowedRuntimes
            .map(r => LanguageConverter.normalFromWeb(r))
            .filter(r => r);
        }
        this.challengesService.getChallenge(this.exerciseInfo.challengeId).then(c => {
          this.startLoading();
          this.challenge = c;
          this.loadExercises();
        });

        this.exercisesService.getExerciseInOutData(this.exerciseInfo.id).then(io => {
          this.inOutData = io;
        });

        this.solutionService.getSolutions(this.exerciseInfo.id)
          .then(solutions => {
            this.exerciseInfo.solutions = solutions;
            if (solutions.length) {
              this.exerciseInfo.solutions.sort((a, b) => new Date(a.sendingTime) < new Date(b.sendingTime) ? 1 : -1);
              this.model.solution = this.exerciseInfo.solutions[0];
              this.model.language = LanguageConverter.normalFromWeb(this.exerciseInfo.solutions[0].language);
              this.model.exerciseId = this.exerciseInfo.id;
              this.sendMode = true;
            }

            if (this.challenge.toEnd && this.isFinished() && solutions.length) {
              this.sendMode = true;
            }
            this.finishLoading();
          });

        this.titleService.setTitle(`${this.exerciseInfo.name}`);


        this.currentExerciseState.setChallengeId(exInfo.challengeId);
        this.currentExerciseState.setExerciseId(exInfo.id);
      })
      .catch((error) => {
        console.error(error);
        this.router.navigate(['overview']);
      });
  }

  private async loadExercises(): Promise<void> {
    this.exercisesService.getExercises(this.challenge.id)
      .then((_exercises) => {
        this.exercises = _exercises;
        this.exercises.forEach(exercise => {
          exercise.status = exercise.status || exercise.hiddenStatus || -1;
        });
        this.finishLoading();
      });
  }

  public statusClass(exercise: ExerciseCompact): string {
    if (exercise.status === -1) {
      return '';
    }
    if (exercise.status < 5) {
      return 'error';
    }
    if (exercise.status < 7 || exercise.status === 8) {
      return 'processing';
    }
    if (exercise.status === 7) {
      return 'ok';
    }
  }

  async ngDoCheck(): Promise<void> {
    if (this.isReady() && this.model.exerciseId !== this.route.snapshot.paramMap.get('ExerciseID')) {
      this.ngOnInit();
    }
  }

  public setSendMode(): void {
    this.sendMode = true;
  }

  get languageNote(): string | undefined {
    return LanguageConverter.note(this.model.language);
  }
  public isReady() {
    return !this.isLoading();
  }

  public isFinished() {
    return ChallengeUtils.CalcChallengeState(this.challenge) === ChallengeState.Ended;
  }
  public isCodeMode() {
    return this.exerciseInfo && this.exerciseInfo.type === ExerciseType.Code;
  }
  public isDocsMode() {
    return this.exerciseInfo && this.exerciseInfo.type === ExerciseType.Docs;
  }
}
