import { Component } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
} from '@angular/router'

import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loading: boolean = false;

  constructor(
    private router: Router,
    public authService: AuthService,
  ) {
    router.events.subscribe((event: RouterEvent) => {
      this.refreshToken(event);
      this.updateLoadingBar(event);
    });
  }

  private refreshToken(event: RouterEvent): void {
    if (event instanceof NavigationStart && this.authService.isLoggedIn()) {
      this.authService.refresh().catch(response => null);
    }
  }

  private updateLoadingBar(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.loading = true;
    }
    if (event instanceof NavigationEnd
      || event instanceof NavigationCancel
      || event instanceof NavigationError) {
      this.loading = false;
    }
  }

}
