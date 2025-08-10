import { Component, signal, model, Input, inject, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { GameInfo } from '../game/game-info/game-info';
import { MatIcon } from '@angular/material/icon';
import { PlayerDialog } from '../player-dialog/player-dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { NgClass } from '@angular/common';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogRef } from '@angular/cdk/dialog';
import { FirebaseAppSettings } from 'firebase/app';
import { FirebaseService, playerObjectLiteral } from '../models/firebase';
import { GameModel } from '../models/game-model';
import { Myself } from '../shared/myself';

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

  constructor(private router: Router, public fbs: FirebaseService, public ms: Myself) { }

  async postMyself() {
    this.cards = await this.fbs.getCards();
    this.playerArray = await this.fbs.getPlayers();
    if (!this.playerArray) { this.playerArray = []; }
    if (this.cards.length < 52) { this.hideDialoge = true; }
    if (this.name() != '') {
      this.newPlayer = {
        name: this.name(),
        playerIndex: this.playerArray.length ? this.playerArray.length : 0,
        isActive: this.playerArray.length === 0 ? true : false,
        bgColor: `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${50 * Math.random()})`,
        playerId: `${this.name()[0]}${this.name()[1]}${this.name()[2]}${Math.floor(100 * Math.random())}`
      }
      this.ms.myselfObject = this.newPlayer;
      this.playerArray.push(this.newPlayer);
      await this.fbs.postPlayers(this.playerArray);
      this.router.navigateByUrl('/game');
    }
  }
}