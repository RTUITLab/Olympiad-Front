import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-exersize-info-log',
  templateUrl: './exersize-info-log.component.html',
  styleUrls: ['./exersize-info-log.component.scss']
})
export class ExersizeInfoLogComponent implements OnInit {

  constructor() { }

  @Input() compileLog : string;


  ngOnInit(): void {
  }

}
