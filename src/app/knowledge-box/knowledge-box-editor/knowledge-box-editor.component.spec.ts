import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { KnowledgeBoxEditorComponent } from './knowledge-box-editor.component';
import { KnowledgeBoxService } from '../../core/services/knowledge-box.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { LogoComponent } from '../../shared/components/logo/logo.component';
import { KnowledgeBox, KnowledgeBoxResponse } from '../../core/models/knowledge-box.models';

describe('KnowledgeBoxEditorComponent', () => {
  let component: KnowledgeBoxEditorComponent;
  let fixture: ComponentFixture<KnowledgeBoxEditorComponent>;
  let knowledgeBoxService: jasmine.SpyObj<KnowledgeBoxService>;
  let notificationService: jasmine.SpyObj<NotificationService>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let activatedRoute: jasmine.SpyObj<ActivatedRoute>;

  const mockKnowledgeBox: KnowledgeBox = {
    id: '1',
    title: 'Test Knowledge Box',
    topic: 'Testing',
    content: 'This is test content',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    userId: 'user1',
    isPublic: false,
    tags: ['test', 'learning']
  };

  const mockUser = {
    id: 'user1',
    username: 'testuser',
    email: 'test@example.com'
  };

  beforeEach(async () => {
    const knowledgeBoxServiceSpy = jasmine.createSpyObj('KnowledgeBoxService', [
      'getKnowledgeBox',
      'createKnowledgeBox',
      'updateKnowledgeBox',
      'addKnowledgeBoxToLocal',
      'updateKnowledgeBoxInLocal'
    ]);

    const notificationServiceSpy = jasmine.createSpyObj('NotificationService', [
      'showError',
      'showSuccess'
    ]);

    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getCurrentUser', 'logout']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const paramMapSpy = jasmine.createSpyObj('ParamMap', ['get']);

    await TestBed.configureTestingModule({
      imports: [FormsModule, KnowledgeBoxEditorComponent, LogoComponent],
      providers: [
        { provide: KnowledgeBoxService, useValue: knowledgeBoxServiceSpy },
        { provide: NotificationService, useValue: notificationServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: paramMapSpy
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeBoxEditorComponent);
    component = fixture.componentInstance;
    knowledgeBoxService = TestBed.inject(KnowledgeBoxService) as jasmine.SpyObj<KnowledgeBoxService>;
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    // Get the paramMap spy from the route
    const route = TestBed.inject(ActivatedRoute);
    activatedRoute = { snapshot: { paramMap: route.snapshot.paramMap } } as any;

    authService.getCurrentUser.and.returnValue(mockUser);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Initialization', () => {
    it('should initialize for new knowledge box', () => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('new');
      
      component.ngOnInit();
      
      expect(component.isNew).toBe(true);
      expect(component.username).toBe('testuser');
    });

    it('should initialize for existing knowledge box', () => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
      const mockResponse: KnowledgeBoxResponse = {
        success: true,
        knowledgeBox: mockKnowledgeBox
      };
      knowledgeBoxService.getKnowledgeBox.and.returnValue(of(mockResponse));
      
      component.ngOnInit();
      
      expect(component.isNew).toBe(false);
      expect(knowledgeBoxService.getKnowledgeBox).toHaveBeenCalledWith('1');
    });

    it('should handle error when loading existing knowledge box', () => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
      knowledgeBoxService.getKnowledgeBox.and.returnValue(throwError('Error'));
      
      component.ngOnInit();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Failed to load knowledge box');
      expect(router.navigate).toHaveBeenCalledWith(['/homepage']);
    });
  });

  describe('Form population', () => {
    it('should populate form with knowledge box data', () => {
      component.populateForm(mockKnowledgeBox);
      
      expect(component.title).toBe('Test Knowledge Box');
      expect(component.topic).toBe('Testing');
      expect(component.content).toBe('This is test content');
      expect(component.isPublic).toBe(false);
      expect(component.tagsInput).toBe('test, learning');
    });

    it('should handle empty tags array', () => {
      const kbWithoutTags = { ...mockKnowledgeBox, tags: [] };
      component.populateForm(kbWithoutTags);
      
      expect(component.tagsInput).toBe('');
    });

    it('should handle undefined tags', () => {
      const kbWithoutTags = { ...mockKnowledgeBox, tags: undefined as any };
      component.populateForm(kbWithoutTags);
      
      expect(component.tagsInput).toBe('');
    });
  });

  describe('Form validation', () => {
    it('should show error when title is empty', () => {
      component.title = '';
      component.topic = 'Valid Topic';
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Title and topic are required');
    });

    it('should show error when topic is empty', () => {
      component.title = 'Valid Title';
      component.topic = '';
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Title and topic are required');
    });

    it('should show error when both title and topic are empty', () => {
      component.title = '';
      component.topic = '';
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Title and topic are required');
    });

    it('should show error when title is only whitespace', () => {
      component.title = '   ';
      component.topic = 'Valid Topic';
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Title and topic are required');
    });
  });

  describe('Create knowledge box', () => {
    beforeEach(() => {
      component.isNew = true;
      component.title = 'New Knowledge Box';
      component.topic = 'New Topic';
      component.content = 'New content';
      component.isPublic = false;
      component.tagsInput = 'tag1, tag2, tag3';
    });

    it('should create knowledge box successfully', () => {
      const mockResponse: KnowledgeBoxResponse = {
        success: true,
        knowledgeBox: mockKnowledgeBox,
        message: 'Knowledge box created successfully'
      };
      knowledgeBoxService.createKnowledgeBox.and.returnValue(of(mockResponse));
      
      component.onSave();
      
      expect(knowledgeBoxService.createKnowledgeBox).toHaveBeenCalledWith({
        title: 'New Knowledge Box',
        topic: 'New Topic',
        content: 'New content',
        isPublic: false,
        tags: ['tag1', 'tag2', 'tag3']
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Knowledge box created successfully');
      expect(knowledgeBoxService.addKnowledgeBoxToLocal).toHaveBeenCalledWith(mockKnowledgeBox);
      expect(router.navigate).toHaveBeenCalledWith(['/homepage']);
    });

    it('should handle create failure', () => {
      const mockResponse: KnowledgeBoxResponse = {
        success: false,
        message: 'Creation failed'
      };
      knowledgeBoxService.createKnowledgeBox.and.returnValue(of(mockResponse));
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Creation failed');
    });

    it('should handle create error', () => {
      knowledgeBoxService.createKnowledgeBox.and.returnValue(throwError('Error'));
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Failed to create knowledge box');
    });

    it('should process tags correctly', () => {
      component.tagsInput = 'tag1,  tag2  , tag3,  ,tag4';
      knowledgeBoxService.createKnowledgeBox.and.returnValue(of({
        success: true,
        knowledgeBox: mockKnowledgeBox
      }));
      
      component.onSave();
      
      expect(knowledgeBoxService.createKnowledgeBox).toHaveBeenCalledWith(jasmine.objectContaining({
        tags: ['tag1', 'tag2', 'tag3', 'tag4']
      }));
    });
  });

  describe('Update knowledge box', () => {
    beforeEach(() => {
      component.isNew = false;
      component.knowledgeBox = mockKnowledgeBox;
      component.title = 'Updated Knowledge Box';
      component.topic = 'Updated Topic';
      component.content = 'Updated content';
      component.isPublic = true;
      component.tagsInput = 'updated, tags';
    });

    it('should update knowledge box successfully', () => {
      const mockResponse: KnowledgeBoxResponse = {
        success: true,
        knowledgeBox: mockKnowledgeBox,
        message: 'Knowledge box updated successfully'
      };
      knowledgeBoxService.updateKnowledgeBox.and.returnValue(of(mockResponse));
      
      component.onSave();
      
      expect(knowledgeBoxService.updateKnowledgeBox).toHaveBeenCalledWith({
        id: '1',
        title: 'Updated Knowledge Box',
        topic: 'Updated Topic',
        content: 'Updated content',
        isPublic: true,
        tags: ['updated', 'tags']
      });
      expect(notificationService.showSuccess).toHaveBeenCalledWith('Knowledge box updated successfully');
      expect(knowledgeBoxService.updateKnowledgeBoxInLocal).toHaveBeenCalledWith(mockKnowledgeBox);
      expect(router.navigate).toHaveBeenCalledWith(['/homepage']);
    });

    it('should handle update failure', () => {
      const mockResponse: KnowledgeBoxResponse = {
        success: false,
        message: 'Update failed'
      };
      knowledgeBoxService.updateKnowledgeBox.and.returnValue(of(mockResponse));
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Update failed');
    });

    it('should handle update error', () => {
      knowledgeBoxService.updateKnowledgeBox.and.returnValue(throwError('Error'));
      
      component.onSave();
      
      expect(notificationService.showError).toHaveBeenCalledWith('Failed to update knowledge box');
    });

    it('should not update if knowledgeBox is null', () => {
      component.knowledgeBox = null;
      
      component.onSave();
      
      expect(knowledgeBoxService.updateKnowledgeBox).not.toHaveBeenCalled();
    });
  });

  describe('Component actions', () => {
    it('should navigate to homepage on cancel', () => {
      component.onCancel();
      
      expect(router.navigate).toHaveBeenCalledWith(['/homepage']);
    });

    it('should logout and navigate to login', () => {
      component.onLogout();
      
      expect(authService.logout).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('Loading states', () => {
    it('should set loading state when loading knowledge box', () => {
      const route = TestBed.inject(ActivatedRoute);
      (route.snapshot.paramMap.get as jasmine.Spy).and.returnValue('1');
      knowledgeBoxService.getKnowledgeBox.and.returnValue(of({
        success: true,
        knowledgeBox: mockKnowledgeBox
      }));
      
      component.ngOnInit();
      
      // Initially loading should be true, then false after response
      expect(component.isLoading).toBe(false);
    });

    it('should set saving state when saving', () => {
      component.isNew = true;
      component.title = 'Test';
      component.topic = 'Test';
      knowledgeBoxService.createKnowledgeBox.and.returnValue(of({
        success: true,
        knowledgeBox: mockKnowledgeBox
      }));
      
      component.onSave();
      
      expect(component.isSaving).toBe(false);
    });
  });

  describe('UI state', () => {
    it('should display username', () => {
      component.ngOnInit();
      expect(component.username).toBe('testuser');
    });

    it('should handle user with no username', () => {
      authService.getCurrentUser.and.returnValue({ id: 'user1' } as any);
      
      component.ngOnInit();
      
      expect(component.username).toBe('User');
    });

    it('should handle null user', () => {
      authService.getCurrentUser.and.returnValue(null);
      
      component.ngOnInit();
      
      expect(component.username).toBe('User');
    });
  });
});