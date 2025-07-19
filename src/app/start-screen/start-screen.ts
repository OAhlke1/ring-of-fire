import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'start-screen',
  imports: [],
  templateUrl: './start-screen.html',
  styleUrls: ['./start-screen.scss']
})
export class StartScreenComponent {
  constructor(private router: Router) {
    
  }

  newGame() {
    // start game
    this.router.navigateByUrl('/game');
    // console.log(this.router);
  }
}