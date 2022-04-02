export class DocsRestrictions {
  documents: DocumentRestriction[];
}

export class DocumentRestriction {
  title: string;
  description: string;
  maxSize: number;
  allowedExtensions: string[];
}