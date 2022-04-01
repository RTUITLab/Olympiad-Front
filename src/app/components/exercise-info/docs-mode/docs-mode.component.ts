import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';
import { CodeSolutionViewModel } from 'src/app/models/Solutions/CodeSolutionViewModel';
import { DocsSolutionFileRequest, DocsSolutionRequest } from 'src/app/models/Solutions/DocsSolutionRequest';
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
    console.log(event);
    const file = event.srcElement.files[0] as File;
    event.srcElement.value = '';
    if (file.size > this.exerciseInfo.restrictions.docs.documents[index].maxSize) {
      this.toastr.warning("Недопустимый размер файла");
      return;
    }
    this.files[index] = file;
  }
  public allFilesSelected(): boolean {
    return this.files.length && this.files.every(f => f);
  }

  public async sendFiles(): Promise<void> {

    const request = new DocsSolutionRequest();
    request.files = this.files.map(file => {
      const fileRequest = new DocsSolutionFileRequest();
      fileRequest.name = file.name;
      fileRequest.size = file.size;
      fileRequest.mimeType = file.type;
      return fileRequest;
    });
    try {

      const solutionSentResponse = await this.solutionsService.sendDocsSolution(this.exerciseInfo.id, request).toPromise();
      console.log(solutionSentResponse);



      for (let i = 0; i < this.files.length; i++) {
        const element = this.files[i];
        const url = solutionSentResponse.uploadUrls[i];
        this.sendingStatus[i] = "Отправка...";
        if (!await this.sendFile(element, url)) {
          this.toastr.error("Ошибка при отправке документов");
          break;
        }
        this.sendingStatus[i] = "Отправлено";
      }
      this.exerciseInfo.solutions.unshift(solutionSentResponse.solution);
      this.toastr.success("Решение отправлено");
      this.resetFiles();
    } catch (error) {
      console.log(error);

    }
  }

  private async sendFile(file: File, uploadUrl: string): Promise<boolean> {
    const rawResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
        "x-amz-acl": "public-read" // S3 for direct downloading
      },
      body: file
    });
    return rawResponse.ok;
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
