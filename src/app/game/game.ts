import { FirebaseService, playerObjectLiteral } from '../models/firebase';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Card } from './card/card';
import { NgStyle, NgClass, CommonModule } from '@angular/common';
import { GameModel } from '../models/game-model';
import { TakenCards } from './taken-cards/taken-cards';
import { Player } from './player/player';
import { MatCardModule } from '@angular/material/card';
import { GameInfo } from "./game-info/game-info";
import { DoneButton } from './done-button/done-button';
import { MatIcon } from '@angular/material/icon';
import { getFirestore, doc, addDoc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, DocumentSnapshot, collection, arrayRemove } from "firebase/firestore";

@Component({
  standalone: true,
  selector: 'app-game',
  imports: [NgClass, NgStyle, CommonModule, Card, Player, TakenCards, MatCardModule, MatIcon, GameInfo, DoneButton],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game implements OnInit {
  cardPicked!: boolean;
  currentCard!: string;
  playersShown = false;
  playersHidden = false;
  playersShownAtFirstTime = true;
  changeIntervalId!: any;
  player!:Player;
  doneButton!:DoneButton;
  card!: Card;

  constructor(public gameModel: GameModel, public fbs: FirebaseService, private cdr: ChangeDetectorRef) {
    // this.setCardsSnap();
  }
  
  async ngOnInit() {
    window.addEventListener('beforeunload', ()=>{ this.gameModel.removePlayer(this.gameModel.mySelf.playerIndex); });
    window.addEventListener('reload', ()=>{ this.gameModel.postPlayers([]); });
    window.addEventListener('reload', ()=>{ this.fbs.postCards([]); });
    await this.gameModel.receivePlayers();
    await this.gameModel.receiveCards();
    this.changeDetection();
  }

  ngOnDestroy() {
    clearInterval(this.changeIntervalId);
    this.fbs.postCards([]);
  }

  changeDetection() {
    this.changeIntervalId = setInterval(()=>{
      this.cdr.detectChanges();
    }, 10);
  }

  showHidePlayers() {
    if (this.playersShown && !this.playersHidden) {
      this.playersShown = false;
      this.playersHidden = true;
    } else if (this.playersHidden && !this.playersShown) {
      this.playersShown = true;
      this.playersHidden = false;
    } else if (this.playersShownAtFirstTime) {
      this.playersShownAtFirstTime = false;
      this.playersHidden = true;
    }
  }

  async setCardsSnap() {
    onSnapshot(this.gameModel.docRefCards, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists() && this.gameModel.mySelf && !this.gameModel.mySelf.isActive && !this.gameModel.takeNoMoreCards) {
        console.log('card-snap:', this.gameModel.takeNoMoreCards);
        const data = docSnap.data() as { cards: string[] };
        const lastCardFromStack: NodeListOf<HTMLElement> = document.querySelectorAll<HTMLElement>('playing-card .card-cont-inner');
        this.card.takeCardAutomatically();
        this.card.checkIfCardRotatesAutomatically();
      }
    });
  }
}