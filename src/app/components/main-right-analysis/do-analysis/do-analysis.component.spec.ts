import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoAnalysisComponent } from './do-analysis.component';

describe('DoAnalysisComponent', () => {
  let component: DoAnalysisComponent;
  let fixture: ComponentFixture<DoAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
