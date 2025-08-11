import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameModel } from '../../../models/game-model';
import { FirebaseService } from '../../../models/firebase';
import { onSnapshot, DocumentSnapshot } from "firebase/firestore";

@Component({
  selector: 'card-dummy',
  imports: [NgClass,],
  templateUrl: './card-dummy.html',
  styleUrl: './card-dummy.scss'
})
export class CardDummy {
  @ViewChild('cardCoverDummy') cardCoverDummy!: ElementRef<HTMLImageElement>;
  @ViewChild('cardFaceDummy') cardFaceDummy!: ElementRef<HTMLImageElement>;
  intervalCode!: any;
  cardIndex: number = 0;
  deg: number = 0;
  frequency: number = 25;
  cardFaceSrc: string = '';
  cursorOverCard: boolean = false;
  cardRotates: boolean = false;
  takeCardAnimation: boolean = false;
  notPicked: boolean = false;
  cardCoverHidden: boolean = false;
  cardFaceHidden: boolean = true;
  rotates: boolean = false;
  onLoad: boolean = true;

  constructor(public gameModel: GameModel, public fbs: FirebaseService) { }

  ngAfterViewInit() {
    this.setCardsSnap();
    if (this.onLoad) {
      this.onLoad = false;
      this.receiveTakenCards();
    }
  }

  async setCardsSnap() {
    onSnapshot(this.gameModel.docRefCards, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists() && this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
        this.gameModel.cardsCanBeClicked = true;
        const data = docSnap.data() as { cards: string[] };
        if (data.cards.length < this.gameModel.stack.length) {
          this.gameModel.takeNoMoreCards = false;
          if (!this.gameModel.takeNoMoreCards) {
            this.gameModel.takeNoMoreCards = true;
            this.takeCard();
          }
        }
      }
    });
  }

  clickCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive && this.gameModel.cardsCanBeClicked) {
      this.gameModel.cardsCanBeClicked = false;
      this.gameModel.takeNoMoreCards = false;
      if (!this.gameModel.takeNoMoreCards) { this.takeCard(); }
    }
  }

  async takeCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive) {
      this.gameModel.stack.splice(0, 1);
      this.cardFaceSrc = this.gameModel.stack[0];
      if (this.gameModel.mySelf.isActive) { await this.fbs.postCards(this.gameModel.stack); }
      this.gameModel.takeNoMoreCards = true;
    } else if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      this.gameModel.stack.splice(0, 1);
      this.cardFaceSrc = this.gameModel.stack[0];
    }
    this.checkIfCardRotates();
  }

  /* takeCardAutomatically() {
    if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      this.gameModel.stack.splice(0, 1);
      this.cardFaceSrc = this.gameModel.stack[0];
    }
    this.checkIfCardRotatesAutomatically();
  } */

  checkIfCardRotates() {
    this.gameModel.takeNoMoreCards = true;
    if (this.deg === 0) {
      this.rotateCard();
    } else { return; }
  }

  /* checkIfCardRotatesAutomatically() {
    if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      if (this.deg === 0) {
        this.rotateCardAutomatically();
      } else { return; }
    }
  } */

  rotateCard() {
    this.deg = 180;
    this.cardCoverDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1.1 + this.deg * 1.4 / 180})`;
    this.cardFaceDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
    this.cardCoverHidden = true;
    this.cardFaceHidden = false;
    clearInterval(this.intervalCode);
    setTimeout(() => { this.hideCardDummy(); }, 1000);
    return;
  }

  hideCardDummy() {
    this.deg = 0;
    this.cardCoverDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1.1 + this.deg * 1.4 / 180})`;
    this.cardFaceDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
    this.cardCoverHidden = false;
    this.cardFaceHidden = true;
    this.rotates = false;
    this.notPicked = false;
    this.takeCardAnimation = true;
    this.gameModel.takeNoMoreCards = true;
    setTimeout(() => { this.removeCardFromStack() }, 1000);
  }

  /* rotateCardAutomatically() {
    this.deg = 180;
    this.cardCoverDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1.1 + this.deg * 1.4 / 180})`;
    this.cardFaceDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
    this.cardCoverHidden = true;
    this.cardFaceHidden = false;
    clearInterval(this.intervalCode);
    setTimeout(() => { this.hideCardDummyAutomatically(); }, 1000);
    return;
  } */

  /* hideCardDummyAutomatically() {
    this.deg = 0;
    this.cardCoverHidden = true;
    this.cardFaceHidden = false;
    this.rotates = false;
    this.notPicked = false;
    this.takeCardAnimation = true;
    this.gameModel.takeNoMoreCards = true;
    setTimeout(() => { this.removeCardFromStackAutomatically() }, 1000);
  } */

  async removeCardFromStack() {
    clearInterval(this.intervalCode);
    this.gameModel.takenCardsArray.push(this.gameModel.stack[0]);
    this.gameModel.takeNoMoreCards = true;
    this.deg = 0;
    this.takeCardAnimation = true;
    this.rotates = false;
    this.notPicked = false;
    this.cardCoverHidden = true;
    this.cardFaceHidden = true;
    if (this.gameModel.mySelf.isActive) { await this.gameModel.postTakenCards(); }
  }

  /* async removeCardFromStackAutomatically() {
    clearInterval(this.intervalCode);
    this.gameModel.takenCardsArray.push(this.gameModel.stack[0]);
    this.gameModel.takeNoMoreCards = true;
    this.deg = 0;
    this.takeCardAnimation = true;
    this.rotates = false;
    this.notPicked = false;
    this.cardFaceHidden = true;
    this.cardCoverHidden = true;
  } */

  async receiveTakenCards() {
    const takenCards = await this.gameModel.getTakenCards();
    if (takenCards) {
      this.gameModel.ngz.run(() => {
        if (takenCards.length > 0) {
          this.gameModel.takenCardsArray = takenCards;
          this.gameModel.takenCardsArrayForRendering = takenCards;
        }
      })
    } else { this.gameModel.takenCardsArray = []; }
  }
}
