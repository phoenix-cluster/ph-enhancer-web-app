import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClusterSpectraTableComponent } from './cluster-spectra-table.component';

describe('ClusterSpectraTableComponent', () => {
  let component: ClusterSpectraTableComponent;
  let fixture: ComponentFixture<ClusterSpectraTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClusterSpectraTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClusterSpectraTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
