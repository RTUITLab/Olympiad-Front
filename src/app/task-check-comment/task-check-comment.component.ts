import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-task-check-comment',
  templateUrl: './task-check-comment.component.html',
  styleUrls: ['./task-check-comment.component.scss']
})
export class TaskCheckCommentComponent implements OnInit {

  constructor() { }

  @Input() index: number;
  @Input() arr: PostComment[];


  ngOnInit(): void {
  }

}

/* tslint:disable */
export interface PostComment {
  raw?: null | string;
  rowNumber?: number;
}