import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputtComponent } from './inputt.component';

describe('InputtComponent', () => {
  let component: InputtComponent;
  let fixture: ComponentFixture<InputtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
