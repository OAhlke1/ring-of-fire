import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen';
import { Game } from './game/game';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StartScreenComponent, Game],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ring-of-fire';
}
