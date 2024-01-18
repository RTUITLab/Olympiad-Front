import { Component, OnInit } from '@angular/core';
import { SupportedRuntime } from 'src/app/models/About/BuildInfo';
import { AboutService } from 'src/app/services/About/about.service';

@Component({
  selector: 'app-lang-info',
  templateUrl: './lang-info.component.html',
  styleUrls: ['./lang-info.component.scss'],
})
export class LangInfoComponent implements OnInit {
  constructor(private aboutService: AboutService) {}
  private _currentRuntimeTitle = '';
  private _supportedRuntimes: SupportedRuntime[] = [];

  ngOnInit(): void {
    this.aboutService.getSupportedRuntimes().then((r) => {
      this._supportedRuntimes = r.supportedRuntimes;
      if (this._supportedRuntimes[0]) {
        this._currentRuntimeTitle = this._supportedRuntimes[0].title;
      }
    });
  }

  public get currentRuntime(): SupportedRuntime {
    return this._supportedRuntimes.find(
      (r) => r.title == this._currentRuntimeTitle
    );
  }

  public get supportedRuntimes(): SupportedRuntime[] {
    return this._supportedRuntimes;
  }

  public changeLang(lang: string): void {
    this._currentRuntimeTitle = lang;
  }
}
