import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TakenCards } from './taken-cards';

describe('TakenCards', () => {
  let component: TakenCards;
  let fixture: ComponentFixture<TakenCards>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TakenCards]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TakenCards);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
