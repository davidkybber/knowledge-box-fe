import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  username: string = '';
  password: string = '';
  successMessage: string = '';
  
  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) {}
  
  ngOnInit() {
    // Check for registration success message in query params
    this.route.queryParams.subscribe(params => {
      if (params['registrationSuccess']) {
        this.successMessage = 'Account created successfully! Please login.';
      }
    });
  }
  
  onLogin() {
    // Here you would typically call an authentication service
    console.log('Login attempt with:', this.username);
    // For now just log to console
  }
  
  onCreateAccount() {
    this.router.navigate(['/signup']);
  }
}
