import { Component, NgModule, NgZone } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { GameModel } from '../../models/game-model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'game-info',
  imports: [MatButtonModule, MatInputModule, MatInputModule, FormsModule],
  templateUrl: './game-info.html',
  styleUrl: './game-info.scss'
})
export class GameInfo {
  cardRule: any = "";

  constructor(public gameModel: GameModel, private ngZone: NgZone) { }
}
