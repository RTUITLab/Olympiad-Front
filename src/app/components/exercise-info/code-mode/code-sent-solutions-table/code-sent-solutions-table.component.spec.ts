import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSentSolutionsTableComponent } from './code-sent-solutions-table.component';

describe('CodeSentSolutionsTableComponent', () => {
  let component: CodeSentSolutionsTableComponent;
  let fixture: ComponentFixture<CodeSentSolutionsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeSentSolutionsTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSentSolutionsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
