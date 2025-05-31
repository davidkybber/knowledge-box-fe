import { Injectable, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TokenExpirationService implements OnDestroy {
  private checkInterval: any;
  private routerSubscription: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  startTokenExpirationCheck(): void {
    // Check token expiration immediately
    this.checkTokenExpiration();

    // Set up periodic checks every 5 minutes
    this.checkInterval = setInterval(() => {
      this.checkTokenExpiration();
    }, 5 * 60 * 1000); // 5 minutes

    // Check token expiration on route navigation
    this.routerSubscription.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.checkTokenExpiration();
        })
    );
  }

  stopTokenExpirationCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.routerSubscription.unsubscribe();
  }

  private checkTokenExpiration(): void {
    // Only check if we have a token and are not on the login page
    const currentRoute = this.router.url;
    if (currentRoute !== '/login' && currentRoute !== '/signup') {
      this.authService.checkTokenExpiration();
    }
  }

  ngOnDestroy(): void {
    this.stopTokenExpirationCheck();
  }
} 