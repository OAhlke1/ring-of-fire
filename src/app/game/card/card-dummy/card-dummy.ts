import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameModel } from '../../../models/game-model';
import { FirebaseService } from '../../../models/firebase';
import { onSnapshot, DocumentSnapshot } from "firebase/firestore";
import { GameInfo } from '../../game-info/game-info';

@Component({
  selector: 'card-dummy',
  imports: [NgClass, GameInfo],
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
  cursorOverCard: boolean = false;
  cardRotates: boolean = false;
  takeCardAnimation: boolean = false;
  notPicked: boolean = false;
  cardCoverHidden: boolean = false;
  cardFaceHidden: boolean = true;
  rotates: boolean = false;
  onLoad: boolean = true;
  gameInfo!: GameInfo;

  constructor(public gameModel: GameModel, public fbs: FirebaseService) { }

  ngAfterViewInit() {
    this.setCardsSnap();
    if (this.onLoad) {
      this.onLoad = true;
      this.receiveTakenCards();
    }
    this.gameModel.updateRule();
  }

  async setCardsSnap() {
    onSnapshot(this.gameModel.docRefCards, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists() && this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
        this.gameModel.cardsCanBeClicked = true;
        const data = docSnap.data() as { cards: string[] };
        if (data.cards.length < this.gameModel.stack.length) {
          this.gameModel.takeNoMoreCards = false;
          if (!this.gameModel.takeNoMoreCards && !this.onLoad) {
            this.gameModel.takeNoMoreCards = true;
            this.takeCard();
          }
        }
      }
    });
  }

  clickCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive && this.gameModel.cardsCanBeClicked) {
      this.onLoad = false;
      this.gameModel.cardsCanBeClicked = false;
      this.gameModel.takeNoMoreCards = false;
      if (!this.gameModel.takeNoMoreCards) { this.takeCard(); }
    }
  }

  async takeCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive) {
      this.gameModel.stack.splice(0, 1);
      this.gameModel.cardFaceSrc = this.gameModel.stack[0];
      this.gameModel.updateRule();
      if (this.gameModel.mySelf.isActive) { await this.fbs.postCards(this.gameModel.stack); }
      this.gameModel.takeNoMoreCards = true;
    } else if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      this.gameModel.stack.splice(0, 1);
      this.gameModel.cardFaceSrc = this.gameModel.stack[0];
    }
    this.checkIfCardRotates();
  }

  checkIfCardRotates() {
    this.gameModel.takeNoMoreCards = true;
    if (this.deg === 0) {
      this.rotateCard();
    } else { return; }
  }

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
    if (this.gameModel.mySelf.isActive) {
      this.gameModel.showDoneButton = true;
      await this.gameModel.postTakenCards();
    }
  }

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
