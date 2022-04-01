import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';
import { environment } from 'src/environments/environment';
import { UserStateService } from 'src/app/services/Users/user-state.service';
import { LanguageConverter } from 'src/app/models/Language/LanguageConverter';

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
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    if (!this.model) {
      return;
    }
    const localModel = this.model;
    console.log("localModel", localModel);
    
    const xhr = new XMLHttpRequest();
    xhr.open('GET', environment.baseUrl + '/api/check/download/' + localModel.solution.id);
    xhr.setRequestHeader('Authorization', this.userService.bearer.get('Authorization'));
    xhr.responseType = 'text';
    xhr.onload = () => {
      this.model.file = new File([xhr.response], LanguageConverter.fileName(localModel.solution.language));

      const fileReader = new FileReader();
      fileReader.onload = _ => {
        this.model.content = fileReader.result;
      };
      fileReader.readAsText(localModel.file);
    };
    xhr.send();

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
