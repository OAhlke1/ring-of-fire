import { Component, Input } from '@angular/core';
import { Game } from '../game';
import { GameModel } from '../../models/game-model';
import { FirebaseService } from '../../models/firebase';
import { Player } from '../player/player';
import { NgClass } from '@angular/common';

@Component({
  selector: 'done-button',
  imports: [NgClass],
  templateUrl: './done-button.html',
  styleUrl: './done-button.scss'
})
export class DoneButton {
  game!: Game;
  player!:Player;
  @Input() index!: number;

  constructor(public gameModel: GameModel, public fbs: FirebaseService) { }
}