import { Routes } from '@angular/router';
import { HuntsComponent } from '@components';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HuntsComponent },
];
