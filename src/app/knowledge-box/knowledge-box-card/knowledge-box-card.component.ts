import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KnowledgeBox } from '../../core/models/knowledge-box.models';

@Component({
  selector: 'app-knowledge-box-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './knowledge-box-card.component.html',
  styleUrls: ['./knowledge-box-card.component.css']
})
export class KnowledgeBoxCardComponent {
  @Input() knowledgeBox!: KnowledgeBox;
  @Output() deleteClicked = new EventEmitter<string>();

  constructor(private router: Router) {}

  onEdit() {
    this.router.navigate(['/knowledge-box', this.knowledgeBox.id]);
  }

  onDelete() {
    this.deleteClicked.emit(this.knowledgeBox.id);
  }

  getPreview(): string {
    return this.knowledgeBox.content?.substring(0, 150) + '...' || 'No content yet';
  }

  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleDateString();
  }
}