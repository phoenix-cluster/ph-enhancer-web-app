import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterRatioChartComponent } from './cluster-ratio-chart.component';

describe('ClusterRatioChartComponent', () => {
  let component: ClusterRatioChartComponent;
  let fixture: ComponentFixture<ClusterRatioChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterRatioChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterRatioChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
