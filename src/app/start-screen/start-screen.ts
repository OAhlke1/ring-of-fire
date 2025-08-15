import { Component, signal, model } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfo } from '../game/game-info/game-info';
import { PlayerDialog } from '../player-dialog/player-dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { FirebaseService, playerObjectLiteral } from '../models/firebase';
import { Myself } from '../shared/myself';
import { getFirestore, doc, onSnapshot, DocumentSnapshot } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD9x5VAZ4j5QuRsKz8vNQE9XHWHJ3_W2as",
  authDomain: "ring-of-fire-d9f15.firebaseapp.com",
  projectId: "ring-of-fire-d9f15",
  storageBucket: "ring-of-fire-d9f15.firebasestorage.app",
  messagingSenderId: "1018102590409",
  appId: "1:1018102590409:web:87cb1254a8ff75bfcd9618",
  measurementId: "G-GEBPK7VCTK"
};
import { initializeApp } from "firebase/app";
import { GameModel } from '../models/game-model';

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Component({
  standalone: true,
  selector: 'start-screen',
  imports: [MatFormField, MatInput, MatLabel, FormsModule, NgClass],
  templateUrl: './start-screen.html',
  styleUrls: ['./start-screen.scss']
})
export class StartScreenComponent {
  gameInfo!: GameInfo;
  playerDialog!: PlayerDialog;
  target!: HTMLElement;
  name = model('');
  inputValue = signal('');
  newPlayer!: playerObjectLiteral;
  playerArray: playerObjectLiteral[] = [];
  cards: string[] = [];
  hideDialoge: boolean = false;
  nameAlreadyExists: boolean = false;
  docRefCards = doc(db, 'game', 'cards');
  docRefPlayers = doc(db, 'game', 'players');

  constructor(private router: Router, public fbs: FirebaseService, public ms: Myself) { }

  async ngOnInit() {
    this.playerArray = await this.fbs.getPlayers();
    if(localStorage.getItem('myId')) {
      // this.gameModel.playerId = localStorage.getItem('myId');
      if(this.playerArray.length) { this.recreateMyself(); }
      this.router.navigateByUrl("game");
      return;
    }
  }

  recreateMyself() {
    for(let i=0; i<this.playerArray.length; i++) {
      if(this.playerArray[i].playerId === localStorage.getItem('myId')) {
        this.ms.myselfObject = this.playerArray[i];
        break;
      }
    }
  }

  async postMyself() {
    this.cards = await this.fbs.getCards();
    this.playerArray = await this.fbs.getPlayers();
    if (!this.playerArray) { this.playerArray = []; }
    if (this.cards.length < 52) { this.hideDialoge = true; }
    if (this.name() != '') {
      this.nameExistsAlready();
      if (!this.nameAlreadyExists) {
        this.whenNameDoesNotExistYet();
      } else if (this.nameAlreadyExists) { return; }
    }
  }

  getNewMySelf(): playerObjectLiteral {
    return {
      name: this.name(),
      playerIndex: this.playerArray.length ? this.playerArray.length : 0,
      isActive: this.playerArray.length === 0 ? true : false,
      bgColor: `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${50 * Math.random()})`,
      playerId: `${this.name()[0]}${this.name()[1]}${this.name()[2]}${Math.floor(100 * Math.random())}`
    }
  }

  async whenNameDoesNotExistYet() {
    this.newPlayer = this.getNewMySelf();
    localStorage.setItem('myId', this.newPlayer.playerId);
    this.ms.myselfObject = this.newPlayer;
    this.playerArray.push(this.newPlayer);
    await this.fbs.postPlayers(this.playerArray);
    this.router.navigateByUrl('/game');
  }

  async setCardsSnap() {
    onSnapshot(this.docRefCards, (docSnap: DocumentSnapshot) => {
      const data = docSnap.data() as { cards: string[] };
      if (data.cards.length < this.cards.length) {
        this.cards = data.cards;
      }
    })
  }

  async setPlayersSnap() {
    onSnapshot(this.docRefPlayers, (docSnap: DocumentSnapshot) => {
      const data = docSnap.data() as { players: playerObjectLiteral[] };
      if (data.players.length < this.cards.length) {
        this.playerArray = data.players;
      }
    })
  }

  nameExistsAlready(): any {
    for (let i = 0; i < this.playerArray.length; i++) {
      if (this.playerArray[i].name === this.name()) {
        this.nameAlreadyExists = true;
      } else if (this.playerArray[i].name !== this.name()) {
        if (i === this.playerArray.length - 1) { this.nameAlreadyExists = false; }
      }
    }
  }
}