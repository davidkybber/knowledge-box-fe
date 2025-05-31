import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../shared/components/logo/logo.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {
  username: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Get user info from local storage or auth service
    const currentUser = this.authService.getCurrentUser();
    this.username = currentUser?.username || 'User';
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 