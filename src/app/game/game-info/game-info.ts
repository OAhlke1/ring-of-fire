import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'game-info',
  imports: [MatCard, MatButtonModule, MatInput, MatIcon],
  templateUrl: './game-info.html',
  styleUrl: './game-info.scss'
})
export class GameInfo {

}
