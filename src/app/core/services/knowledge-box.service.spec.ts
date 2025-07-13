import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KnowledgeBoxService } from './knowledge-box.service';
import { NotificationService } from './notification.service';
import { 
  KnowledgeBox, 
  CreateKnowledgeBoxRequest, 
  UpdateKnowledgeBoxRequest,
  KnowledgeBoxResponse,
  KnowledgeBoxListResponse,
  DeleteKnowledgeBoxResponse
} from '../models/knowledge-box.models';

describe('KnowledgeBoxService', () => {
  let service: KnowledgeBoxService;
  let httpMock: HttpTestingController;
  let notificationService: jasmine.SpyObj<NotificationService>;

  const mockKnowledgeBox: KnowledgeBox = {
    id: '1',
    title: 'Test Knowledge Box',
    topic: 'Testing',
    content: 'This is test content',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
    userId: 'user1',
    isPublic: false,
    tags: ['test', 'learning']
  };

  const baseUrl = 'https://knowledge-box-api.lemonhill-9a1917eb.westeurope.azurecontainerapps.io';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('NotificationService', ['showError', 'showSuccess']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        KnowledgeBoxService,
        { provide: NotificationService, useValue: spy }
      ]
    });

    service = TestBed.inject(KnowledgeBoxService);
    httpMock = TestBed.inject(HttpTestingController);
    notificationService = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getKnowledgeBoxes', () => {
    it('should return knowledge boxes', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: [mockKnowledgeBox],
        totalCount: 1
      };

      service.getKnowledgeBoxes().subscribe((response: KnowledgeBoxListResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getKnowledgeBox', () => {
    it('should return a specific knowledge box', () => {
      const mockResponse: KnowledgeBoxResponse = {
        success: true,
        knowledgeBox: mockKnowledgeBox
      };

      service.getKnowledgeBox('1').subscribe((response: KnowledgeBoxResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('createKnowledgeBox', () => {
    it('should create a new knowledge box', () => {
      const request: CreateKnowledgeBoxRequest = {
        title: 'New Knowledge Box',
        topic: 'New Topic',
        content: 'New content',
        isPublic: false,
        tags: ['new', 'test']
      };

      const mockResponse: KnowledgeBoxResponse = {
        success: true,
        knowledgeBox: mockKnowledgeBox,
        message: 'Knowledge box created successfully'
      };

      service.createKnowledgeBox(request).subscribe((response: KnowledgeBoxResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('updateKnowledgeBox', () => {
    it('should update an existing knowledge box', () => {
      const request: UpdateKnowledgeBoxRequest = {
        id: '1',
        title: 'Updated Title',
        content: 'Updated content'
      };

      const mockResponse: KnowledgeBoxResponse = {
        success: true,
        knowledgeBox: mockKnowledgeBox,
        message: 'Knowledge box updated successfully'
      };

      service.updateKnowledgeBox(request).subscribe((response: KnowledgeBoxResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes/1`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(request);
      req.flush(mockResponse);
    });
  });

  describe('deleteKnowledgeBox', () => {
    it('should delete a knowledge box', () => {
      const mockResponse: DeleteKnowledgeBoxResponse = {
        success: true,
        message: 'Knowledge box deleted successfully'
      };

      service.deleteKnowledgeBox('1').subscribe((response: DeleteKnowledgeBoxResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });
  });

  describe('searchKnowledgeBoxes', () => {
    it('should search knowledge boxes with query', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: [mockKnowledgeBox],
        totalCount: 1
      };

      service.searchKnowledgeBoxes('test').subscribe((response: KnowledgeBoxListResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes/search?query=test`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should search knowledge boxes with query and tags', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: [mockKnowledgeBox],
        totalCount: 1
      };

      service.searchKnowledgeBoxes('test', ['learning', 'tutorial']).subscribe((response: KnowledgeBoxListResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes/search?query=test&tags=learning,tutorial`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getPublicKnowledgeBoxes', () => {
    it('should return public knowledge boxes', () => {
      const mockResponse: KnowledgeBoxListResponse = {
        success: true,
        knowledgeBoxes: [mockKnowledgeBox],
        totalCount: 1
      };

      service.getPublicKnowledgeBoxes().subscribe((response: KnowledgeBoxListResponse) => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${baseUrl}/knowledgeboxes/public`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('Local state management', () => {
    it('should update local knowledge boxes', () => {
      const knowledgeBoxes = [mockKnowledgeBox];
      
      service.updateLocalKnowledgeBoxes(knowledgeBoxes);
      
      service.knowledgeBoxes$.subscribe((boxes: KnowledgeBox[]) => {
        expect(boxes).toEqual(knowledgeBoxes);
      });
    });

    it('should add knowledge box to local state', () => {
      const initialBoxes = [mockKnowledgeBox];
      const newBox: KnowledgeBox = {
        ...mockKnowledgeBox,
        id: '2',
        title: 'Another Box'
      };

      service.updateLocalKnowledgeBoxes(initialBoxes);
      service.addKnowledgeBoxToLocal(newBox);
      
      service.knowledgeBoxes$.subscribe((boxes: KnowledgeBox[]) => {
        expect(boxes).toEqual([mockKnowledgeBox, newBox]);
      });
    });

    it('should update knowledge box in local state', () => {
      const initialBoxes = [mockKnowledgeBox];
      const updatedBox: KnowledgeBox = {
        ...mockKnowledgeBox,
        title: 'Updated Title'
      };

      service.updateLocalKnowledgeBoxes(initialBoxes);
      service.updateKnowledgeBoxInLocal(updatedBox);
      
      service.knowledgeBoxes$.subscribe((boxes: KnowledgeBox[]) => {
        expect(boxes[0].title).toBe('Updated Title');
      });
    });

    it('should remove knowledge box from local state', () => {
      const initialBoxes = [mockKnowledgeBox];

      service.updateLocalKnowledgeBoxes(initialBoxes);
      service.removeKnowledgeBoxFromLocal('1');
      
      service.knowledgeBoxes$.subscribe((boxes: KnowledgeBox[]) => {
        expect(boxes).toEqual([]);
      });
    });
  });
});