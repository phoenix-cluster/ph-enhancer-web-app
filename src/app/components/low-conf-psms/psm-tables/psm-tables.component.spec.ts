import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PsmTablesComponent } from './psm-tables.component';

describe('PsmTablesComponent', () => {
  let component: PsmTablesComponent;
  let fixture: ComponentFixture<PsmTablesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PsmTablesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PsmTablesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
