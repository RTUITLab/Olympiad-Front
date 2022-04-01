import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ToastrService } from 'ngx-toastr';
import { Challenge } from 'src/app/models/Challenges/Challenge';
import { ChallengeState } from 'src/app/models/Challenges/ChallengeState';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { LanguageConverter } from 'src/app/models/Language/LanguageConverter';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { ChallengeUtils } from 'src/app/services/Challenges/ChallengeUtils';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { SolutionService } from 'src/app/services/Solutions/solution.service';

@Component({
  selector: 'app-code-send-buttons',
  templateUrl: './code-send-buttons.component.html',
  styleUrls: ['./code-send-buttons.component.scss']
})
export class CodeSendButtonsComponent implements OnInit {

  @Input() model: CodeSolutionViewModel;
  @Input() availableLanguages: string[] = LanguageConverter.languages();
  @Input() conditionDrawer: MatDrawer;
  @Input() challenge: Challenge;
  @Input() exerciseInfo: ExerciseInfo;

  constructor(
    private toastr: ToastrService,
    private solutionsService: SolutionService,
  ) { }

  ngOnInit(): void {
  }

  public selectLanguage(Language: string): void {
    this.model.language = Language;
    this.model.file = null;
    this.model.content = null;
    this.model.solution = null;
    this.model.file = null;

    document.getElementById('sub').hidden = true;
    setTimeout(() => document.getElementById('sub').hidden = false, 10);
  }
  get selectedLanguage(): string {
    if (this.model.language) {
      return LanguageConverter.fileExtensionByPrettyName(this.model.language);
    }
  }
  public isFinished() {
    return ChallengeUtils.CalcChallengeState(this.challenge) === ChallengeState.Ended;
  }
  setFile(event): void {
    if (event.srcElement.files[0]) {
      if (this.model.language === null) {
        this.toastr.warning('Выберите язык программирования');
      }
      this.model.file = event.srcElement.files[0];
      this.model.solution = null;
      const fileReader = new FileReader();
      fileReader.onload = _ => {
        this.model.content = fileReader.result;
        event.srcElement.value = '';
      };
      fileReader.readAsText(this.model.file);
    }
  }
  get submitDisabled(): boolean {
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
  onSubmit(): any {
    if (!this.submitDisabled) {
      this.solutionsService.sendCodeSolution(this.model)
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
            this.toastr.success(`Решение успешно загружено`);
            this.exerciseInfo.solutions.unshift(createdSolution);
            this.model.solution = createdSolution;
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
}
