import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../core/services/auth.service';
import { KnowledgeBoxService } from '../core/services/knowledge-box.service';
import { NotificationService } from '../core/services/notification.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LogoComponent } from '../shared/components/logo/logo.component';
import { KnowledgeBoxCardComponent } from '../knowledge-box/knowledge-box-card/knowledge-box-card.component';
import { KnowledgeBox } from '../core/models/knowledge-box.models';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [CommonModule, FormsModule, LogoComponent, KnowledgeBoxCardComponent],
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit, OnDestroy {
  username: string = '';
  knowledgeBoxes: KnowledgeBox[] = [];
  isLoading = false;
  searchQuery = '';
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private knowledgeBoxService: KnowledgeBoxService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    // Get user info from local storage or auth service
    const currentUser = this.authService.getCurrentUser();
    this.username = currentUser?.username || 'User';
    
    // Subscribe to knowledge boxes updates
    const knowledgeBoxesSub = this.knowledgeBoxService.knowledgeBoxes$.subscribe(
      boxes => this.knowledgeBoxes = boxes
    );
    this.subscriptions.push(knowledgeBoxesSub);
    
    // Load knowledge boxes
    this.loadKnowledgeBoxes();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadKnowledgeBoxes() {
    this.isLoading = true;
    this.knowledgeBoxService.getKnowledgeBoxes().subscribe({
      next: (response) => {
        if (response.success && response.knowledgeBoxes) {
          this.knowledgeBoxService.updateLocalKnowledgeBoxes(response.knowledgeBoxes);
        } else {
          this.notificationService.showError(response.message || 'Failed to load knowledge boxes');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Failed to load knowledge boxes');
        this.isLoading = false;
      }
    });
  }

  onCreateNew() {
    this.router.navigate(['/knowledge-box', 'new']);
  }

  onSearch() {
    if (!this.searchQuery.trim()) {
      this.loadKnowledgeBoxes();
      return;
    }
    
    this.isLoading = true;
    this.knowledgeBoxService.searchKnowledgeBoxes(this.searchQuery).subscribe({
      next: (response) => {
        if (response.success && response.knowledgeBoxes) {
          this.knowledgeBoxService.updateLocalKnowledgeBoxes(response.knowledgeBoxes);
        } else {
          this.notificationService.showError(response.message || 'Search failed');
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.notificationService.showError('Search failed');
        this.isLoading = false;
      }
    });
  }

  onDeleteKnowledgeBox(id: string) {
    if (confirm('Are you sure you want to delete this knowledge box? This action cannot be undone.')) {
      this.knowledgeBoxService.deleteKnowledgeBox(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.showSuccess('Knowledge box deleted successfully');
            this.knowledgeBoxService.removeKnowledgeBoxFromLocal(id);
          } else {
            this.notificationService.showError(response.message || 'Failed to delete knowledge box');
          }
        },
        error: (error) => {
          this.notificationService.showError('Failed to delete knowledge box');
        }
      });
    }
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
} 