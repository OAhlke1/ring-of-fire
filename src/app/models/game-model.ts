import { ChangeDetectorRef, Injectable } from '@angular/core';
import { FirebaseService, playerObjectLiteral } from './firebase';
import { Player } from '../game/player/player';

@Injectable({
    providedIn: 'root'
})
export class GameModel {
    public players: string[] = [];
    public stack: string[] = [];
    public ringStack: any[] = [];
    public playedCardPositions: { xCoord: number, yCoord: number, angle: number, translation: string }[] = [];
    public currentPlayer: number = 0;
    public cardBackLink: string = '/assets/images/cards/card_cover.png';
    public playersArray!:playerObjectLiteral[];
    public onlineCount = 0;
    public loadingCards: boolean = true;
    public activePlayer!:playerObjectLiteral;
    public mySelf!:playerObjectLiteral;

    constructor(private fbs: FirebaseService) {
        for (let i = 0; i < 52; i++) {
            if (i % 8 === 0) {
                this.playedCardPositions.push({
                    xCoord: 40,
                    yCoord: 25,
                    angle: 45,
                    translation: `-100%, -50%`
                })
            } else if (i % 8 === 1) {
                this.playedCardPositions.push({
                    xCoord: 60,
                    yCoord: 25,
                    angle: -45,
                    translation: `0%, -50%`
                })
            } else if (i % 8 === 2) {
                this.playedCardPositions.push({
                    xCoord: 60,
                    yCoord: 75,
                    angle: 45,
                    translation: `0%, -50%`
                })
            } else if (i % 8 === 3) {
                this.playedCardPositions.push({
                    xCoord: 40,
                    yCoord: 75,
                    angle: -45,
                    translation: `-100%, -50%`
                })
            } else if (i % 8 === 4) {
                this.playedCardPositions.push({
                    xCoord: 50,
                    yCoord: 25,
                    angle: 90,
                    translation: `-50%, -75%`
                })
            } else if (i % 8 === 5) {
                this.playedCardPositions.push({
                    xCoord: 60,
                    yCoord: 50,
                    angle: 0,
                    translation: `0%, -50%`
                })
            } else if (i % 8 === 6) {
                this.playedCardPositions.push({
                    xCoord: 50,
                    yCoord: 75,
                    angle: 90,
                    translation: `-50%, -25%`
                })
            } else if (i % 8 === 7) {
                this.playedCardPositions.push({
                    xCoord: 40,
                    yCoord: 50,
                    angle: 0,
                    translation: `-100%, -50%`
                })
            }
        }
        this.fbs.getPlayers();
        this.listenToPlayers();
    }

    async getCards() {
        let cards = await this.fbs.getCards();
        if (cards.length === 0) {
            console.log('new cards');
            for (let i = 1; i < 14; i++) {
                this.stack.push('assets/images/cards/hearts_' + `${i}.png`);
                this.stack.push('assets/images/cards/ace_' + `${i}.png`);
                this.stack.push('assets/images/cards/clubs_' + `${i}.png`);
                this.stack.push('assets/images/cards/diamonds_' + `${i}.png`);
            }
            await this.shuffleStack(this.stack);
        }else {
            this.stack = cards;
            this.fbs.cardStack = cards;
            this.loadingCards = false;
        }
    }

    async shuffleStack(array: string[]) {
        let currentIndex = array.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [
                array[randomIndex], array[currentIndex]];
        }
        try {
            await this.fbs.postCards(array);
            this.loadingCards = false;
        } catch (error) {
            console.error('Fehler beim Posten der Karten:', error);
            this.loadingCards = false;
        }
    }

    listenToPlayers() {
        this.fbs.listenToPlayers((players: any[]) => {
            this.playersArray = [...players];
            this.countOnline();
        });
    }

    countOnline() {
        for (let player of this.playersArray) {
            if (player.onlineStatus) { this.onlineCount++; }
        }
        this.getActivePlayer();
    }

    getActivePlayer() {
        for(let i=0; i<this.playersArray.length; i++) {
            if(this.playersArray[i].isActive) {
                this.activePlayer = this.playersArray[i];
                this.fbs.activePlayer = this.activePlayer;
            }
        }
    }

    actualizePlayers(players: playerObjectLiteral[]) {
        this.playersArray = players;
    }
}