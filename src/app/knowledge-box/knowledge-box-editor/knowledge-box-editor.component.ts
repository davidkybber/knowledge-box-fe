import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { KnowledgeBoxService } from '../../core/services/knowledge-box.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { KnowledgeBox, CreateKnowledgeBoxRequest, UpdateKnowledgeBoxRequest } from '../../core/models/knowledge-box.models';
import { LogoComponent } from '../../shared/components/logo/logo.component';

@Component({
  selector: 'app-knowledge-box-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent],
  templateUrl: './knowledge-box-editor.component.html',
  styleUrls: ['./knowledge-box-editor.component.css']
})
export class KnowledgeBoxEditorComponent implements OnInit {
  knowledgeBox: KnowledgeBox | null = null;
  isNew = true;
  isLoading = false;
  isSaving = false;
  
  // Form fields
  title = '';
  topic = '';
  content = '';
  isPublic = false;
  tagsInput = '';
  
  username = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private knowledgeBoxService: KnowledgeBoxService,
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const currentUser = this.authService.getCurrentUser();
    this.username = currentUser?.username || 'User';
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id && id !== 'new') {
      this.isNew = false;
      this.loadKnowledgeBox(id);
    }
  }

  loadKnowledgeBox(id: string) {
    this.isLoading = true;
    this.knowledgeBoxService.getKnowledgeBox(id).subscribe({
      next: (response) => {
        if (response.success && response.knowledgeBox) {
          this.knowledgeBox = response.knowledgeBox;
          this.populateForm(response.knowledgeBox);
        } else {
          this.notificationService.showError(response.message || 'Failed to load knowledge box');
          this.router.navigate(['/homepage']);
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load knowledge box');
        this.router.navigate(['/homepage']);
        this.isLoading = false;
      }
    });
  }

  populateForm(knowledgeBox: KnowledgeBox) {
    this.title = knowledgeBox.title;
    this.topic = knowledgeBox.topic;
    this.content = knowledgeBox.content;
    this.isPublic = knowledgeBox.isPublic;
    this.tagsInput = knowledgeBox.tags?.join(', ') || '';
  }

  onSave() {
    if (!this.title.trim() || !this.topic.trim()) {
      this.notificationService.showError('Title and topic are required');
      return;
    }

    this.isSaving = true;
    const tags = this.tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag);

    if (this.isNew) {
      this.createKnowledgeBox(tags);
    } else {
      this.updateKnowledgeBox(tags);
    }
  }

  private createKnowledgeBox(tags: string[]) {
    const request: CreateKnowledgeBoxRequest = {
      title: this.title.trim(),
      topic: this.topic.trim(),
      content: this.content.trim(),
      isPublic: this.isPublic,
      tags: tags
    };

    this.knowledgeBoxService.createKnowledgeBox(request).subscribe({
      next: (response) => {
        if (response.success && response.knowledgeBox) {
          this.notificationService.showSuccess('Knowledge box created successfully');
          this.knowledgeBoxService.addKnowledgeBoxToLocal(response.knowledgeBox);
          this.router.navigate(['/homepage']);
        } else {
          this.notificationService.showError(response.message || 'Failed to create knowledge box');
        }
        this.isSaving = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to create knowledge box');
        this.isSaving = false;
      }
    });
  }

  private updateKnowledgeBox(tags: string[]) {
    if (!this.knowledgeBox) return;

    const request: UpdateKnowledgeBoxRequest = {
      id: this.knowledgeBox.id,
      title: this.title.trim(),
      topic: this.topic.trim(),
      content: this.content.trim(),
      isPublic: this.isPublic,
      tags: tags
    };

    this.knowledgeBoxService.updateKnowledgeBox(request).subscribe({
      next: (response) => {
        if (response.success && response.knowledgeBox) {
          this.notificationService.showSuccess('Knowledge box updated successfully');
          this.knowledgeBoxService.updateKnowledgeBoxInLocal(response.knowledgeBox);
          this.router.navigate(['/homepage']);
        } else {
          this.notificationService.showError(response.message || 'Failed to update knowledge box');
        }
        this.isSaving = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to update knowledge box');
        this.isSaving = false;
      }
    });
  }

  onCancel() {
    this.router.navigate(['/homepage']);
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}