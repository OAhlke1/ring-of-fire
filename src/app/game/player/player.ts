import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GameModel } from '../../models/game-model';

@Component({
  selector: 'app-player',
  imports: [NgStyle],
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class Player {
  @Input() name!:string;
  @Input() backgroundColor!:string;
  mySelf!:string;
  constructor() {}
}