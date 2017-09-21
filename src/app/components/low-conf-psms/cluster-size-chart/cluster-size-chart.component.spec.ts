import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterSizeChartComponent } from './cluster-size-chart.component';

describe('ClusterSizeChartComponent', () => {
  let component: ClusterSizeChartComponent;
  let fixture: ComponentFixture<ClusterSizeChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterSizeChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterSizeChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
