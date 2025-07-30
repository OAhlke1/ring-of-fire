import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { GameModel } from '../../models/game-model';
import { FirebaseService } from '../../models/firebase';
import { Player } from '../player/player';


@Component({
  standalone: true,
  selector: 'playing-card',
  imports: [NgClass, Player],
  templateUrl: './card.html',
  styleUrls: ['./card.scss']
})
export class Card {
  @Input() cardFrontBack!: { backUrl: string, frontUrl: string };
  @Input() cardStack!: string[];
  @Input() cardIndex!: number;
  @Input() ringStack!: string[];
  @Input() cardPositions!: { xCoord: number, yCoord: number, angle: number }[];
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
  frequency = 1;
  intervalCode: any = 0;
  player!: Player;


  constructor(private gameModel: GameModel, private fbs: FirebaseService, private cdr: ChangeDetectorRef) {
    this.notPicked = gameModel.stack.length - 1 === this.cardIndex ? true : false;
  }

  takeCard() {
    if (this.gameModel.activePlayer.name === this.gameModel.mySelf.name) {
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
  }

  checkIfCardRotates() {
    if (this.gameModel.activePlayer.name === this.gameModel.mySelf.name) {
      if (this.deg === 0) {
        this.intervalCode = setInterval(() => { this.rotateCard() }, this.frequency);
      }
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
        this.cdr.detectChanges();
        clearInterval(this.intervalCode);
        setTimeout(() => { this.removeCardFromStack(); }, 10);
        return;
      }
    }
  }

  removeCardFromStack() {
    this.ringStack.push(this.cardStack[this.cardIndex]);
    this.cardStack.pop();
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