import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl, AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage: string = '';
  isSubmitting: boolean = false;
  
  constructor(
    private router: Router, 
    private http: HttpClient,
    private fb: FormBuilder
  ) {
    this.signupForm = new FormGroup({
      username: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, this.createPasswordStrengthValidator()]),
      confirmPassword: new FormControl('', Validators.required)
    }, { validators: this.passwordMatchValidator() });
  }

  // Custom validator for password strength
  createPasswordStrengthValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasMinLength = value.length >= 8;
      
      const passwordValid = hasUpperCase && hasLowerCase && hasNumeric && hasMinLength;
      
      return !passwordValid ? {
        passwordStrength: {
          hasUpperCase,
          hasLowerCase,
          hasNumeric,
          hasMinLength
        }
      } : null;
    };
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

    // Prepare data for API
    const userData = {
      username: this.f['username'].value,
      password: this.f['password'].value,
      email: this.f['email'].value
    };

    this.isSubmitting = true;

    // Always use HTTPS for API requests
    const apiUrl = '/api/auth/signup';
    
    this.http.post(apiUrl, userData).subscribe({
      next: (response) => {
        console.log('Account created successfully');
        this.isSubmitting = false;
        this.router.navigate(['/login'], { 
          queryParams: { registrationSuccess: 'true' } 
        });
      },
      error: (error) => {
        this.isSubmitting = false;
        
        // Handle different error types
        if (error.status === 409) {
          this.errorMessage = 'Username or email already exists';
        } else if (error.status === 400) {
          this.errorMessage = 'Invalid input data. Please check your information.';
        } else {
          this.errorMessage = 'Failed to create account. Please try again later.';
        }
        
        console.error('Signup error:', error);
      }
    });
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
