import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowhistoryComponent } from './showhistory.component';

describe('ShowhistoryComponent', () => {
  let component: ShowhistoryComponent;
  let fixture: ComponentFixture<ShowhistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShowhistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowhistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
