import { Component, Input, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { GameModel } from '../../models/game-model';
import { FirebaseService } from '../../models/firebase';
import { Player } from '../player/player';
import { getFirestore, doc, addDoc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, DocumentSnapshot, collection, arrayRemove } from "firebase/firestore";


@Component({
  standalone: true,
  selector: 'playing-card',
  imports: [NgClass],
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
  frequency = 1;
  intervalCode: any = 0;
  player!: Player;


  constructor(public gameModel: GameModel, private fbs: FirebaseService, public cdr: ChangeDetectorRef) {
    this.notPicked = gameModel.stack.length - 1 === this.cardIndex ? true : false;
    this.setCardsSnap();
  }

  clickCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive && this.gameModel.cardsCanBeClicked) {
      this.gameModel.cardsCanBeClicked = false;
      // this.gameModel.cardsCanBeClicked = false;
      this.gameModel.takeNoMoreCards = false;
      if (!this.gameModel.takeNoMoreCards) {
        this.takeCard();
        this.checkIfCardRotates();
      }
    }
  }

  takeCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive) {
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
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive) {
      this.gameModel.takeNoMoreCards = true;
      if (this.gameModel.deg === 0) {
        this.intervalCode = setInterval(() => { this.rotateCard() }, this.frequency);
      }
    }
  }

  async setCardsSnap() {
    onSnapshot(this.gameModel.docRefCards, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists() && this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
        this.gameModel.deg = 0;
        clearInterval(this.intervalCode);
        this.gameModel.cardsCanBeClicked = true;
        // const data = docSnap.data() as { cards: string[] };
        // this.gameModel.stack = data.cards;
        const lastCardFromStack: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('playing-card .card-cont-inner');
        if (!this.gameModel.takeNoMoreCards) {
          this.gameModel.takeNoMoreCards = true;
          this.takeCardAutomatically();
          this.checkIfCardRotatesAutomatically();
        }
      }
    });
  }

  takeCardAutomatically() {
    if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
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

  checkIfCardRotatesAutomatically() {
    if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      clearInterval(this.intervalCode);
      if (this.gameModel.deg === 0) {
        this.intervalCode = setInterval(() => { this.rotateCardAutomatically() }, this.frequency);
      }
    }
  }

  rotateCard() {
    this.gameModel.deg++;
    this.cardCover.nativeElement.style.transform = `rotateY(${this.gameModel.deg}deg) scale(${1.1 + this.gameModel.deg * 1.4 / 180})`;
    this.cardFace.nativeElement.style.transform = `rotateY(${this.gameModel.deg}deg) scale(${-(1 + this.gameModel.deg * 1.5 / 180)}, ${1 + this.gameModel.deg * 1.5 / 180})`;
    if (this.gameModel.deg === 90) {
      if (!this.cardCoverHidden && this.cardFaceHidden) {
        this.cardCoverHidden = true;
        this.cardFaceHidden = false;
      } else if (this.cardCoverHidden && !this.cardFaceHidden) {
        this.cardCoverHidden = false;
        this.cardFaceHidden = true;
      }
      /* this.cardCoverHidden = true;
      this.cardFaceHidden = false; */
    } else if (this.gameModel.deg === 180) {
      clearInterval(this.intervalCode);
      this.gameModel.deg = 0;
      this.cardCoverHidden = true;
      this.cardFaceHidden = true;
      this.rotates = false;
      this.notPicked = false;
      this.takeCardAnimation = true;
      this.gameModel.takeNoMoreCards = true;
      this.removeCardFromStack();
      return;
    }
  }

  rotateCardAutomatically() {
    this.gameModel.deg++;
    this.cardCover.nativeElement.style.transform = `rotateY(${this.gameModel.deg}deg) scale(${1.1 + this.gameModel.deg * 1.4 / 180})`;
    this.cardFace.nativeElement.style.transform = `rotateY(${this.gameModel.deg}deg) scale(${-(1 + this.gameModel.deg * 1.5 / 180)}, ${1 + this.gameModel.deg * 1.5 / 180})`;
    if (this.gameModel.deg === 90) {
      if (!this.cardCoverHidden && this.cardFaceHidden) {
        this.cardCoverHidden = true;
        this.cardFaceHidden = false;
      } else if (this.cardCoverHidden && !this.cardFaceHidden) {
        this.cardCoverHidden = false;
        this.cardFaceHidden = true;
      }
      /* this.cardCoverHidden = true;
      this.cardFaceHidden = false; */
    } else if (this.gameModel.deg === 180) {
      clearInterval(this.intervalCode);
      this.gameModel.deg = 0;
      this.cardCoverHidden = true;
      this.cardFaceHidden = true;
      this.rotates = false;
      this.notPicked = false;
      this.takeCardAnimation = true;
      this.gameModel.takeNoMoreCards = true;
      this.removeCardFromStackAutomatically();
      return;
    }
  }

  async removeCardFromStack() {
    clearInterval(this.intervalCode);
    this.gameModel.ringStack.push(this.gameModel.stack[0]);
    this.gameModel.stack.splice(0, 1);
    this.gameModel.takeNoMoreCards = true;
    this.cardFaceHidden = true;
    this.gameModel.deg = 0;
    this.takeCardAnimation = true;
    this.rotates = false;
    this.notPicked = false;
    this.cardCoverHidden = true;
    this.cardFaceHidden = true;
    await this.fbs.postCards(this.gameModel.stack);
  }

  async removeCardFromStackAutomatically() {
    clearInterval(this.intervalCode);
    this.gameModel.ringStack.push(this.gameModel.stack[0]);
    this.gameModel.stack.splice(0, 1);
    this.gameModel.takeNoMoreCards = true;
    this.cardFaceHidden = true;
    this.gameModel.deg = 0;
    this.takeCardAnimation = true;
    this.rotates = false;
    this.notPicked = false;
    this.cardCoverHidden = true;
    this.cardFaceHidden = true;
  }

  cardHoverEffectOn() {
    if (this.cardIndex === this.gameModel.stack.length - 1 && !this.cursorOverCard && this.notPicked) {
      this.cursorOverCard = true;
    }
  }

  cardHoverEffectOff() {
    if (this.cardIndex === this.gameModel.stack.length - 1 && this.cursorOverCard && this.notPicked) {
      this.cursorOverCard = false;
    }
  }
}