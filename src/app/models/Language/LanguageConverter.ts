import { Language } from './Language';

export class LanguageConverter {
  public static files = {
    java: 'assets/languages/JAVA.md',
    csharp: 'assets/languages/CSHAPR.md',
    pas: 'assets/languages/PASABC.md',
    fpas: 'assets/languages/FPAS.md',
    c: 'assets/languages/C.md',
    cpp: 'assets/languages/CPP.md',
    python: 'assets/languages/PYTHON.md',
    js: 'assets/languages/JS.md'
  }

  private static readonly info: Language[] = [
    {
      language: 'Java',
      fileExtension: '.java',
      webName: 'java',
      fileName: 'Main.java',
      link: LanguageConverter.files.java
    },
    {
      language: 'C#',
      fileExtension: '.cs',
      webName: 'csharp',
      fileName: 'Program.cs',
      link: LanguageConverter.files.csharp
    },
    {
      language: 'Pascal ABC',
      fileExtension: '.pas',
      webName: 'pasabc',
      fileName: 'Program.pas',
      link: LanguageConverter.files.pas
    },
    {
      language: 'Free Pascal',
      fileExtension: '.pas',
      webName: 'fpas',
      fileName: 'Program.pas',
      link: LanguageConverter.files.fpas
    },
    {
      language: 'C',
      fileExtension: '.c',
      webName: 'c',
      fileName: 'Program.c',
      link: LanguageConverter.files.c
    },
    {
      language: 'C++',
      fileExtension: '.cpp',
      webName: 'cpp',
      fileName: 'Progran.cpp',
      link: LanguageConverter.files.cpp
    },
    {
      language: 'Python 3.9.0',
      fileExtension: '.py',
      webName: 'python',
      fileName: 'Program.py',
      link: LanguageConverter.files.python
    },
    {
      language: 'JS ES6',
      fileExtension: '.js',
      webName: 'js',
      fileName: 'Program.js',
      link: LanguageConverter.files.js
    }
  ]

  public static webName(language: string) {
    return this.info.find(lang => lang.language === language).webName;
  }

  public static languages(): string[] {
    return LanguageConverter.info.map(LI => LI.language);
  }

  public static link(language: string): string | undefined {
    return LanguageConverter.info.find((L) => L.language === language || L.webName == language).link;
  }
  
  public static fileExtensionByPrettyName(language: string) {
    return LanguageConverter.info.find(LI => LI.language === language).fileExtension;
  }

  public static normalFromWeb(language: string) {
    if(LanguageConverter.info.find(LI => LI.webName === language)){
      return LanguageConverter.info.find(LI => LI.webName === language).language;
    } else {
      return undefined;
    }
  }

  public static fileName(language: string): string {
    return LanguageConverter.info.find(LI => LI.webName === language).fileName;
  }
} 