import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveButton } from './leave-button';

describe('LeaveButton', () => {
  let component: LeaveButton;
  let fixture: ComponentFixture<LeaveButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
