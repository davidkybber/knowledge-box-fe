import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { KnowledgeBoxCardComponent } from './knowledge-box-card.component';
import { KnowledgeBox } from '../../core/models/knowledge-box.models';

describe('KnowledgeBoxCardComponent', () => {
  let component: KnowledgeBoxCardComponent;
  let fixture: ComponentFixture<KnowledgeBoxCardComponent>;
  let router: jasmine.SpyObj<Router>;

  const mockKnowledgeBox: KnowledgeBox = {
    id: '1',
    title: 'Test Knowledge Box',
    topic: 'Testing',
    content: 'This is a test content for the knowledge box. It should be displayed in a preview format.',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-02'),
    userId: 'user1',
    isPublic: false,
    tags: ['test', 'learning', 'tutorial', 'extra', 'more']
  };

  beforeEach(async () => {
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [KnowledgeBoxCardComponent],
      providers: [
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(KnowledgeBoxCardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    
    component.knowledgeBox = mockKnowledgeBox;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component rendering', () => {
    it('should display knowledge box title', () => {
      const titleElement = fixture.nativeElement.querySelector('.card-title');
      expect(titleElement.textContent).toBe('Test Knowledge Box');
    });

    it('should display knowledge box topic', () => {
      const topicElement = fixture.nativeElement.querySelector('.topic-value');
      expect(topicElement.textContent).toBe('Testing');
    });

    it('should display content preview', () => {
      const contentElement = fixture.nativeElement.querySelector('.content-preview');
      expect(contentElement.textContent).toContain('This is a test content for the knowledge box. It should be displayed in a preview format.');
    });

    it('should display tags (up to 3)', () => {
      const tagElements = fixture.nativeElement.querySelectorAll('.tag');
      expect(tagElements.length).toBe(3);
      expect(tagElements[0].textContent).toBe('test');
      expect(tagElements[1].textContent).toBe('learning');
      expect(tagElements[2].textContent).toBe('tutorial');
    });

    it('should display "more tags" indicator when there are more than 3 tags', () => {
      const moreTagsElement = fixture.nativeElement.querySelector('.tag-more');
      expect(moreTagsElement.textContent).toBe('+2 more');
    });

    it('should display formatted date', () => {
      const dateElement = fixture.nativeElement.querySelector('.info-item');
      expect(dateElement.textContent).toContain('1/2/2024');
    });

    it('should not display public indicator for private knowledge box', () => {
      const publicIndicator = fixture.nativeElement.querySelector('.info-item:last-child');
      expect(publicIndicator.textContent).not.toContain('Public');
    });

    it('should display public indicator for public knowledge box', () => {
      component.knowledgeBox = { ...mockKnowledgeBox, isPublic: true };
      fixture.detectChanges();
      
      const publicIndicator = fixture.nativeElement.querySelector('.info-item:last-child');
      expect(publicIndicator.textContent).toContain('Public');
    });
  });

  describe('Event handling', () => {
    it('should emit deleteClicked event when delete button is clicked', () => {
      spyOn(component.deleteClicked, 'emit');
      
      const deleteButton = fixture.nativeElement.querySelector('.delete-btn');
      deleteButton.click();
      
      expect(component.deleteClicked.emit).toHaveBeenCalledWith('1');
    });

    it('should navigate to edit page when edit button is clicked', () => {
      const editButton = fixture.nativeElement.querySelector('.edit-btn');
      editButton.click();
      
      expect(router.navigate).toHaveBeenCalledWith(['/knowledge-box', '1']);
    });

    it('should call onEdit method when edit button is clicked', () => {
      spyOn(component, 'onEdit');
      
      const editButton = fixture.nativeElement.querySelector('.edit-btn');
      editButton.click();
      
      expect(component.onEdit).toHaveBeenCalled();
    });

    it('should call onDelete method when delete button is clicked', () => {
      spyOn(component, 'onDelete');
      
      const deleteButton = fixture.nativeElement.querySelector('.delete-btn');
      deleteButton.click();
      
      expect(component.onDelete).toHaveBeenCalled();
    });
  });

  describe('Helper methods', () => {
    it('should return preview text with ellipsis', () => {
      const preview = component.getPreview();
      expect(preview).toBe('This is a test content for the knowledge box. It should be displayed in a preview format....'); 
    });

    it('should return "No content yet" for empty content', () => {
      component.knowledgeBox = { ...mockKnowledgeBox, content: '' };
      const preview = component.getPreview();
      expect(preview).toBe('No content yet');
    });

    it('should return "No content yet" for undefined content', () => {
      component.knowledgeBox = { ...mockKnowledgeBox, content: undefined as any };
      const preview = component.getPreview();
      expect(preview).toBe('No content yet');
    });

    it('should format date correctly', () => {
      const formattedDate = component.getFormattedDate(new Date('2024-01-15'));
      expect(formattedDate).toBe('1/15/2024');
    });
  });

  describe('Edge cases', () => {
    it('should handle knowledge box with no tags', () => {
      component.knowledgeBox = { ...mockKnowledgeBox, tags: [] };
      fixture.detectChanges();
      
      const tagContainer = fixture.nativeElement.querySelector('.card-tags');
      expect(tagContainer).toBeFalsy();
    });

    it('should handle knowledge box with exactly 3 tags', () => {
      component.knowledgeBox = { ...mockKnowledgeBox, tags: ['tag1', 'tag2', 'tag3'] };
      fixture.detectChanges();
      
      const tagElements = fixture.nativeElement.querySelectorAll('.tag');
      const moreTagsElement = fixture.nativeElement.querySelector('.tag-more');
      
      expect(tagElements.length).toBe(3);
      expect(moreTagsElement).toBeFalsy();
    });

    it('should handle very long content', () => {
      const longContent = 'A'.repeat(500);
      component.knowledgeBox = { ...mockKnowledgeBox, content: longContent };
      
      const preview = component.getPreview();
      expect(preview.length).toBe(153); // 150 characters + '...'
      expect(preview.endsWith('...')).toBe(true);
    });

    it('should handle very long title', () => {
      const longTitle = 'Very Long Title That Should Be Displayed Correctly';
      component.knowledgeBox = { ...mockKnowledgeBox, title: longTitle };
      fixture.detectChanges();
      
      const titleElement = fixture.nativeElement.querySelector('.card-title');
      expect(titleElement.textContent).toBe(longTitle);
    });
  });
});