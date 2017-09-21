import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfScoreChartComponent } from './conf-score-chart.component';

describe('ConfScoreChartComponent', () => {
  let component: ConfScoreChartComponent;
  let fixture: ComponentFixture<ConfScoreChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfScoreChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfScoreChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
