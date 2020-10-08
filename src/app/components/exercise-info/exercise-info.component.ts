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

@Component({
  selector: 'app-exercise-info',
  templateUrl: './exercise-info.component.html',
  styleUrls: ['./exercise-info.component.scss']
})
export class ExerciseInfoComponent extends LoadingComponent implements OnInit, DoCheck {
  private challengeState: ChallengeState;
  private solutionCheckTimers: Array<any> = [];
  solutionUrl = this.router.url + '/#';
  challenge: Challenge;
  inOutData: InOutData[];
  exerciseInfo: ExerciseInfo;
  solutionPreview?: string | ArrayBuffer;
  availableLanguages = LanguageConverter.languages();
  model: SolutionViewModel;
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
    private domSanitizer: DomSanitizer
  ) { super(); }

  ngOnInit(): void {
    this.startLoading();

    this.challenge = new Challenge();
    this.sendMode = false;
    this.model = new SolutionViewModel();
    this.exerciseInfo = new ExerciseInfo();
    this.solutionPreview = null;
    this.model.Language = null;
    this.model.ExerciseId = this.route.snapshot.paramMap.get('ExerciseID');

    this.exercisesService.getExercise(this.model.ExerciseId)
      .then((exInfo: ExerciseInfo) => {
        this.exerciseInfo = exInfo;

        if (exInfo.Solutions.length) {
          this.setSendMode();
        }

        this.challengesService.getChallenge(this.exerciseInfo.ChallengeId).then(c => {
            this.challenge = c;
            this.loadExercises();
          });
        this.exercisesService.getExerciseInOutData(this.exerciseInfo.Id).then(io => this.inOutData = io);

        this.titleService.setTitle(`${this.exerciseInfo.Name}`);

        this.exerciseInfo.Solutions.sort((a, b) => new Date(a.SendingTime) < new Date(b.SendingTime) ? 1 : -1);

        this.currentExerciseState.setChallengeId(exInfo.ChallengeId);
        this.currentExerciseState.setExerciseId(exInfo.Id);
      })
      .catch(() => {
        this.router.navigate(['overview']);
      });
    this.currentExerciseState.currentChallengeState.subscribe(s => {
      this.challengeState = s;
    });
  }

  private async loadExercises() {
    this.exercisesService.getExercises(this.challenge.Id)
      .then((_exercises) => {
        this.exercises = _exercises;
        this.exercises.forEach(exercise => { // TODO Change back?
          this.startLoading();
          this.exercisesService.getExercise(exercise.Id).then(ex => {
            if (!ex.Solutions.length)
              exercise.Status = -1;
            this.finishLoading();
          })
        });
        this.finishLoading();
      });
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

  async ngDoCheck() {
    if (this.isReady() && this.model.ExerciseId !== this.route.snapshot.paramMap.get('ExerciseID')) {
      this.ngOnInit();
    }
  }

  public setSendMode() {
    this.sendMode = true;
  }

  public solved(): boolean {  // TODO ask if solved is the last solution or not
    return this.exerciseInfo.Solutions.find(s => s.Status === 7) !== undefined ? true : false;
  }
  
  public selectLanguage(Language: string) {
    this.model.Language = Language;

    document.getElementById('sub').hidden = true;
    setTimeout(() => document.getElementById('sub').hidden = false, 10);
  }

  get selectedLanguage() {
    if (this.model.Language) {
      return LanguageConverter.fileExtensionByPrettyName(this.model.Language);
    }
  }

  setFile(event) {
    if (event.srcElement.files[0]) {
      if (this.model.Language === null) {
        this.toastr.warning('Выберите язык программирования');
      }
      this.model.File = event.srcElement.files[0];
      const fileReader = new FileReader();
      fileReader.onload = _ => {
        this.solutionPreview = fileReader.result;
      };
      fileReader.readAsText(this.model.File);
      this.solutionUrl = URL.createObjectURL(this.model.File);
      document.getElementById('a').setAttribute('download', this.model.File.name);
    }
  }

  public sanitize (url: string) {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }

  public getCode(): Array<string> {
    return this.solutionPreview.toString().split('\n');
  }

  get submitDisabled() {
    if (!this.model.File) {
      this.toastr.warning('Загрузите файл');
      return true;
    } else {
      if (this.model.Language === null) {
        this.toastr.warning('Выберите язык программирования');
        return true;
      } else {
        if (!this.model.File.name.endsWith(LanguageConverter.fileExtensionByPrettyName(this.model.Language))) {
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
            if (this.exerciseInfo.Solutions.some(s => s.Id === createdSolution.Id)) {
              this.toastr.warning(`Вы уже отправляли такое решение`);
              return;
            }
            const f = () => this.solutionCheckLoop(createdSolution);
            this.toastr.success(`Решение успешно загружено`);
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
    this.exercisesService.checkSolution(checkSolution.Id).subscribe(solution => {
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
    });
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
    this.exercisesService.downloadSolution(solution.Id).subscribe(s => {
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

  fontColor(status: SolutionStatus): string {
    if (status < 5) {
      return '#ff4c4c';
    }
    if (status < 7) {
      return '#0088FF';
    }
    return '#00975d'
  }

  public isReady() {
    return !this.isLoading();
  }
}
