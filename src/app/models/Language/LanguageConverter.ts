import { Language } from './Language';

export class LanguageConverter {
  private static readonly info: Language[] = [
    {
      language: 'Java',
      fileExtension: '.java',
      webName: 'java',
      fileName: 'Main.java'
    },
    {
      language: 'C#',
      fileExtension: '.cs',
      webName: 'csharp',
      fileName: 'Program.cs'
    },
    {
      language: 'Pascal ABC',
      fileExtension: '.pas',
      webName: 'pasabc',
      fileName: 'Program.pas'
    },
    {
      language: 'Free Pascal',
      fileExtension: '.pas',
      webName: 'fpas',
      fileName: 'Program.pas'
    },
    {
      language: 'C',
      fileExtension: '.c',
      webName: 'c',
      fileName: 'Program.c'
    },
    {
      language: 'C++',
      fileExtension: '.cpp',
      webName: 'cpp',
      fileName: 'Progran.cpp'
    },
    {
      language: 'Python 3.9.0',
      fileExtension: '.py',
      webName: 'python',
      fileName: 'Program.py'
    }
  ]

  public static webName(language: string) {
    return this.info.find(lang => lang.language === language).webName;
  }

  public static languages(): string[] {
    return LanguageConverter.info.map(LI => LI.language);
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