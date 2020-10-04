import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  constructor(private titleService: Title) { }

  get buildNumber(): string {
    return environment.buildNumber;
  }

  ngOnInit(): void {
    this.titleService.setTitle('О сайте');
  }

}
