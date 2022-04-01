export class DocsSolutionRequest {
  files: DocsSolutionFileRequest[];
}

export class DocsSolutionFileRequest {
  name: string;
  size: number;
  mimeType: string;
}
