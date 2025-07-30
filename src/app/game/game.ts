import { FirebaseService, playerObjectLiteral } from '../models/firebase';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Card } from './card/card';
import { NgStyle, NgClass, CommonModule } from '@angular/common';
import { GameModel } from '../models/game-model';
import { TakenCards } from './taken-cards/taken-cards';
import { Player } from './player/player';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PlayerDialog } from '../player-dialog/player-dialog';
import { MatCardModule } from '@angular/material/card';
import { GameInfo } from "./game-info/game-info";

@Component({
  standalone: true,
  selector: 'app-game',
  imports: [NgClass, NgStyle, CommonModule, Player, Card, Player, TakenCards, MatButtonModule, MatIconModule, MatCardModule, GameInfo],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game implements OnInit {
  cardPicked!: boolean;
  currentCard!: string;
  playersShown = false;
  playersHidden = false;
  playersShownAtFirstTime = true;
  dialogRef!: any;
  changeIntervalId!: any;
  player!:Player;
  myselfExists:boolean = false;

  constructor(public gameModel: GameModel, public fbs: FirebaseService, public dialog: MatDialog, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.newGame();
    this.changeDetection();
  }

  ngOnDestroy() {
    clearInterval(this.changeIntervalId);
    // this.fbs.postCards([]);
    this.fbs.postPlayers([]);
  }

  changeDetection() {
    console.log('cdr');
    this.changeIntervalId = setInterval(()=>{
      this.cdr.detectChanges();
    }, 750);
  }

  newGame() {
    this.gameModel.getCards();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(PlayerDialog);

    dialogRef.afterClosed().subscribe(result => {
      if (result.playerName && !this.gameModel.mySelf) {
        let newPlayer:playerObjectLiteral = {
          name: result.playerName,
          onlineStatus: true,
          bgColor: `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${50 * Math.random()})`,
          isActive: false
        }
        this.gameModel.playersArray.push(newPlayer);
        if(!this.gameModel.mySelf) { this.gameModel.mySelf = newPlayer; }
        // this.cdr.detectChanges();
        this.fbs.postNewPlayer(newPlayer);
        if(this.gameModel.mySelf) { this.myselfExists = true; }
      } else if (!result || !result.classListCopy || !result.playerName) {
        return;
      }
    });
  }

  setActive(index: number) {
    for (let i = 0; i < this.gameModel.playersArray.length; i++) {
      this.gameModel.playersArray[i].isActive = false;
    }
    this.gameModel.playersArray[index].isActive = true;
    this.gameModel.activePlayer = this.gameModel.playersArray[index];
    console.log(this.gameModel.activePlayer.name, this.gameModel.mySelf.name);
    let players:playerObjectLiteral[] = this.gameModel.playersArray;
    this.fbs.postPlayers(players);
  }
}