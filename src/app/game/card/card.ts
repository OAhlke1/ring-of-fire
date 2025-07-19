import { GameService } from '../../shared/services/game-service';
import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';


@Component({
  standalone: true,
  selector: 'playing-card',
  imports: [NgClass, NgStyle],
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class Card {
  @Input() cardFrontBack!: { backUrl: string, frontUrl: string };
  @Input() cardIndex!: number;
  @ViewChild('cardCover') cardCover!: ElementRef<HTMLDivElement>;
  @ViewChild('cardFace') cardFace!: ElementRef<HTMLDivElement>;
  notPicked!: boolean;
  cursorOverCard!: boolean;
  takeCardAnimation!: boolean;
  cardRotates!: boolean;
  cardCoverHidden = false;
  cardFaceHidden = true;
  rotates = false;


  constructor(private gameService: GameService, private cdr: ChangeDetectorRef) {
    this.notPicked = gameService.cardFrontLinks.length - 1 === this.cardIndex ? true : false;
  }

  takeCard() {
    if (this.cardIndex === this.gameService.cardFrontLinks.length - 1) {
      if (!this.takeCardAnimation) {
        this.notPicked = false;
        this.takeCardAnimation = true;
      } else if (this.takeCardAnimation) {
        this.notPicked = true;
        this.takeCardAnimation = false;
      }
      this.checkIfCardRotates();
      this.cursorOverCard = false;
    }
  }

  checkIfCardRotates() {
    console.log('rotates?', this.rotates)
    if (!this.rotates) {
      this.rotates = true;
      if (!this.notPicked) {
        this.rotateCardForwards();
      } else if (this.notPicked) { this.rotateCardBackwards(); }
    }
  }

  rotateCardForwards(deg = 0) {
    if (!this.notPicked) {
      deg++;
      this.cardCover.nativeElement.style.transform = `rotateY(${deg}deg) scale(${1.1 + deg * 1.4 / 180})`;
      this.cardFace.nativeElement.style.transform = `rotateY(${deg}deg) scale(${1.1 + deg * 1.4 / 180})`;
      if (deg === 90) {
        if (!this.cardCoverHidden && this.cardFaceHidden) {
          this.cardCoverHidden = true;
          this.cardFaceHidden = false
          this.cdr.detectChanges();
        } else if (this.cardCoverHidden && !this.cardFaceHidden) {
          this.cardCoverHidden = false
          this.cardFaceHidden = true;
          this.cdr.detectChanges();
        }
      } else if (deg === 180) {
        this.notPicked = false;
        this.rotates = false;
        this.cdr.detectChanges();
        return;
      }
      setTimeout(() => { this.rotateCardForwards(deg) }, 36 / 25);
    }
  }

  rotateCardBackwards(deg = 180) {
    if (this.notPicked) {
      this.cardCover.nativeElement.style.transform = `rotateY(${deg}deg) scale(${1 + deg * 1.5 / 180})`;
      this.cardFace.nativeElement.style.transform = `rotateY(${deg}deg) scale(${1 + deg * 1.5 / 180})`;
      if (deg === 90) {
        if (this.cardCoverHidden && !this.cardFaceHidden) {
          this.cardCoverHidden = false;
          this.cardFaceHidden = true;
          this.cdr.detectChanges();
        } else if (!this.cardCoverHidden && this.cardFaceHidden) {
          this.cardCoverHidden = true;
          this.cardFaceHidden = false;
          this.cdr.detectChanges();
        }
      } else if (deg === 0) {
        this.notPicked = true;
        this.rotates = false;
        this.cdr.detectChanges();
        return;
      }
      setTimeout(() => { this.rotateCardBackwards(deg-1) }, 36 / 25);
    }
  }

  cardHoverEffectOn() {
    if (this.cardIndex === this.gameService.cardFrontLinks.length - 1 && !this.cursorOverCard && this.notPicked) {
      this.cursorOverCard = true;
    }
  }

  cardHoverEffectOff() {
    if (this.cardIndex === this.gameService.cardFrontLinks.length - 1 && this.cursorOverCard && this.notPicked) {
      this.cursorOverCard = false;
    }
  }
}