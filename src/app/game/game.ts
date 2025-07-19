import { Component } from '@angular/core';
import { GameService } from '../shared/services/game-service';
import { Card } from './card/card';
import { NgStyle, NgClass, NgFor } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-game',
  imports: [ NgClass, NgStyle, NgFor, Card ],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game {
  cardPicked!:boolean;
  
  constructor(public gameService:GameService) {}
}