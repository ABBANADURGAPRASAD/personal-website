import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'Home'
  },
  {
    path: 'portfolio',
    loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.PortfolioComponent),
    data: { secureMode: false },
    title: 'Portfolio'
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent),
    title: 'Login'
  },
  // Secure routes - protected by auth guard
  {
    path: 'secure',
    canActivate: [authGuard],
    children: [
      {
        path: 'portfolio',
        loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.PortfolioComponent),
        data: { secureMode: true },
        title: 'Admin - Portfolio'
      },
      {
        path: '',
        redirectTo: 'portfolio',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
