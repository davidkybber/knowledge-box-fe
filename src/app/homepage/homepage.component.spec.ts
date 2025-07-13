import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HomepageComponent } from './homepage.component';
import { AuthService } from '../core/services/auth.service';
import { KnowledgeBoxService } from '../core/services/knowledge-box.service';
import { NotificationService } from '../core/services/notification.service';
import { LogoComponent } from '../shared/components/logo/logo.component';
import { KnowledgeBoxCardComponent } from '../knowledge-box/knowledge-box-card/knowledge-box-card.component';
import { KnowledgeBox, KnowledgeBoxListResponse, DeleteKnowledgeBoxResponse } from '../core/models/knowledge-box.models';

describe('HomepageComponent', () => {
  let component: HomepageComponent;
  let fixture: ComponentFixture<HomepageComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let knowledgeBoxService: jasmine.SpyObj<KnowledgeBoxService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let router: jasmine.SpyObj<Router>;

  const mockUser = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com'
  };

  const mockKnowledgeBoxes: KnowledgeBox[] = [
    {
      id: '1',
      title: 'Test Knowledge Box 1',
      topic: 'Testing',
      content: 'This is test content 1',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01'),
      userId: 'user1',
      isPublic: false,
      tags: ['test', 'learning']
    },
    {
      id: '2',
      title: 'Test Knowledge Box 2',
      topic: 'Development',
      content: 'This is test content 2',
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02'),
      userId: 'user1',
      isPublic: true,
      tags: ['development', 'coding']
    }
  ];

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const knowledgeBoxServiceSpy = jasmine.createSpyObj('KnowledgeBoxService', [
      'getKnowledgeBoxes',
      'searchKnowledgeBoxes',
      'deleteKnowledgeBox',
      'updateLocalKnowledgeBoxes',
      'removeKnowledgeBoxFromLocal'
    ], {
      knowledgeBoxes$: of(mockKnowledgeBoxes)
    });
    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showError',
      'showSuccess'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, HomepageComponent, LogoComponent, KnowledgeBoxCardComponent],
      providers: [
        { provide: AuthService, useValue: authServiceSpy },
        { provide: KnowledgeBoxService, useValue: knowledgeBoxServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomepageComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    knowledgeBoxService = TestBed.inject(KnowledgeBoxService) as jasmine.SpyObj<KnowledgeBoxService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    authService.getCurrentUser.and.returnValue(mockUser);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize with user data and load knowledge boxes', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: mockKnowledgeBoxes,
        totalCount: 2
      };
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of(mockResponse));

      component.ngOnInit();

      expect(component.username).toBe('testuser');
      expect(knowledgeBoxService.getKnowledgeBoxes).toHaveBeenCalled();
      expect(knowledgeBoxService.updateLocalKnowledgeBoxes).toHaveBeenCalledWith(mockKnowledgeBoxes);
    });

    it('should handle user with no username', () => {
      authService.getCurrentUser.and.returnValue({ id: 'user1' } as any);
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of({ success: true, knowledgeBoxes: [] }));

      component.ngOnInit();

      expect(component.username).toBe('User');
    });

    it('should handle null user', () => {
      authService.getCurrentUser.and.returnValue(null);
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of({ success: true, knowledgeBoxes: [] }));

      component.ngOnInit();

      expect(component.username).toBe('User');
    });

    it('should handle error when loading knowledge boxes', () => {
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(throwError('Error'));

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalledWith('Failed to load knowledge boxes');
      expect(component.isLoading).toBe(false);
    });

    it('should handle failed response when loading knowledge boxes', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: false,
        message: 'Server error'
      };
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of(mockResponse));

      component.ngOnInit();

      expect(notificationService.showError).toHaveBeenCalledWith('Server error');
      expect(component.isLoading).toBe(false);
    });
  });

  describe('Knowledge box management', () => {
    beforeEach(() => {
      component.knowledgeBoxes = mockKnowledgeBoxes;
    });

    it('should navigate to create new knowledge box', () => {
      component.onCreateNew();

      expect(router.navigate).toHaveBeenCalledWith(['/knowledge-box', 'new']);
    });

    it('should delete knowledge box successfully', () => {
      const mockResponse: DeleteKnowledgeBoxResponse = {
        success: true,
        message: 'Knowledge box deleted successfully'
      };
      knowledgeBoxService.deleteKnowledgeBox.and.returnValue(of(mockResponse));
      spyOn(window, 'confirm').and.returnValue(true);

      component.onDeleteKnowledgeBox('1');

      expect(knowledgeBoxService.deleteKnowledgeBox).toHaveBeenCalledWith('1');
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Knowledge box deleted successfully');
      expect(knowledgeBoxService.removeKnowledgeBoxFromLocal).toHaveBeenCalledWith('1');
    });

    it('should handle delete knowledge box failure', () => {
      const mockResponse: DeleteKnowledgeBoxResponse = {
        success: false,
        message: 'Delete failed'
      };
      knowledgeBoxService.deleteKnowledgeBox.and.returnValue(of(mockResponse));
      spyOn(window, 'confirm').and.returnValue(true);

      component.onDeleteKnowledgeBox('1');

      expect(notificationService.showError).toHaveBeenCalledWith('Delete failed');
      expect(knowledgeBoxService.removeKnowledgeBoxFromLocal).not.toHaveBeenCalled();
    });

    it('should handle delete knowledge box error', () => {
      knowledgeBoxService.deleteKnowledgeBox.and.returnValue(throwError('Error'));
      spyOn(window, 'confirm').and.returnValue(true);

      component.onDeleteKnowledgeBox('1');

      expect(notificationService.showError).toHaveBeenCalledWith('Failed to delete knowledge box');
    });

    it('should not delete knowledge box if user cancels confirmation', () => {
      spyOn(window, 'confirm').and.returnValue(false);

      component.onDeleteKnowledgeBox('1');

      expect(knowledgeBoxService.deleteKnowledgeBox).not.toHaveBeenCalled();
    });
  });

  describe('Search functionality', () => {
    it('should search knowledge boxes when search query is provided', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: [mockKnowledgeBoxes[0]],
        totalCount: 1
      };
      knowledgeBoxService.searchKnowledgeBoxes.and.returnValue(of(mockResponse));
      component.searchQuery = 'test';

      component.onSearch();

      expect(knowledgeBoxService.searchKnowledgeBoxes).toHaveBeenCalledWith('test');
      expect(knowledgeBoxService.updateLocalKnowledgeBoxes).toHaveBeenCalledWith([mockKnowledgeBoxes[0]]);
    });

    it('should reload all knowledge boxes when search query is empty', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: mockKnowledgeBoxes,
        totalCount: 2
      };
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of(mockResponse));
      component.searchQuery = '';

      component.onSearch();

      expect(knowledgeBoxService.getKnowledgeBoxes).toHaveBeenCalled();
      expect(knowledgeBoxService.searchKnowledgeBoxes).not.toHaveBeenCalled();
    });

    it('should reload all knowledge boxes when search query is whitespace only', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: mockKnowledgeBoxes,
        totalCount: 2
      };
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of(mockResponse));
      component.searchQuery = '   ';

      component.onSearch();

      expect(knowledgeBoxService.getKnowledgeBoxes).toHaveBeenCalled();
      expect(knowledgeBoxService.searchKnowledgeBoxes).not.toHaveBeenCalled();
    });

    it('should handle search failure', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: false,
        message: 'Search failed'
      };
      knowledgeBoxService.searchKnowledgeBoxes.and.returnValue(of(mockResponse));
      component.searchQuery = 'test';

      component.onSearch();

      expect(notificationService.showError).toHaveBeenCalledWith('Search failed');
    });

    it('should handle search error', () => {
      knowledgeBoxService.searchKnowledgeBoxes.and.returnValue(throwError('Error'));
      component.searchQuery = 'test';

      component.onSearch();

      expect(notificationService.showError).toHaveBeenCalledWith('Search failed');
    });
  });

  describe('Authentication', () => {
    it('should logout and navigate to login', () => {
      component.onLogout();

      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Loading states', () => {
    it('should set loading state when loading knowledge boxes', () => {
      knowledgeBoxService.getKnowledgeBoxes.and.returnValue(of({
        success: true,
        knowledgeBoxes: mockKnowledgeBoxes
      }));

      component.loadKnowledgeBoxes();

      expect(component.isLoading).toBe(false);
    });

    it('should set loading state when searching', () => {
      knowledgeBoxService.searchKnowledgeBoxes.and.returnValue(of({
        success: true,
        knowledgeBoxes: mockKnowledgeBoxes
      }));
      component.searchQuery = 'test';

      component.onSearch();

      expect(component.isLoading).toBe(false);
    });
  });

  describe('Component cleanup', () => {
    it('should unsubscribe from subscriptions on destroy', () => {
      component.ngOnInit();
      spyOn(component['subscriptions'][0], 'unsubscribe');

      component.ngOnDestroy();

      expect(component['subscriptions'][0].unsubscribe).toHaveBeenCalled();
    });
  });

  describe('UI rendering', () => {
    it('should display knowledge boxes when available', () => {
      component.knowledgeBoxes = mockKnowledgeBoxes;
      component.isLoading = false;
      fixture.detectChanges();

      const knowledgeBoxCards = fixture.nativeElement.querySelectorAll('app-knowledge-box-card');
      expect(knowledgeBoxCards.length).toBe(2);
    });

    it('should display empty state when no knowledge boxes', () => {
      component.knowledgeBoxes = [];
      component.isLoading = false;
      fixture.detectChanges();

      const emptyState = fixture.nativeElement.querySelector('.empty-state');
      expect(emptyState).toBeTruthy();
      expect(emptyState.textContent).toContain('No Knowledge Boxes Yet');
    });

    it('should display loading spinner when loading', () => {
      component.isLoading = true;
      fixture.detectChanges();

      const loadingSpinner = fixture.nativeElement.querySelector('.loading-spinner');
      expect(loadingSpinner).toBeTruthy();
    });

    it('should display username in header', () => {
      component.username = 'testuser';
      fixture.detectChanges();

      const usernameElement = fixture.nativeElement.querySelector('h2');
      expect(usernameElement.textContent).toContain('Welcome, testuser!');
    });
  });
});