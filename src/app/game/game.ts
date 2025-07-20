import { Component, OnInit } from '@angular/core';
// import { GameService } from '../shared/services/game-service';
import { Card } from './card/card';
import { NgStyle, NgClass } from '@angular/common';
import { GameModel } from '../../models/game-model';
import { TakenCards } from './taken-cards/taken-cards';

@Component({
  standalone: true,
  selector: 'app-game',
  imports: [NgClass, NgStyle, Card, TakenCards],
  templateUrl: './game.html',
  styleUrls: ['./game.scss']
})
export class Game implements OnInit {
  gameModel!: GameModel;
  cardPicked!: boolean;
  currentCard!:string;

  constructor() { }

  ngOnInit(): void {
    this.newGame();
  }



  newGame() {
    this.gameModel = new GameModel();
    this.shuffleStack(this.gameModel.stack);
    console.log(this.gameModel.stack);
  }

  shuffleStack(array: {}[]) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  }
}