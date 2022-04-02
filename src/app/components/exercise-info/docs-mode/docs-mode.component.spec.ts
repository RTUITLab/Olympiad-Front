import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsModeComponent } from './docs-mode.component';

describe('DocsModeComponent', () => {
  let component: DocsModeComponent;
  let fixture: ComponentFixture<DocsModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsModeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
