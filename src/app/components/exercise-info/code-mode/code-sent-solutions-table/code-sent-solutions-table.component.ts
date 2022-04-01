import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { LanguageConverter } from 'src/app/models/Language/LanguageConverter';
import { Solution } from 'src/app/models/Solutions/Solution';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { SolutionUtils } from 'src/app/services/SolutionUtils';

@Component({
  selector: 'app-code-sent-solutions-table',
  templateUrl: './code-sent-solutions-table.component.html',
  styleUrls: ['./code-sent-solutions-table.component.scss']
})
export class CodeSentSolutionsTableComponent implements OnInit {

  @Input() exerciseInfo: ExerciseInfo;


  constructor(
    private exercisesService: ExerciseService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
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
  solutionStatusTooltip(status: SolutionStatus): string {
    return SolutionStatusConverter.getTooltip(status);
  }
  solutionStatusIcon(status: SolutionStatus): string {
    return SolutionStatusConverter.getIcon(status);
  }
}
