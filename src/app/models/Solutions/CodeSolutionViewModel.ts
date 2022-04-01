import { Solution } from "./Solution";

export class CodeSolutionViewModel {
  language: string;
  exerciseId: string;
  solution: Solution;
  private _file: File;
  public set file(file: File) {
    this._file = file;
    if (this.file) {
      this._solutionUrl = URL.createObjectURL(this._file);
    } else {
      this._solutionUrl = null;
    }
  }
  public get file(): File {
    return this._file;
  }
  private _solutionUrl: string;
  public get solutionUrl(): string {
    return this._solutionUrl;
  }
  content: string | ArrayBuffer;
}
