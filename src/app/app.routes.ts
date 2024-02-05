import { Routes } from '@angular/router';
import { HuntsComponent } from '@components';
import { AdminHomeComponent } from 'components/admin/adminHome.component';

export const routes: Routes = [
  { path: '', redirectTo: 'browse', pathMatch: 'full' },
  { path: 'browse', component: HuntsComponent },
  { path: 'admin', component: AdminHomeComponent },
];
