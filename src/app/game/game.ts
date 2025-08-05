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

  constructor(public gameModel: GameModel, public fbs: FirebaseService, private cdr: ChangeDetectorRef) {
  }
  
  async ngOnInit() {
    window.addEventListener('beforeunload', ()=>{ this.gameModel.removePlayer(this.gameModel.mySelf.playerIndex); });
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
    }, 750);
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
}