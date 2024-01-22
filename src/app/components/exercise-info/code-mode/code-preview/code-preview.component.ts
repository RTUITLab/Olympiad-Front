import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { UserStateService } from 'src/app/services/Users/user-state.service';
import { ExerciseService } from 'src/app/services/Exercises/exercise.service';
import contentDispositionParser from 'content-disposition-parser';

@Component({
  selector: 'app-code-preview',
  templateUrl: './code-preview.component.html',
  styleUrls: ['./code-preview.component.scss']
})
export class CodePreviewComponent implements OnInit, OnChanges {
  @Input() model: CodeSolutionViewModel;
  constructor(
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
    private userService: UserStateService,
    private exercisesService: ExerciseService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.model || !this.model.solution) {
      return;
    }
    this.exercisesService.downloadSolution(this.model.solution.id).subscribe((s) => {
      const fileName = contentDispositionParser(s.headers.get('content-disposition')).filename as string;
      this.model.file = new File([new Blob([s.body], { type: "text/plain" })], fileName);
      this.model.content = s.body;
    }, fail => {
      console.log(fail);
    });
  }

  ngOnInit(): void {
  }
  solutionStatusIcon(status: SolutionStatus): string {
    return SolutionStatusConverter.getIcon(status);
  }
  solutionStatusTooltip(status: SolutionStatus): string {
    return SolutionStatusConverter.getTooltip(status);
  }

  prettyTime(time: string): string {
    if (!time) {
      return 'нет данных';
    }
    return DateHelpers.prettyTime(time);
  }

  public getCode(): Array<string> {
    this.syncEditor();
    return this.model.content.toString().split('\n');
  }

  public syncEditor() {
    var leftDiv = document.getElementById('rows');
    var rightDiv = <HTMLElement>document.getElementById('codeRows');

    rightDiv.onscroll = function () {
      leftDiv.scrollTop = rightDiv.scrollTop;
    }
  }
  public sanitize(url: string): any {
    return this.domSanitizer.bypassSecurityTrustUrl(url);
  }
  public copy(): void {
    if (this.model.content) {
      navigator.clipboard.writeText(this.model.content.toString())
        .then(() => this.toastr.success('Код скопирован в буфер обмена'))
        .catch(() => this.toastr.error('Не удалось скопировать код в буфер обмена'));
    } else {
      navigator.clipboard.writeText('Кода не было');
      this.toastr.warning('Нечего копировать');
    }
  }
}
