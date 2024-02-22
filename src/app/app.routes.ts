import { Routes } from '@angular/router';
import { HuntsComponent } from '@components';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'browse',
    pathMatch: 'full'
  },
  {
    path: 'browse',
    component: HuntsComponent
  },
  {
    path: 'about',
    loadComponent: () => import('./components/about.component').then(c => c.AboutComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./components/admin/adminHome.component').then(c => c.AdminHomeComponent),
    children: [
      {
        path: '',
        redirectTo: 'browse',
        pathMatch: 'full'
      },
      {
        path: 'browse',
        loadComponent: () => import('./components/admin/adminBrowse.component').then(c => c.AdminBrowseComponent)
      },
      {
        path: 'wmas',
        loadComponent: () => import('./components/admin/adminWmas.component').then(c => c.AdminWmasComponent)
      }
    ]
  },
];
