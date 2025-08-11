import { ChangeDetectorRef, Injectable, NgZone } from '@angular/core';
import { initializeApp } from "firebase/app";
import { FirebaseService, playerObjectLiteral } from './firebase';
import { MatDialog } from '@angular/material/dialog';
import { PlayerDialog } from '../player-dialog/player-dialog';
import { getFirestore, doc, addDoc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, DocumentSnapshot, collection, arrayRemove } from "firebase/firestore";
import { Myself } from '../shared/myself';
import { Router } from '@angular/router';

const firebaseConfig = {
    apiKey: "AIzaSyD9x5VAZ4j5QuRsKz8vNQE9XHWHJ3_W2as",
    authDomain: "ring-of-fire-d9f15.firebaseapp.com",
    projectId: "ring-of-fire-d9f15",
    storageBucket: "ring-of-fire-d9f15.firebasestorage.app",
    messagingSenderId: "1018102590409",
    appId: "1:1018102590409:web:87cb1254a8ff75bfcd9618",
    measurementId: "G-GEBPK7VCTK"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

@Injectable({
    providedIn: 'root'
})
export class GameModel {
    public players: string[] = [];
    public stack: string[] = [];
    public takenCardsArray: string[] = [];
    public takenCardsArrayForRendering: string[] = [];
    public playedCardPositions: { xCoord: number, yCoord: number, angle: number, translation: string }[] = [];
    public currentPlayer: number = 0;
    public cardBackLink: string = '/assets/images/cards/card_cover.png';
    public playersArray: playerObjectLiteral[] = [];
    public onlineCount = 0;
    public loadingCards: boolean = true;
    public activePlayer!: playerObjectLiteral;
    public mySelf!: playerObjectLiteral;
    public myselfIndex: number = -1;
    public docRefPlayers = doc(db, 'game', 'players');
    public docRefCards = doc(db, 'game', 'cards');
    public docRefTakenCards = doc(db, 'game', 'taken-cards');
    public loadingPlayers: boolean = true;
    public playerId: any = localStorage['player-id'] ? localStorage.getItem('player-id') : "";
    public cardsCanBeClicked: boolean = true;
    public takeNoMoreCards: boolean = true;
    public deg = 0;
    public cardCount: number = 0;
    public showDoneButton: boolean = true;
    public hasInteracted: boolean = false;
    public reload = false;

    dialogRef!: any;
    myselfExists: boolean = false;
    playerDialog!: PlayerDialog;

    constructor(private fbs: FirebaseService, public dialog: MatDialog, public ngz: NgZone, public ms: Myself, public router: Router) {
        this.mySelf = ms.myselfObject;
        this.showDoneButton = this.ms.myselfObject.isActive ? true : false;
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
        this.showHideDoneButton();
        this.setPlayersSnap();
        // this.setTakenCardsSnap();
    }

    showHideDoneButton() {
        if (this.mySelf.isActive) {
            this.showDoneButton = true;
        } else { this.showDoneButton = false; }
    }

    async receiveCards() {
        let cards = await this.fbs.getCards();
        if (cards.length === 0) {
            for (let i = 1; i < 14; i++) {
                this.stack.push('assets/images/cards/hearts_' + `${i}.png`);
                this.stack.push('assets/images/cards/ace_' + `${i}.png`);
                this.stack.push('assets/images/cards/clubs_' + `${i}.png`);
                this.stack.push('assets/images/cards/diamonds_' + `${i}.png`);
            }
            await this.shuffleStack(this.stack);
        } else {
            // this.takenCardsArray.push(this.stack[this.stack.length-1]);
            this.stack = cards;
            this.fbs.cardStack = cards;
            this.loadingCards = false;
        }
    }

    /* setCardTakenArray(value: boolean) {
        for (let i = 0; i < this.stack.length; i++) {
            this.cardTakenArray.push(value);
        }
        this.cardTakenArray[this.cardTakenArray.length - 1] = false;
    } */

    async shuffleStack(array: string[]) {
        let currentIndex = array.length;
        while (currentIndex != 0) {
            let randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        try {
            await this.fbs.postCards(array);
            this.loadingCards = false;
        } catch (error) {
            this.loadingCards = false;
        }
        // this.setCardTakenArray(true);
    }

    setPlayerIndices() {
        for (let i = 0; i < this.playersArray.length; i++) {
            this.playersArray[i].playerIndex = i;
        }
        this.getActivePlayer();
    }

    setPlayerIndicesAtUnload() {
        for (let i = 0; i < this.playersArray.length; i++) {
            this.playersArray[i].playerIndex = i;
        }
    }

    getActivePlayer() {
        for (let i = 0; i < this.playersArray.length; i++) {
            if (this.playersArray[i].isActive) {
                this.activePlayer = this.playersArray[i];
                this.fbs.activePlayer = this.activePlayer;
            }
        }
    }

    actualizePlayers(players: playerObjectLiteral[]) {
        this.playersArray = players;
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(PlayerDialog);
        dialogRef.afterClosed().subscribe(result => {
            if (result.playerName && !this.mySelf) {
                this.playerId = `${Math.floor(100 * Math.random())}${result.playerName[0]}${result.playerName[1]}${result.playerName[2]}`;
                localStorage.setItem('player-id', this.playerId);
                let newPlayer = {
                    name: result.playerName,
                    playerIndex: this.playersArray ? this.playersArray.length : 0,
                    bgColor: `rgba(${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${Math.floor(255 * Math.random())}, ${50 * Math.random()})`,
                    isActive: this.playersArray && this.playersArray.length === 0 ? true : false,
                    playerId: this.playerId
                }
                this.playersArray.push(newPlayer);
                this.mySelf = newPlayer;
                this.myselfIndex = newPlayer.playerIndex;
                this.myselfExists = true;
                this.postPlayers(this.playersArray);
            } else if (!result || !result.classListCopy || !result.playerName) {
                return;
            }
        });
    }

    async setPlayersSnap() {
        onSnapshot(this.docRefPlayers, (docSnap: DocumentSnapshot) => {
            if (docSnap.exists()) {
                this.receivePlayers();
                return;
            } else {
                this.playersArray = [];
                return;
            }
        });
    }

    async receivePlayers() {
        const players = await this.getPlayers();
        if (players) {
            this.ngz.run(() => {
                if (players) { this.playersArray = players; }
                if (this.playersArray.length > 0) { this.setMyselfIndex(); }
                this.checkIfIAmActive();
            })
        } else { this.playersArray = []; }
        // this.takeNoMoreCards = false;
    }

    async getPlayers(): Promise<any[]> {
        return new Promise(async (res, rej) => {
            const docSnap = await getDoc(this.docRefPlayers);
            if (docSnap) {
                const data = docSnap.data() as { players: playerObjectLiteral[] };
                this.loadingPlayers = false;
                res(data.players);
            } else {
                rej(new Error('Keine anderen Saufkumpanen vorhanden'));
            }
        })
    }

    async getTakenCards(): Promise<any[]> {
        return new Promise(async (res, rej) => {
            const docSnap = await getDoc(this.docRefTakenCards);
            if (docSnap) {
                const data = docSnap.data() as { takenCards: string[] };
                res(data.takenCards);
            } else {
                rej([]);
            }
        })
    }

    async postTakenCards() {
        // if(this.stack.length + this.takenCardsArray.length > 52) { this.takenCardsArray.splice(this.takenCardsArray.length - 1, 1); }
        await updateDoc(this.docRefTakenCards, {
            takenCards: this.takenCardsArray
        })
    }

    setMyselfIndex() {
        if (this.mySelf) {
            this.myselfIndex = this.playersArray.length - 1;
        }
    }

    async postPlayers(players: any[]) {
        await updateDoc(this.docRefPlayers, {
            players: this.playersArray
        });
    }

    async removePlayer(index: number) {
        this.playersArray.splice(index, 1);
        this.setPlayerIndicesAtUnload();
        this.setNewPlayerActive();
        await this.postPlayers(this.playersArray);
        if (this.reload) { this.router.navigateByUrl('/'); }
        return;
    }

    setNewPlayerActive() {
        if (this.mySelf && this.mySelf.isActive) {
            let indexActive = 0;
            this.mySelf.isActive = false;
            this.takeNoMoreCards = false;
            for (let i = 0; i < this.playersArray.length; i++) {
                if (this.playersArray[i].isActive) {
                    indexActive = i;
                    break;
                }
            }
            let indexNewActive = indexActive + 1 === this.playersArray.length ? 0 : indexActive + 1;
            this.playersArray[indexActive].isActive = false;
            this.playersArray[indexNewActive].isActive = true;
            this.postPlayers(this.playersArray);
        }
    }

    getIndexActivePlayer(): any {
        for (let player of this.playersArray) {
            if (player.isActive) {
                return player.playerIndex;
            }
        }
    }

    checkIfIAmActive() {
        for (let player of this.playersArray) {
            if (this.playersArray[player.playerIndex].playerId === this.mySelf.playerId) {
                console.log(this.playersArray[player.playerIndex].playerId, player.playerId, player);
                this.mySelf.isActive = player.isActive;
                if (this.mySelf.isActive) {
                    this.cardsCanBeClicked = true;
                    this.showDoneButton = true;
                } else {
                    this.mySelf.isActive = false;
                    this.showDoneButton = false;
                }
            }
        }
    }
}