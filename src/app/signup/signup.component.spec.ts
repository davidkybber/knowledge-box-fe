import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { SignupComponent } from './signup.component';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [
        SignupComponent,
        ReactiveFormsModule
      ],
      providers: [
        provideRouter([], withComponentInputBinding()),
        provideHttpClient(withInterceptorsFromDi()),
        { provide: HttpClient, useValue: httpClientSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Form Validation', () => {
    it('should validate required fields', () => {
      const form = component.signupForm;
      const usernameControl = form.get('username');
      const emailControl = form.get('email');
      const passwordControl = form.get('password');
      const confirmPasswordControl = form.get('confirmPassword');

      // Initially form should be invalid
      expect(form.valid).toBeFalsy();

      // Test each required field
      usernameControl?.setValue('testuser');
      expect(usernameControl?.valid).toBeTruthy();

      emailControl?.setValue('invalid-email');
      expect(emailControl?.valid).toBeFalsy();
      emailControl?.setValue('valid@example.com');
      expect(emailControl?.valid).toBeTruthy();

      // Password still invalid, form should be invalid
      expect(form.valid).toBeFalsy();
    });

    describe('Password Validation', () => {
      it('should reject passwords that are too short', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('Abc123');
        expect(passwordControl?.valid).toBeFalsy();
        const errors = passwordControl?.errors;
        expect(errors?.['passwordStrength']).toBeTruthy();
        expect(errors?.['passwordStrength'].hasMinLength).toBeFalsy();
      });

      it('should reject passwords without uppercase letters', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('abcdef123');
        expect(passwordControl?.valid).toBeFalsy();
        const errors = passwordControl?.errors;
        expect(errors?.['passwordStrength']).toBeTruthy();
        expect(errors?.['passwordStrength'].hasUpperCase).toBeFalsy();
      });

      it('should reject passwords without lowercase letters', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('ABCDEF123');
        expect(passwordControl?.valid).toBeFalsy();
        const errors = passwordControl?.errors;
        expect(errors?.['passwordStrength']).toBeTruthy();
        expect(errors?.['passwordStrength'].hasLowerCase).toBeFalsy();
      });

      it('should reject passwords without numbers', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('AbcdefGHI');
        expect(passwordControl?.valid).toBeFalsy();
        const errors = passwordControl?.errors;
        expect(errors?.['passwordStrength']).toBeTruthy();
        expect(errors?.['passwordStrength'].hasNumeric).toBeFalsy();
      });

      it('should accept valid passwords', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('ValidP4ss');
        expect(passwordControl?.valid).toBeTruthy();
      });

      it('should accept passwords with special characters', () => {
        const passwordControl = component.signupForm.get('password');
        passwordControl?.setValue('V@lidP4ss!');
        expect(passwordControl?.valid).toBeTruthy();
      });
    });

    it('should validate password confirmation matching', () => {
      const form = component.signupForm;
      const passwordControl = form.get('password');
      const confirmPasswordControl = form.get('confirmPassword');

      // Set a valid password
      passwordControl?.setValue('ValidP4ss');
      
      // Set different confirm password
      confirmPasswordControl?.setValue('DifferentP4ss');
      fixture.detectChanges();
      
      // Trigger validation
      confirmPasswordControl?.markAsTouched();
      form.updateValueAndValidity();
      fixture.detectChanges();
      
      // Form should be invalid
      expect(form.valid).toBeFalsy();
      expect(form.errors?.['passwordMismatch']).toBeTruthy();
      
      // Set matching password
      confirmPasswordControl?.setValue('ValidP4ss');
      form.updateValueAndValidity();
      
      // Form should now be valid
      expect(form.errors?.['passwordMismatch']).toBeFalsy();
    });
  });

  describe('Form Submission', () => {
    it('should not call API if form is invalid', () => {
      // Set invalid values
      component.signupForm.controls['username'].setValue('test');
      component.signupForm.controls['email'].setValue('valid@example.com');
      component.signupForm.controls['password'].setValue('invalid'); // Invalid password
      component.signupForm.controls['confirmPassword'].setValue('invalid');
      
      component.onSignup();
      expect(httpClientSpy.post).not.toHaveBeenCalled();
    });

    it('should call API with form values when form is valid', () => {
      // Set valid values
      const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'ValidP4ssword'
      };
      
      component.signupForm.controls['username'].setValue(testUser.username);
      component.signupForm.controls['email'].setValue(testUser.email);
      component.signupForm.controls['password'].setValue(testUser.password);
      component.signupForm.controls['confirmPassword'].setValue(testUser.password);
      
      httpClientSpy.post.and.returnValue(of({ success: true }));
      
      component.onSignup();
      
      expect(httpClientSpy.post).toHaveBeenCalledWith(
        '/api/auth/signup', 
        jasmine.objectContaining({
          username: testUser.username,
          email: testUser.email,
          password: testUser.password
        })
      );
    });

    it('should navigate to login with success param after successful signup', () => {
      // Set valid form
      component.signupForm.controls['username'].setValue('testuser');
      component.signupForm.controls['email'].setValue('test@example.com');
      component.signupForm.controls['password'].setValue('ValidP4ssword');
      component.signupForm.controls['confirmPassword'].setValue('ValidP4ssword');
      
      httpClientSpy.post.and.returnValue(of({ success: true }));
      
      component.onSignup();
      
      expect(routerSpy.navigate).toHaveBeenCalledWith(
        ['/login'], 
        { queryParams: { registrationSuccess: 'true' } }
      );
    });

    it('should handle username already exists error', () => {
      // Set valid form
      component.signupForm.controls['username'].setValue('testuser');
      component.signupForm.controls['email'].setValue('test@example.com');
      component.signupForm.controls['password'].setValue('ValidP4ssword');
      component.signupForm.controls['confirmPassword'].setValue('ValidP4ssword');
      
      httpClientSpy.post.and.returnValue(
        throwError(() => ({ status: 409, message: 'Username already exists' }))
      );
      
      component.onSignup();
      
      expect(component.errorMessage).toBe('Username or email already exists');
      expect(component.isSubmitting).toBe(false);
    });
  });
});
