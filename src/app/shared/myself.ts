import { Injectable } from "@angular/core";
import { FirebaseService, playerObjectLiteral } from "../models/firebase";

@Injectable ({
    providedIn: 'root'
})
export class Myself {
    myselfObject!:playerObjectLiteral;

    constructor(public fbs: FirebaseService) { }
}