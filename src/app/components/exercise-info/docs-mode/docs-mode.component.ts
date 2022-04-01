import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ExerciseInfo } from 'src/app/models/Exercises/ExerciseInfo';

@Component({
  selector: 'app-docs-mode',
  templateUrl: './docs-mode.component.html',
  styleUrls: ['./docs-mode.component.scss']
})
export class DocsModeComponent implements OnInit, OnChanges  {

  @Input() exerciseInfo: ExerciseInfo;

  files: File[] = [];
  sendingStatus: string[] = [];

  constructor(
    private toastr: ToastrService,
  ) { }
  ngOnChanges(changes: SimpleChanges): void {
    this.resetFiles();
  }

  ngOnInit(): void {
  }
  public maxSizeInMegabytes(sizeInBytes: number): number {
    return sizeInBytes / 1_000_000;
  }
  public selectedFile(index: number, event): void{
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
    return this.files.every(f => f);
  }

  public async sendFiles(): Promise<void> {    
    for (let i = 0; i < this.files.length; i++) {
      const element = this.files[i];
      this.sendingStatus[i] = "Отправка...";
      await new Promise(r => setTimeout(r, 2000));
      this.sendingStatus[i] = "Отправлено";
    }
    this.toastr.success("Решение отправлено");
    this.resetFiles();
  }
  private resetFiles() {
    this.files = this.exerciseInfo.restrictions.docs.documents.map(d => null);
    this.sendingStatus = this.files.map(f => null);
  }
}
