import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, StartScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ring-of-fire';
}
