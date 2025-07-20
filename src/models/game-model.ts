import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GameModel {
    public players: string[] = [];
    public stack:string[] = [];
    public ringStack:any[] = [];
    public plyedCard:string[] = [];
    public currentPlayer:number = 0;
    public cardBackLink:string = '/assets/images/cards/card_cover.png';

    constructor() {
        for(let i=1; i<14; i++){
            this.stack.push('assets/images/cards/hearts_'+`${i}.png`);
            this.stack.push('assets/images/cards/ace_'+`${i}.png`);
            this.stack.push('assets/images/cards/clubs_'+`${i}.png`);
            this.stack.push('assets/images/cards/diamonds_'+`${i}.png`);
        }
    }
}