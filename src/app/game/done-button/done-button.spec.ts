import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoneButton } from './done-button';

describe('DoneButton', () => {
  let component: DoneButton;
  let fixture: ComponentFixture<DoneButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DoneButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DoneButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
