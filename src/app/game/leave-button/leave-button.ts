import { Component } from '@angular/core';
import { GameModel } from '../../models/game-model';
import { FirebaseService } from '../../models/firebase';
import { Router } from '@angular/router';

@Component({
  selector: 'leave-button',
  imports: [],
  templateUrl: './leave-button.html',
  styleUrl: './leave-button.scss'
})
export class LeaveButton {
  constructor(public gameModel:GameModel, public fbs:FirebaseService, public router:Router) { }

  removeMyself() {
    console.log('leave game!');
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
