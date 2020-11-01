import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExersizeInfoLogComponent } from './exersize-info-log.component';

describe('ExersizeInfoLogComponent', () => {
  let component: ExersizeInfoLogComponent;
  let fixture: ComponentFixture<ExersizeInfoLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExersizeInfoLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExersizeInfoLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
