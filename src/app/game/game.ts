import { FirebaseService } from '../models/firebase';
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
import { CardDummy } from './card/card-dummy/card-dummy';
import { Router } from '@angular/router';
import { LeaveButton } from './leave-button/leave-button';

@Component({
  standalone: true,
  selector: 'app-game',
  imports: [NgClass, NgStyle, CommonModule, Card, Player, TakenCards, MatCardModule, MatIcon, GameInfo, DoneButton, CardDummy],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game implements OnInit {
  currentCard!: string;
  playersShown = false;
  playersHidden = false;
  playersShownAtFirstTime = true;
  cardPicked!: boolean;
  reloading: boolean = false;
  changeIntervalId!: any;
  player!: Player;
  doneButton!: DoneButton;
  card!: Card;
  leave!: LeaveButton;

  constructor(public router: Router, public gameModel: GameModel, public fbs: FirebaseService, private cdr: ChangeDetectorRef) { }

  async ngOnInit() {
    // window.addEventListener('beforeunload', () => { this.leaveGame(); });
    // window.addEventListener('reload', () => { this.reloadPage(); });
    await this.gameModel.receivePlayers();
    await this.gameModel.receiveCards();
    if (localStorage.getItem('myId')) {
      this.setExistingMyself();
    } else { this.router.navigateByUrl("start"); }
    this.changeDetection();
  }

  setExistingMyself() {
    for (let player of this.gameModel.playersArray) {
      if (player.playerId === localStorage.getItem('myId')) {
        this.gameModel.mySelf = player;
        this.gameModel.playerId = player.playerId;
        break;
      }
    }
  }

  reloadPage() {
    this.gameModel.reload = true;
    // this.removeMyself(this.gameModel.mySelf.playerId);
    localStorage.removeItem('myId');
  }

  /* async removeMyself(id:string) {
    const index = this.gameModel.playersArray.findIndex((player)=> id === player.playerId);
    this.gameModel.playersArray.splice(index, 1);
    this.gameModel.setPlayerIndicesAtUnload();
    this.gameModel.setNextPlayerActive();
    await this.gameModel.postPlayers(this.gameModel.playersArray);
    if (this.gameModel.reload) { this.router.navigateByUrl("start"); }
    return;
  } */

  ngOnDestroy() {
    clearInterval(this.changeIntervalId);
    this.fbs.postCards([]);
  }

  changeDetection() {
    this.changeIntervalId = setInterval(() => {
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

  removeMyself() {
    if(this.gameModel.mySelf.isActive) { this.gameModel.setNextPlayerActive(); }
    this.gameModel.playersArray.splice(this.gameModel.mySelf.playerIndex, 1);
    this.resetPlayerIndices();
    localStorage.removeItem('myId');
    this.gameModel.postPlayers(this.gameModel.playersArray);
    this.router.navigateByUrl("start");
  }

  resetPlayerIndices() {
    for(let i=0; i<this.gameModel.playersArray.length; i++) {
      this.gameModel.playersArray[i].playerIndex = i;
    }
  }
}