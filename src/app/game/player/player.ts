import { NgStyle, CommonModule } from '@angular/common';
import { initializeApp } from "firebase/app";
import { Component, Input } from '@angular/core';
import { GameModel } from '../../models/game-model';
import { FirebaseService } from '../../models/firebase';
import { onSnapshot, DocumentSnapshot, updateDoc, doc, getFirestore, } from "firebase/firestore";

@Component({
  selector: 'app-player',
  imports: [NgStyle],
  templateUrl: './player.html',
  styleUrl: './player.scss'
})
export class Player {
  @Input() name!: string;
  @Input() backgroundColor!: string;
  @Input() doneButtonIndex!: number;
  mySelf!: string;
  constructor(public fbs: FirebaseService, public gameModel: GameModel) { }

  /* async getPlayers(): Promise<any[]> {
    const docSnap = await getDoc(this.docRefPlayers);
    if (docSnap.exists()) {
      const data = docSnap.data() as { players: any[] };
      this.loadingPlayers = false;
      return data.players ?? [];
    } else {
      return [];
    }
  } */

  /* receivePlayers(players: any[]) {
    console.log('receive players');
    this.gameModel.playersArray = players;
  } */
}