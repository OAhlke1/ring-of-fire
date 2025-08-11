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