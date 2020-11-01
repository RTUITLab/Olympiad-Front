import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskCheckCommentComponent } from './task-check-comment.component';

describe('TaskCheckCommentComponent', () => {
  let component: TaskCheckCommentComponent;
  let fixture: ComponentFixture<TaskCheckCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TaskCheckCommentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskCheckCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
