// firebase.ts
import { ChangeDetectorRef, Injectable } from "@angular/core";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, addDoc, getDoc, setDoc, updateDoc, arrayUnion, onSnapshot, DocumentSnapshot, collection, arrayRemove } from "firebase/firestore";
import { GameModel } from "./game-model";
import { Game } from "../game/game";
import { Player } from "../game/player/player";
import { Card } from "../game/card/card";

// Firebase Konfiguration
const firebaseConfig = {
  apiKey: "AIzaSyD9x5VAZ4j5QuRsKz8vNQE9XHWHJ3_W2as",
  authDomain: "ring-of-fire-d9f15.firebaseapp.com",
  projectId: "ring-of-fire-d9f15",
  storageBucket: "ring-of-fire-d9f15.firebasestorage.app",
  messagingSenderId: "1018102590409",
  appId: "1:1018102590409:web:87cb1254a8ff75bfcd9618",
  measurementId: "G-GEBPK7VCTK"
};

// Firebase App initialisieren
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export type playerObjectLiteral = { name: string, playerIndex: number, isActive: boolean, bgColor: string, playerId: string };

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private game!: Game;
  private player!: Player;
  players:any[] = [];
  public docRefPlayers = doc(db, 'game', 'players');
  private docRefCards = doc(db, 'game', 'cards');
  public cardStack:string[] = [];
  public activePlayer!:playerObjectLiteral;
  public card!:Card;

  constructor() { }

  async getCards(): Promise<string[]> {
    try {
      const docSnap = await getDoc(this.docRefCards);
      if (docSnap.exists()) {
        const data = docSnap.data() as { cards: string[] }
        return data.cards ?? [];
      } else {
        return [];
      }
    } catch (e) {
      console.error("Fehler beim Abrufen der Karten: ", e);
      return [];
    }
  }

  async postCards(cards: string[]) {
    try {
      await updateDoc(this.docRefCards, { cards: cards });
    } catch (e) {
      console.error("Fehler beim Schreiben des Dokuments: ", e);
    }
  }
}