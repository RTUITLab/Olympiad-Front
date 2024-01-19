import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { Solution } from 'src/app/models/Solutions/Solution';
import { DateHelpers } from 'src/app/services/DateHelpers';
import { SolutionService } from 'src/app/services/Solutions/solution.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-docs-mode',
  templateUrl: './docs-mode.component.html',
  styleUrls: ['./docs-mode.component.scss']
})
export class DocsModeComponent implements OnInit, OnChanges {

  @Input() exerciseInfo: ExerciseInfo;

  files: File[] = [];
  sendingStatus: string[] = [];

  constructor(
    private toastr: ToastrService,
    private solutionsService: SolutionService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.resetFiles();
  }

  ngOnInit(): void {
  }
  public maxSizeInMegabytes(sizeInBytes: number): number {
    return sizeInBytes / 1_000_000;
  }
  public selectedFile(index: number, event): void {
    const file = event.srcElement.files[0] as File;
    event.srcElement.value = '';
    if (!file.size || file.size > this.exerciseInfo.restrictions.docs.documents[index].maxSize) {
      this.toastr.warning("Недопустимый размер файла");
      return;
    }
    this.files[index] = file;
  }
  public allFilesSelected(): boolean {
    return this.files.length && this.files.every(f => f);
  }

  public async sendFiles(): Promise<void> {

    try {

      const solutionSentResponse = await this.solutionsService.sendDocsSolution(this.exerciseInfo.id, this.files).toPromise();
      this.exerciseInfo.solutions.unshift(solutionSentResponse.solution);
      this.toastr.success("Решение отправлено");
      this.resetFiles();
    } catch (error) {
      console.error('DocsModeComponent', error);
      if (error.status == 429){ // to many requests
        this.toastr.warning("Отправлять решение можно только раз в минуту")
      } else {
        this.toastr.error("Не удалось отправить решение")
      }
    }
  }

  private resetFiles() {
    this.files = this.exerciseInfo.restrictions.docs.documents.map(d => null);
    this.sendingStatus = this.files.map(f => null);
  }

  prettyTime(time: string): string {
    if (!time) {
      return 'нет данных';
    }
    return DateHelpers.prettyTime(time);
  }
  private getFileLink(solution: Solution, fileName: string): string {
    return `${environment.baseUrl}/api/check/${solution.id}/document/${fileName}`
  }
}
