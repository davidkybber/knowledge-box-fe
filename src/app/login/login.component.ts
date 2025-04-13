import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  
  constructor(private router: Router) {}
  
  onLogin() {
    // Here you would typically call an authentication service
    console.log('Login attempt with:', this.username);
    // For now just log to console
  }
  
  onCreateAccount() {
    // This will be implemented later
    console.log('Create account clicked');
  }
}
