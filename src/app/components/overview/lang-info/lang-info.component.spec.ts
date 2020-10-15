import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LangInfoComponent } from './lang-info.component';

describe('LangInfoComponent', () => {
  let component: LangInfoComponent;
  let fixture: ComponentFixture<LangInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LangInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LangInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
