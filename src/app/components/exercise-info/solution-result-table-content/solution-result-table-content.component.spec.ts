import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SolutionResultTableContentComponent } from './solution-result-table-content.component';

describe('SolutionResultTableContentComponent', () => {
  let component: SolutionResultTableContentComponent;
  let fixture: ComponentFixture<SolutionResultTableContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SolutionResultTableContentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SolutionResultTableContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
