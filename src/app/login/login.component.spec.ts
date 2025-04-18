import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login.component';
import { CommonModule } from '@angular/common';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockActivatedRoute: any;

  beforeEach(async () => {
    // Create mock ActivatedRoute with queryParams
    mockActivatedRoute = {
      queryParams: of({})
    };

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        FormsModule,
        CommonModule
      ],
      providers: [
        provideRouter([], withComponentInputBinding()),
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show success message when registrationSuccess query param is true', () => {
    // Update mock query params
    mockActivatedRoute.queryParams = of({ registrationSuccess: 'true' });
    
    // Recreate component to trigger ngOnInit with new params
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    
    expect(component.successMessage).toBe('Account created successfully! Please login.');
  });
});
