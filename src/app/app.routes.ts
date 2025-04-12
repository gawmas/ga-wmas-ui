import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, Routes } from '@angular/router';
import { env } from '@environment';

export const adminGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): boolean => {
  return !env.production;
}

export const routes: Routes = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full'
  },
  {
    path: '',
    loadComponent: () =>
      import('./components/hunts/hunts.component')
        .then(c => c.HuntsComponent)
  },
  {
    path: 'maps',
    loadComponent: () =>
      import('./components/success-map/success-map.component')
        .then(c => c.SuccessMapComponent)
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./components/about.component')
        .then(c => c.AboutComponent)
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./components/admin/adminHome.component')
        .then(c => c.AdminHomeComponent),
    canActivate: [adminGuard],
    children: [
      {
        path: '',
        redirectTo: '',
        pathMatch: 'full'
      },
      {
        path: '',
        loadComponent: () =>
          import('./components/admin/adminBrowse.component')
            .then(c => c.AdminBrowseComponent)
      },
      {
        path: 'wmas',
        loadComponent: () =>
          import('./components/admin/adminWmas.component')
            .then(c => c.AdminWmasComponent)
      },
      {
        path: 'add',
        loadComponent: () =>
          import('./components/admin/add-hunts.component')
            .then(c => c.AddHuntsComponent)
      },
    ]
  },
  {
    path: '**',
    redirectTo: ''
  },
];
