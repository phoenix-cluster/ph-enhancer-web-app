import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistogramChartsComponent } from './histogram-charts.component';

describe('HistogramChartsComponent', () => {
  let component: HistogramChartsComponent;
  let fixture: ComponentFixture<HistogramChartsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistogramChartsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistogramChartsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
