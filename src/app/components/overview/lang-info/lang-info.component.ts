import { Component, OnInit } from '@angular/core';
import { LanguageConverter } from 'src/app/models/Language/LanguageConverter';

@Component({
  selector: 'app-lang-info',
  templateUrl: './lang-info.component.html',
  styleUrls: ['./lang-info.component.scss']
})
export class LangInfoComponent implements OnInit {
  public currentLang = 'java';
  constructor() { }

  ngOnInit(): void {
  }

  public get link(): string { return LanguageConverter.link(this.currentLang) }

  public changeLang(lang: string): void {
    this.currentLang = lang;
  }
}
