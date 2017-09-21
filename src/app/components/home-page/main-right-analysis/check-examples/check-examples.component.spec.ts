import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckExamplesComponent } from './check-examples.component';

describe('CheckExamplesComponent', () => {
  let component: CheckExamplesComponent;
  let fixture: ComponentFixture<CheckExamplesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckExamplesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckExamplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
