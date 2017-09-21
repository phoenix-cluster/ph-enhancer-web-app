import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewIdentifiedComponent } from './new-identified.component';

describe('NewIdentifiedComponent', () => {
  let component: NewIdentifiedComponent;
  let fixture: ComponentFixture<NewIdentifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewIdentifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewIdentifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
