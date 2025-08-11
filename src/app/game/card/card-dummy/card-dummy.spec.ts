import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDummy } from './card-dummy';

describe('CardDummy', () => {
  let component: CardDummy;
  let fixture: ComponentFixture<CardDummy>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardDummy]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardDummy);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
