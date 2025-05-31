import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notification-container">
      <div 
        *ngFor="let notification of notifications" 
        class="notification"
        [ngClass]="'notification-' + notification.type"
      >
        <div class="notification-content">
          <span class="notification-message">{{ notification.message }}</span>
          <button 
            class="notification-close" 
            (click)="close(notification.id)"
            aria-label="Close notification"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 10px;
      max-width: 400px;
    }

    .notification {
      padding: 12px 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      border-left: 4px solid;
      animation: slideIn 0.3s ease-out;
    }

    .notification-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
    }

    .notification-message {
      flex: 1;
      font-weight: 500;
    }

    .notification-close {
      background: none;
      border: none;
      font-size: 20px;
      cursor: pointer;
      padding: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: background-color 0.2s;
    }

    .notification-close:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .notification-success {
      background-color: #d4edda;
      color: #155724;
      border-left-color: #28a745;
    }

    .notification-error {
      background-color: #f8d7da;
      color: #721c24;
      border-left-color: #dc3545;
    }

    .notification-warning {
      background-color: #fff3cd;
      color: #856404;
      border-left-color: #ffc107;
    }

    .notification-info {
      background-color: #d1ecf1;
      color: #0c5460;
      border-left-color: #17a2b8;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `]
})
export class NotificationComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private subscription: Subscription = new Subscription();

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.notificationService.notifications$.subscribe(
        notifications => this.notifications = notifications
      )
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  close(id: string): void {
    this.notificationService.remove(id);
  }
} 