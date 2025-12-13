# Portfolio Website - Angular Full Stack Application

A modern, full-stack-ready portfolio website built with Angular, featuring dual-mode architecture (public and secure/admin modes) using the same UI components. The application is designed to seamlessly integrate with a Spring Boot backend with JWT authentication.

## 🚀 Features

- **Dual-Mode Architecture**: Same components for both public (read-only) and secure (admin) views
- **Modern UI/UX**: Clean, responsive design with smooth animations
- **Authentication System**: JWT-ready authentication service with route guards
- **Portfolio Management**: 
  - Profile information with social links
  - Skills categorized by type with proficiency levels
  - Projects with technologies, links, and featured status
- **Admin Features** (Secure Mode):
  - Edit profile information
  - Add/Edit/Delete skills
  - Add/Edit/Delete projects
  - Real-time updates with reactive state management
- **Backend-Ready**: Services structured for easy Spring Boot integration
- **Standalone Components**: Modern Angular architecture with standalone components
- **Responsive Design**: Mobile-first approach with modern CSS

## 📁 Project Structure

```
src/app/
├── models/
│   └── portfolio.models.ts          # TypeScript interfaces (Profile, Skill, Project)
├── services/
│   ├── auth.ts                      # Authentication service (JWT-ready)
│   └── portfolio.service.ts        # Portfolio data management service
├── guards/
│   └── auth-guard.ts                # Route guard for protected routes
├── pages/
│   ├── home/
│   │   ├── home.component.ts       # Landing page component
│   │   ├── home.component.html
│   │   └── home.component.scss
│   ├── login/
│   │   ├── login.component.ts       # Login component with modern UI
│   │   ├── login.component.html
│   │   └── login.component.scss
│   └── portfolio/
│       ├── portfolio.component.ts   # Main portfolio component (dual-mode)
│       ├── portfolio.component.html
│       └── portfolio.component.scss
├── app.routes.ts                     # Routing configuration
└── app.config.ts                     # Application configuration
```

## 🏗️ Architecture

### Dual-Mode Design

The application uses a single component (`PortfolioComponent`) for both public and secure views. The mode is determined by route data:

- **Public Routes**: `/portfolio` - Read-only view
- **Secure Routes**: `/secure/portfolio` - Protected by auth guard, enables editing

The component uses Angular signals to reactively manage state and conditionally render edit controls based on `secureMode`.

### Services

#### AuthService (`src/app/services/auth.ts`)
- JWT-ready authentication service
- Token management with localStorage
- Observable-based login method (ready for HTTP integration)
- Token validation support
- Currently uses mock authentication (username: `admin`, password: `admin123`)

#### PortfolioService (`src/app/services/portfolio.service.ts`)
- Manages portfolio data (Profile, Skills, Projects)
- Reactive state with Angular signals
- CRUD operations for all portfolio entities
- localStorage persistence (temporary, replace with HTTP calls)
- Structured for easy backend integration

### Routing

```typescript
/                    → HomeComponent (landing page)
/portfolio           → PortfolioComponent (public mode)
/login               → LoginComponent
/secure/portfolio    → PortfolioComponent (secure mode, protected)
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Angular CLI 20.3+

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

4. Navigate to `http://localhost:4200/`

### Default Credentials

- **Username**: `admin`
- **Password**: `admin123`

## 🔧 Backend Integration

The application is structured for easy integration with a Spring Boot backend. Here's what needs to be updated:

### 1. AuthService Integration

In `src/app/services/auth.ts`, replace the mock login method:

```typescript
login(username: string, password: string): Observable<boolean> {
  return this.http.post<AuthResponse>('/api/auth/login', { username, password })
    .pipe(
      tap(response => this.setAuthToken(response.token, response.user)),
      map(() => true),
      catchError(() => of(false))
    );
}
```

### 2. PortfolioService Integration

In `src/app/services/portfolio.service.ts`, replace mock methods with HTTP calls:

```typescript
getPortfolioData(): Observable<PortfolioData> {
  return this.http.get<PortfolioData>('/api/portfolio')
    .pipe(tap(data => this.portfolioDataSignal.set(data)));
}

updateProfile(profile: Partial<Profile>): Observable<Profile> {
  return this.http.put<Profile>(`/api/portfolio/profile`, profile)
    .pipe(
      tap(updated => {
        const current = this.portfolioDataSignal();
        this.portfolioDataSignal.set({ ...current, profile: updated });
      })
    );
}
```

### 3. HTTP Interceptor (Recommended)

Create an HTTP interceptor to automatically attach JWT tokens:

```typescript
// src/app/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  
  return next(req);
};
```

Add to `app.config.ts`:
```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

### 4. Backend API Endpoints Expected

```
POST   /api/auth/login          - Login endpoint
GET    /api/auth/validate        - Token validation
GET    /api/portfolio            - Get portfolio data
PUT    /api/portfolio/profile    - Update profile
POST   /api/portfolio/skills     - Add skill
PUT    /api/portfolio/skills/:id - Update skill
DELETE /api/portfolio/skills/:id - Delete skill
POST   /api/portfolio/projects   - Add project
PUT    /api/portfolio/projects/:id - Update project
DELETE /api/portfolio/projects/:id - Delete project
```

## 🎨 Customization

### Styling

- Global styles: `src/styles.scss`
- Component styles: Each component has its own `.scss` file
- Color scheme: Easily customizable via CSS variables (can be added)

### Data Models

Modify `src/app/models/portfolio.models.ts` to add new fields or entities.

## 📝 Development

### Build for Production

```bash
ng build
```

### Run Tests

```bash
ng test
```

## 🔐 Security Notes

- Currently uses localStorage for token storage (consider httpOnly cookies for production)
- Auth guard protects secure routes
- All admin operations require authentication
- JWT token validation should be implemented on the backend

## 🚀 Future Enhancements

- [ ] Image upload for profile avatar and project images
- [ ] Rich text editor for project descriptions
- [ ] Drag-and-drop for project/skill ordering
- [ ] Export portfolio as PDF
- [ ] Multi-language support
- [ ] Dark mode toggle
- [ ] Analytics integration

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ using Angular 20
