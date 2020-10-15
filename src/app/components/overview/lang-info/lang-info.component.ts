import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lang-info',
  templateUrl: './lang-info.component.html',
  styleUrls: ['./lang-info.component.scss']
})
export class LangInfoComponent implements OnInit {
  public currentLang = 'java';
  public files = {
    java: require('!!raw-loader!src/assets/languages/JAVA.md'),
    csharp: require('!!raw-loader!src/assets/languages/CSHAPR.md'),
    pas: require('!!raw-loader!src/assets/languages/PASABC.md'),
    fpas: require('!!raw-loader!src/assets/languages/FPAS.md'),
    c: require('!!raw-loader!src/assets/languages/C.md'),
    cpp: require('!!raw-loader!src/assets/languages/CPP.md'),
    python: require('!!raw-loader!src/assets/languages/PYTHON.md'),
  }

  constructor() { }

  ngOnInit(): void {
  }

  public get file(): string { return this.files[this.currentLang].default };

  public changeLang(lang: string) {
    this.currentLang = lang;
    console.log(this.files[this.currentLang].default)
  }
}
