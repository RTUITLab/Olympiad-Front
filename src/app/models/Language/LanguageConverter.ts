import { Language } from './Language';

export class LanguageConverter {
  private static readonly info: Language[] = [
    {
      Language: 'Java',
      FileExtension: '.java',
      WebName: 'java',
      FileName: 'Main.java'
    },
    {
      Language: 'C#',
      FileExtension: '.cs',
      WebName: 'csharp',
      FileName: 'Program.cs'
    },
    {
      Language: 'Pascal ABC',
      FileExtension: '.pas',
      WebName: 'pasabc',
      FileName: 'Program.pas'
    },
    {
      Language: 'C',
      FileExtension: '.c',
      WebName: 'c',
      FileName: 'Program.c'
    },
    {
      Language: 'C++',
      FileExtension: '.cpp',
      WebName: 'cpp',
      FileName: 'Progran.cpp'
    },
    {
      Language: 'Python 3.6.4',  // TODO Python version
      FileExtension: '.py',
      WebName: 'python',
      FileName: 'Program.py'
    }
  ]

  public static webName(language: string) {
    return this.info.find(lang => lang.Language === language).WebName;
  }

  public static languages(): string[] {
    return LanguageConverter.info.map(LI => LI.Language);
  }
  
  public static fileExtensionByPrettyName(language: string) {
    return LanguageConverter.info.find(LI => LI.Language === language).FileExtension;
  }

  public static normalFromWeb(language: string) {
    if(LanguageConverter.info.find(LI => LI.WebName === language)){
      return LanguageConverter.info.find(LI => LI.WebName === language).Language;
    } else {
      return undefined;
    }
  }

  public static fileName(language: string): string {
    return LanguageConverter.info.find(LI => LI.WebName === language).FileName;
  }
} 