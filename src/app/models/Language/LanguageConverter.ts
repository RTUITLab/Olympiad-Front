import { Language } from './Language';

export class LanguageConverter {
  public static files = {
    java: require('!!raw-loader!src/assets/languages/JAVA.md'),
    csharp: require('!!raw-loader!src/assets/languages/CSHAPR.md'),
    pas: require('!!raw-loader!src/assets/languages/PASABC.md'),
    fpas: require('!!raw-loader!src/assets/languages/FPAS.md'),
    c: require('!!raw-loader!src/assets/languages/C.md'),
    cpp: require('!!raw-loader!src/assets/languages/CPP.md'),
    python: require('!!raw-loader!src/assets/languages/PYTHON.md'),
  }

  private static readonly info: Language[] = [
    {
      language: 'Java',
      fileExtension: '.java',
      webName: 'java',
      fileName: 'Main.java',
      note: LanguageConverter.files.java.default
    },
    {
      language: 'C#',
      fileExtension: '.cs',
      webName: 'csharp',
      fileName: 'Program.cs',
      note: LanguageConverter.files.csharp.default
    },
    {
      language: 'Pascal ABC',
      fileExtension: '.pas',
      webName: 'pasabc',
      fileName: 'Program.pas',
      note: LanguageConverter.files.pas.default
    },
    {
      language: 'Free Pascal',
      fileExtension: '.pas',
      webName: 'fpas',
      fileName: 'Program.pas',
      note: LanguageConverter.files.fpas.default
    },
    {
      language: 'C',
      fileExtension: '.c',
      webName: 'c',
      fileName: 'Program.c',
      note: LanguageConverter.files.c.default
    },
    {
      language: 'C++',
      fileExtension: '.cpp',
      webName: 'cpp',
      fileName: 'Progran.cpp',
      note: LanguageConverter.files.cpp.default
    },
    {
      language: 'Python 3.9.0',
      fileExtension: '.py',
      webName: 'python',
      fileName: 'Program.py',
      note: LanguageConverter.files.python.default
    },
    {
      language: 'JS ES6',
      fileExtension: '.js',
      webName: 'js',
      fileName: 'Program.js'
    }
  ]

  public static webName(language: string) {
    return this.info.find(lang => lang.language === language).webName;
  }

  public static languages(): string[] {
    return LanguageConverter.info.map(LI => LI.language);
  }

  public static note(language: string): string | undefined {
    return LanguageConverter.info.find((L) => L.language === language).note;
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