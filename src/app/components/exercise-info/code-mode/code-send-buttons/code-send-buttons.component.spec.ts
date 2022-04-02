import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodeSendButtonsComponent } from './code-send-buttons.component';

describe('CodeSendButtonsComponent', () => {
  let component: CodeSendButtonsComponent;
  let fixture: ComponentFixture<CodeSendButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CodeSendButtonsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CodeSendButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
