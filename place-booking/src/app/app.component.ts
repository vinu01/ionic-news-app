import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { Platform } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
     private authService: AuthService,
    private router: Router
  ) {
    this.initializeApp();
  }

  initializeApp() {
      }

  onLogout() {
    this.authService.logout();
    this.router.navigateByUrl('/auth');
  }
}
