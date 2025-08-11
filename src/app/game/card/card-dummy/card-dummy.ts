import { NgClass } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { GameModel } from '../../../models/game-model';
import { FirebaseService } from '../../../models/firebase';
import { getFirestore, doc, addDoc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, DocumentSnapshot, collection, arrayRemove } from "firebase/firestore";

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

  constructor(public gameModel: GameModel, public fbs: FirebaseService) { }

  ngAfterViewInit() {
    this.setCardsSnap();
    this.receiveTakenCards();
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
            this.gameModel.takeNoMoreCards = true;
            this.takeCardAutomatically();
          }
        }
      }
    });
  }

  clickCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive && this.gameModel.cardsCanBeClicked) {
      this.gameModel.cardsCanBeClicked = false;
      this.gameModel.takeNoMoreCards = false;
      if (!this.gameModel.takeNoMoreCards) {
        this.takeCard();
      }
    }
  }

  async takeCard() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive) {
      this.cardFaceSrc = this.gameModel.stack[0];
      this.gameModel.stack.splice(0, 1);
      await this.fbs.postCards(this.gameModel.stack);
      this.gameModel.takeNoMoreCards = true;
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
    this.checkIfCardRotates();
  }

  checkIfCardRotates() {
    if (this.gameModel.mySelf && this.gameModel.mySelf.isActive) {
      this.gameModel.takeNoMoreCards = true;
      if (this.deg === 0) {
        this.intervalCode = setInterval(() => { this.rotateCard() }, this.frequency);
      } else { return; }
    }
  }

  takeCardAutomatically() {
    if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      this.cardFaceSrc = this.gameModel.stack[0];
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
    this.checkIfCardRotatesAutomatically();
  }

  checkIfCardRotatesAutomatically() {
    if (this.gameModel.mySelf && !this.gameModel.mySelf.isActive) {
      if (this.deg === 0) {
        this.intervalCode = setInterval(() => { this.rotateCardAutomatically() }, this.frequency);
      } else { return; }
    }
  }

  rotateCard() {
    this.deg++;
    this.cardCoverDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1.1 + this.deg * 1.4 / 180})`;
    this.cardFaceDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
    if (this.deg === 90) {
      /* if (!this.cardCoverHidden && this.cardFaceHidden) {
        this.cardCoverHidden = true;
        this.cardFaceHidden = false;
      } else if (this.cardCoverHidden && !this.cardFaceHidden) {
        this.cardCoverHidden = false;
        this.cardFaceHidden = true;
      } */
      this.cardCoverHidden = true;
      this.cardFaceHidden = false;
    } else if (this.deg === 180) {
      clearInterval(this.intervalCode);
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
      return;
    }
  }

  rotateCardAutomatically() {
    this.deg++;
    this.cardCoverDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${1.1 + this.deg * 1.4 / 180})`;
    this.cardFaceDummy.nativeElement.style.transform = `rotateY(${this.deg}deg) scale(${-(1 + this.deg * 1.5 / 180)}, ${1 + this.deg * 1.5 / 180})`;
    if (this.deg === 90) {
      if (!this.cardCoverHidden && this.cardFaceHidden) {
        this.cardCoverHidden = true;
        this.cardFaceHidden = false;
      } else if (this.cardCoverHidden && !this.cardFaceHidden) {
        this.cardCoverHidden = false;
        this.cardFaceHidden = true;
      }
    } else if (this.deg === 180) {
      clearInterval(this.intervalCode);
      this.deg = 0;
      this.cardCoverHidden = true;
      this.cardFaceHidden = false;
      this.rotates = false;
      this.notPicked = false;
      this.takeCardAnimation = true;
      this.gameModel.takeNoMoreCards = true;
      setTimeout(() => { this.removeCardFromStackAutomatically() }, 1000);
      return;
    }
  }

  async removeCardFromStack() {
    this.gameModel.takenCardsArray.push(this.gameModel.stack[0]);
    this.gameModel.takeNoMoreCards = true;
    this.cardFaceHidden = true;
    this.deg = 0;
    this.takeCardAnimation = true;
    this.rotates = false;
    this.notPicked = false;
    this.cardCoverHidden = true;
    this.cardFaceHidden = true;
    // await this.fbs.postCards(this.gameModel.stack);
    await this.gameModel.postTakenCards();
  }

  async removeCardFromStackAutomatically() {
    clearInterval(this.intervalCode);
    this.gameModel.takenCardsArray.push(this.gameModel.stack[0]);
    this.gameModel.stack.splice(0, 1);
    this.gameModel.takeNoMoreCards = true;
    this.deg = 0;
    this.takeCardAnimation = true;
    this.rotates = false;
    this.notPicked = false;
    this.cardCoverHidden = true;
    this.cardFaceHidden = true;
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
    // this.takeNoMoreCards = false;
  }

  /* async setTakenCardsSnap() {
    onSnapshot(this.gameModel.docRefTakenCards, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        this.receiveTakenCards();
        return;
      } else {
        this.gameModel.takenCardsArray = [];
        return;
      }
    });
  } */
}
