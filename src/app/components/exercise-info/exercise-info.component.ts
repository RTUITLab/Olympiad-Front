import { Component, DoCheck, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { LanguageConverter } from 'src/app/models/Language/LanguageConverter';
import { SolutionViewModel } from 'src/app/models/Solutions/SolutionViewModel';
import { ChallengesService } from 'src/app/services/Challenges/challenges.service';
import { ExerciseStateService } from 'src/app/services/Exercises/exercise-state.service';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { InOutData } from 'src/app/models/Exercises/InOutData';
import { Solution } from 'src/app/models/Solutions/Solution';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { SolutionUtils } from 'src/app/services/SolutionUtils';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { ExerciseCompact } from 'src/app/models/Exercises/ExerciseCompact';
import { LoadingComponent } from 'src/app/models/LoadingComponent';
import { DomSanitizer } from '@angular/platform-browser';
import { UpdateService } from 'src/app/services/Updates/update.service';
import { SolutionService } from 'src/app/services/Solutions/solution.service';
import { environment } from 'src/environments/environment';
import { UserStateService } from 'src/app/services/Users/user-state.service';
import { ChallengeUtils } from 'src/app/services/Challenges/ChallengeUtils';

@Component({
  selector: 'app-exercise-info',
  templateUrl: './exercise-info.component.html',
  styleUrls: ['./exercise-info.component.scss']
})
export class ExerciseInfoComponent extends LoadingComponent implements OnInit, DoCheck {
  private challengeState: ChallengeState;
  private solutionCheckTimers: Array<any> = [];
  solutionUrl: string;
  challenge: Challenge;
  inOutData: InOutData[];
  exerciseInfo: ExerciseInfo;
  solutionPreview?: string | ArrayBuffer;
  availableLanguages = LanguageConverter.languages();
  model: SolutionViewModel;
  sendMode: boolean;
  loadedSolution: boolean;
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
    private domSanitizer: DomSanitizer,
    private solutionService: SolutionService,
    private usersService: UserStateService
  ) { super(); }

  ngOnInit(): void {
    this.startLoading();

    this.solutionUrl = 'javascript:void(0);';

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
    })

    this.updateService.exerciseStream.subscribe(S => {
      if (this.exercises && S) {
        const ex = this.exercises.find(E => E.id === S.id);
        if (ex) {
          ex.status = S.status || S.hiddenStatus;
        }
      }
    })

    this.challenge = new Challenge();
    this.sendMode = false;
    this.loadedSolution = false;
    this.exerciseInfo = new ExerciseInfo();
    this.solutionPreview = null;
    this.model = new SolutionViewModel();
    this.model.language = null;
    this.model.exerciseId = this.route.snapshot.paramMap.get('ExerciseID');

    this.exercisesService.getExercise(this.model.exerciseId)
      .then((exInfo: ExerciseInfo) => {
        this.exerciseInfo = exInfo;

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

              this.model.language = LanguageConverter.normalFromWeb(this.exerciseInfo.solutions[0].language);
              this.model.exerciseId = this.exerciseInfo.id;
              
              const xhr = new XMLHttpRequest();
              xhr.open('GET', environment.baseUrl + '/api/check/download/' + solutions[0].id);
              xhr.setRequestHeader('Authorization', this.usersService.bearer.get('Authorization'));
              xhr.responseType = 'text';
              xhr.onload = () => {
                this.model.file = new File([xhr.response], LanguageConverter.fileName(solutions[0].language));
                
                const fileReader = new FileReader();
                fileReader.onload = _ => {
                  this.solutionPreview = fileReader.result;

                  this.solutionUrl = URL.createObjectURL(this.model.file);
                  if (document.getElementById('a')) {
                    document.getElementById('a').setAttribute('download', this.model.file.name);
                  }
                };
                fileReader.readAsText(this.model.file);
              }
              xhr.send();

              this.sendMode = true;
            }

            if (this.challenge.toEnd && this.isFinished()) {
              this.sendMode = true;
            }
            this.finishLoading();
          })

        this.titleService.setTitle(`${this.exerciseInfo.name}`);


        this.currentExerciseState.setChallengeId(exInfo.challengeId);
        this.currentExerciseState.setExerciseId(exInfo.id);
      })
      .catch(() => {
        this.router.navigate(['overview']);
      });
    this.currentExerciseState.currentChallengeState.subscribe(s => {
      this.challengeState = s;
    });
  }

  private async loadExercises() {
    this.exercisesService.getExercises(this.challenge.id)
      .then((_exercises) => {
        this.exercises = _exercises;
        this.exercises.forEach(exercise => {
          exercise.status = exercise.status || exercise.hiddenStatus || -1;
        });
        this.finishLoading();
      });
  }

  public getSolutionLogs(solution: Solution) {
    if (solution.logs) {
      return solution.logs;
    }
    this.solutionService.getSolutionLogs(solution.id).then((response) => {
      solution.logs = response[0];
      return response;
    })
  }

  public statusClass(exercise: ExerciseCompact) {
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

  async ngDoCheck() {
    if (this.isReady() && this.model.exerciseId !== this.route.snapshot.paramMap.get('ExerciseID')) {
      this.ngOnInit();
    }
  }

  public setSendMode() {
    this.sendMode = true;
  }

  public solved(): boolean {
    return this.exerciseInfo.solutions.find(s => s.status === 7) !== undefined ? true : false;
  }
  
  public selectLanguage(Language: string) {
    this.model.language = Language;

    document.getElementById('sub').hidden = true;
    setTimeout(() => document.getElementById('sub').hidden = false, 10);
  }

  get languageNote(): string | undefined {
    return LanguageConverter.note(this.model.language);
  }

  get selectedLanguage() {
    if (this.model.language) {
      return LanguageConverter.fileExtensionByPrettyName(this.model.language);
    }
  }

  setFile(event) {
    if (event.srcElement.files[0]) {
      if (this.model.language === null) {
        this.toastr.warning('Выберите язык программирования');
      }
      this.model.file = event.srcElement.files[0];
      const fileReader = new FileReader();
      fileReader.onload = _ => {
        this.solutionPreview = fileReader.result;
        this.loadedSolution = true;
        event.srcElement.value = '';
        this.solutionUrl = URL.createObjectURL(this.model.file);
        document.getElementById('a').setAttribute('download', this.model.file.name);
      };
      fileReader.readAsText(this.model.file);
    }
  }

  public sanitize (url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  public getCode(): Array<string> {
    this.syncEditor();
    return this.solutionPreview.toString().split('\n');
  }

  get submitDisabled() {
    if (!this.model.file) {
      this.toastr.warning('Загрузите файл');
      return true;
    } else {
      if (this.model.language === null) {
        this.toastr.warning('Выберите язык программирования');
        return true;
      } else {
        if (!this.model.file.name.endsWith(LanguageConverter.fileExtensionByPrettyName(this.model.language))) {
          this.toastr.warning(`Расширение загружаемого вами файла не соответсвует выбранному языку программирования`);
          return true;
        } else {
          return false;
        }
      }
    }
  }

  onSubmit() {
    if (!this.submitDisabled) {
      this.exercisesService.sendSolution(this.model)
        .subscribe(
          createdSolution => {
            if (!createdSolution) {
              this.toastr.warning(`Решение не загружено`);
              return;
            }
            if (this.exerciseInfo.solutions.some(s => s.id === createdSolution.id)) {
              this.toastr.warning(`Вы уже отправляли такое решение`);
              return;
            }
            const f = () => this.solutionCheckLoop(createdSolution);
            this.toastr.success(`Решение успешно загружено`);
            this.exerciseInfo.solutions.unshift(createdSolution);
            f();
          },
          (error: HttpErrorResponse) => {
            if (error.status === 429) { // TooManyRequests HTTP Status
              this.toastr.warning(`Отправлять решения можно только раз в минуту`);
            } else {
              this.toastr.error('Не удалось отправить решение');
            }
          }
        );
    }
  }

  solutionCheckLoop(checkSolution: Solution) {
    /*this.exercisesService.checkSolution(checkSolution.Id).subscribe(solution => {
      const target = this.exerciseInfo.Solutions.find(s => s.Id === solution.Id);
      if (!target) {
        this.exerciseInfo.Solutions.unshift(solution);
      } else {
        target.Status = solution.Status;
        target.StartCheckingTime = solution.StartCheckingTime;
        target.CheckedTime = solution.CheckedTime;
      }
      if (solution.Status === SolutionStatus.InQueue ||
        solution.Status === SolutionStatus.InProcessing) {
        this.solutionCheckTimers.push(
          setTimeout(() => this.solutionCheckLoop(checkSolution), 800)
        );
      }
    });*/
  }

  public copy(): void {
    if (this.solutionPreview) {
      navigator.clipboard.writeText(this.solutionPreview.toString());
    } else {
      navigator.clipboard.writeText('Кода не было');
    }
  }

  prettyTime(time: string): string {
    if (!time) {
      return 'нет данных';
    }
    return DateHelpers.prettyTime(time);
  }

  normalLang(lang: string): string {
    return LanguageConverter.normalFromWeb(lang);
  }

  downloadSolution(solution: Solution): void {
    this.exercisesService.downloadSolution(solution.id).subscribe(s => {
      SolutionUtils.downloadSolution(solution, s);
      this.toastr.success(`Загрузка начата`);
    }, fail => {
      this.toastr.error(`Невозможно скачать решение`);
    });
  }

  solutionStatusPresent(status: SolutionStatus): string {
    return SolutionStatusConverter.convertToPretty(status);
  }

  solutionStatusIcon(status: SolutionStatus): string {
    return SolutionStatusConverter.getIcon(status);
  }

  solutionStatusTooltip(status: SolutionStatus): string {
    return SolutionStatusConverter.getTooltip(status);
  }

  fontColor(status: SolutionStatus): string {
    if (status < 5) {
      return '#ff4c4c';
    }
    if (status < 7 || status === 8) {
      return '#0088FF';
    }
    return '#00975d'
  }

  public isReady() {
    return !this.isLoading();
  }

  public isFinished() {
    return ChallengeUtils.CalcChallengeState(this.challenge) === ChallengeState.Ended;
  }

  public syncEditor() {
    var leftDiv = document.getElementById('rows');
    var rightDiv = <HTMLElement>document.getElementById('codeRows');

    rightDiv.onscroll = function() {
      leftDiv.scrollTop = rightDiv.scrollTop;
    }
  }
}
