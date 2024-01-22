import { Component, Input, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SupportedRuntime } from 'src/app/models/About/BuildInfo';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { Solution } from 'src/app/models/Solutions/Solution';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { AboutService } from 'src/app/services/About/about.service';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { SolutionUtils } from 'src/app/services/SolutionUtils';
import contentDispositionParser from 'content-disposition-parser';
@Component({
  selector: 'app-code-sent-solutions-table',
  templateUrl: './code-sent-solutions-table.component.html',
  styleUrls: ['./code-sent-solutions-table.component.scss']
})
export class CodeSentSolutionsTableComponent implements OnInit {

  @Input() exerciseInfo: ExerciseInfo;

  supportedRuntimesResponseCache: SupportedRuntime[] = [];

  constructor(
    private exercisesService: ExerciseService,
    private toastr: ToastrService,
    private aboutService: AboutService,
  ) { }

  ngOnInit(): void {
    this.aboutService.getSupportedRuntimes()
      .then(sr => this.supportedRuntimesResponseCache = sr.supportedRuntimes);
  }
  prettyTime(time: string): string {
    if (!time) {
      return 'нет данных';
    }
    return DateHelpers.prettyTime(time);
  }

  normalLang(lang: string): string {
    return this.supportedRuntimesResponseCache.find(r => r.webKey == lang).title;
  }

  downloadSolution(solution: Solution): void {
    this.exercisesService.downloadSolution(solution.id).subscribe((s) => {
       const fileName = contentDispositionParser(s.headers.get('content-disposition')).filename as string;
      SolutionUtils.downloadSolution(s.body, fileName);
      this.toastr.success(`Загрузка начата`);
    }, fail => {
      console.log(fail);
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
