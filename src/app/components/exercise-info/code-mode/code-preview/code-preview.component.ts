import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SolutionStatus } from 'src/app/models/Solutions/SolutionStatus';
import { SolutionViewModel } from 'src/app/models/Solutions/SolutionViewModel';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { SolutionStatusConverter } from 'src/app/services/SolutionStatusConverter';

@Component({
  selector: 'app-code-preview',
  templateUrl: './code-preview.component.html',
  styleUrls: ['./code-preview.component.scss']
})
export class CodePreviewComponent implements OnInit {
  @Input() model: SolutionViewModel;
  constructor(
    private domSanitizer: DomSanitizer,
    private toastr: ToastrService,
  ) { }

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
