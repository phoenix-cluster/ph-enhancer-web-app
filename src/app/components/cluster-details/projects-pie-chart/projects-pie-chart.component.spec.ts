import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectsPieChartComponent } from './projects-pie-chart.component';

describe('ProjectsPieChartComponent', () => {
  let component: ProjectsPieChartComponent;
  let fixture: ComponentFixture<ProjectsPieChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectsPieChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectsPieChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
