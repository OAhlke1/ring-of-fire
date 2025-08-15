import { Routes, RouterModule } from '@angular/router';
import { StartScreenComponent } from './start-screen/start-screen';
import { Game } from './game/game';

export const routes: Routes = [
    {path: '', component: StartScreenComponent},
    {path: 'start', component: StartScreenComponent},
    {path: 'game', component: Game}
];