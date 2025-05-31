import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { UserSignupRequest } from '../core/models/auth.models';
import { LogoComponent } from '../shared/components/logo/logo.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LogoComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  
  constructor(
    private router: Router, 
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(100)
      ]),
      email: new FormControl('', [
        Validators.required, 
        Validators.email,
        Validators.maxLength(100)
      ]),
      password: new FormControl('', [
        Validators.required, 
        Validators.minLength(8),
        Validators.maxLength(100)
      ]),
      confirmPassword: new FormControl('', Validators.required),
      firstName: new FormControl(''),
      lastName: new FormControl('')
    }, { validators: this.passwordMatchValidator() });
  }

  // Custom validator to ensure passwords match
  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.get('password')?.value;
      const confirmPassword = control.get('confirmPassword')?.value;
      
      if (password !== confirmPassword) {
        control.get('confirmPassword')?.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      }
      
      return null;
    };
  }

  // Helper methods to access form controls easily in the template
  get f() { 
    return this.signupForm.controls; 
  }

  onSignup() {
    this.errorMessage = '';
    
    // Mark all fields as touched to trigger validation messages
    Object.keys(this.f).forEach(key => {
      const control = this.signupForm.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
    
    // Stop if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    // Prepare data for API according to backend model
    const signupRequest: UserSignupRequest = {
      username: this.f['username'].value,
      email: this.f['email'].value,
      password: this.f['password'].value,
      firstName: this.f['firstName'].value || undefined,
      lastName: this.f['lastName'].value || undefined
    };

    this.isSubmitting = true;

    this.authService.signup(signupRequest).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          console.log('Account created successfully');
          this.router.navigate(['/login'], { 
            queryParams: { registrationSuccess: 'true' } 
          });
        } else {
          this.errorMessage = response.message || 'Failed to create account. Please try again.';
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        console.error('Signup error:', error);
        
        // Handle different error types based on your backend response
        if (error.status === 400) {
          // Backend validation errors
          if (error.error && error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Invalid input data. Please check your information.';
          }
        } else if (error.status === 409) {
          this.errorMessage = 'Username or email already exists';
        } else if (error.status === 0) {
          this.errorMessage = 'Unable to connect to the server. Please check your internet connection.';
        } else {
          this.errorMessage = 'Failed to create account. Please try again later.';
        }
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
