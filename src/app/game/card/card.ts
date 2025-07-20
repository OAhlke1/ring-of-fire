import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { GameModel } from '../../../models/game-model';


@Component({
  standalone: true,
  selector: 'playing-card',
  imports: [NgClass],
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class Card {
  @Input() cardFrontBack!: { backUrl: string, frontUrl: string };
  @Input() cardStack!:string[];
  @Input() cardIndex!: number;
  @Input() ringStack!:string[];
  @ViewChild('cardCover') cardCover!: ElementRef<HTMLDivElement>;
  @ViewChild('cardFace') cardFace!: ElementRef<HTMLDivElement>;
  notPicked!: boolean;
  cursorOverCard!: boolean;
  takeCardAnimation!: boolean;
  cardRotates!: boolean;
  cardCoverHidden = false;
  cardFaceHidden = true;
  rotates = false;
  taken = false;
  deg = 0;


  constructor(private gameModel: GameModel, private cdr: ChangeDetectorRef) {
    console.log(this.cardStack);
    this.notPicked = gameModel.stack.length - 1 === this.cardIndex ? true : false;
  }

  takeCard() {
    if (this.cardIndex === this.gameModel.stack.length - 1) {
      if (!this.takeCardAnimation) {
        this.notPicked = false;
        this.takeCardAnimation = true;
      } else if (this.takeCardAnimation) {
        this.notPicked = true;
        this.takeCardAnimation = false;
      }
      this.cursorOverCard = false;
    }
  }

  checkIfCardRotates() {
    if (this.deg === 0) {
      this.rotateCard();
    }
  }

  rotateCard() {
    if (!this.notPicked) {
      this.deg++;
      this.cardCover.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1.1 + this.deg * 1.4 / 180})`;
      this.cardFace.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
      if (this.deg === 90) {
        if (!this.cardCoverHidden && this.cardFaceHidden) {
          this.cardCoverHidden = true;
          this.cardFaceHidden = false
          this.cdr.detectChanges();
        } else if (this.cardCoverHidden && !this.cardFaceHidden) {
          this.cardCoverHidden = false
          this.cardFaceHidden = true;
          this.cdr.detectChanges();
        }
      } else if (this.deg === 180) {
        this.notPicked = false;
        this.rotates = false;
        setTimeout(()=>{ this.removeCardFromStack(); }, 10);
        this.cdr.detectChanges();
        return;
      }
      setTimeout(() => { this.rotateCard() }, 36 / 25);
    }
  }

  removeCardFromStack() {
    this.ringStack.push(this.cardStack[this.cardIndex]);
    this.cardStack.pop();
  }

  rotateCardBackwards() {
    if (this.notPicked) {
      this.deg--;
      this.cardCover.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1 + this.deg * 1.5 / 180})`;
      this.cardFace.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
      if (this.deg === 90) {
        if (this.cardCoverHidden && !this.cardFaceHidden) {
          this.cardCoverHidden = false;
          this.cardFaceHidden = true;
          this.cdr.detectChanges();
        } else if (!this.cardCoverHidden && this.cardFaceHidden) {
          this.cardCoverHidden = true;
          this.cardFaceHidden = false;
          this.cdr.detectChanges();
        }
      } else if (this.deg === 0) {
        this.notPicked = true;
        this.rotates = false;
        this.cdr.detectChanges();

        return;
      }
      setTimeout(() => { this.rotateCardBackwards() }, 36 / 25);
    }
  }

  cardHoverEffectOn() {
    if (this.cardIndex === this.cardStack.length - 1 && !this.cursorOverCard && this.notPicked) {
      this.cursorOverCard = true;
    }
  }

  cardHoverEffectOff() {
    if (this.cardIndex === this.cardStack.length - 1 && this.cursorOverCard && this.notPicked) {
      this.cursorOverCard = false;
    }
  }
}