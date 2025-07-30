import { NgStyle } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'taken-card',
  imports: [],
  templateUrl: './taken-cards.html',
  styleUrl: './taken-cards.scss'
})
export class TakenCards {
  @Input() takenCards!:string[];
  @Input() takenCardIndex!:number;

  constructor() {}
}
