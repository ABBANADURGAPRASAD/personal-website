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
    loadComponent: async () => {
      const module = await import('./pages/login/login');
      return module.LoginComponent;
    },
    data: { secureMode: false },
    title: 'Login'
  },
  // Secure routes - protected by auth guard
  {
    path: 'secure',
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
        title: 'Admin Dashboard'
      },
      {
        path: 'home',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
        data: { secureMode: true },
        title: 'Admin - Home Page'
      },
      {
        path: 'portfolio',
        loadComponent: () => import('./pages/portfolio/portfolio').then(m => m.PortfolioComponent),
        data: { secureMode: true },
        title: 'Admin - Portfolio'
      }
    ]
  },
  {
    path: '**',
    redirectTo: ''
  }
];
