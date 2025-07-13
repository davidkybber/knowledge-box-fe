import { TestBed } from '@angular/core/testing';
import { NotificationService, Notification } from './notification.service';

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show method', () => {
    it('should add notification to the list', () => {
      service.show('Test message', 'info');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Test message');
        expect(notifications[0].type).toBe('info');
      });
    });

    it('should generate unique id for notifications', () => {
      service.show('Message 1', 'info');
      service.show('Message 2', 'success');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(2);
        expect(notifications[0].id).not.toBe(notifications[1].id);
      });
    });

    it('should use default type and duration', () => {
      service.show('Test message');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications[0].type).toBe('info');
        expect(notifications[0].duration).toBe(5000);
      });
    });

    it('should auto-remove notification after duration', (done) => {
      service.show('Test message', 'info', 100);
      
      setTimeout(() => {
        service.notifications$.subscribe((notifications: Notification[]) => {
          expect(notifications.length).toBe(0);
          done();
        });
      }, 150);
    });

    it('should not auto-remove notification with 0 duration', (done) => {
      service.show('Test message', 'info', 0);
      
      setTimeout(() => {
        service.notifications$.subscribe((notifications: Notification[]) => {
          expect(notifications.length).toBe(1);
          done();
        });
      }, 100);
    });
  });

  describe('showSuccess method', () => {
    it('should show success notification', () => {
      service.showSuccess('Success message');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Success message');
        expect(notifications[0].type).toBe('success');
        expect(notifications[0].duration).toBe(5000);
      });
    });

    it('should accept custom duration', () => {
      service.showSuccess('Success message', 3000);
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications[0].duration).toBe(3000);
      });
    });
  });

  describe('showError method', () => {
    it('should show error notification', () => {
      service.showError('Error message');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Error message');
        expect(notifications[0].type).toBe('error');
        expect(notifications[0].duration).toBe(5000);
      });
    });

    it('should accept custom duration', () => {
      service.showError('Error message', 8000);
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications[0].duration).toBe(8000);
      });
    });
  });

  describe('showWarning method', () => {
    it('should show warning notification', () => {
      service.showWarning('Warning message');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Warning message');
        expect(notifications[0].type).toBe('warning');
        expect(notifications[0].duration).toBe(5000);
      });
    });

    it('should accept custom duration', () => {
      service.showWarning('Warning message', 6000);
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications[0].duration).toBe(6000);
      });
    });
  });

  describe('showInfo method', () => {
    it('should show info notification', () => {
      service.showInfo('Info message');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Info message');
        expect(notifications[0].type).toBe('info');
        expect(notifications[0].duration).toBe(5000);
      });
    });

    it('should accept custom duration', () => {
      service.showInfo('Info message', 4000);
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications[0].duration).toBe(4000);
      });
    });
  });

  describe('showSessionTimeout method', () => {
    it('should show session timeout warning', () => {
      service.showSessionTimeout();
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Your session has expired. Please log in again.');
        expect(notifications[0].type).toBe('warning');
        expect(notifications[0].duration).toBe(8000);
      });
    });
  });

  describe('remove method', () => {
    it('should remove notification by id', () => {
      service.show('Message 1', 'info');
      service.show('Message 2', 'success');
      
      let notificationId: string;
      service.notifications$.subscribe((notifications: Notification[]) => {
        if (notifications.length === 2) {
          notificationId = notifications[0].id;
        }
      });
      
      service.remove(notificationId!);
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
        expect(notifications[0].message).toBe('Message 2');
      });
    });

    it('should not error when removing non-existent notification', () => {
      service.show('Test message', 'info');
      
      expect(() => {
        service.remove('non-existent-id');
      }).not.toThrow();
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(1);
      });
    });
  });

  describe('clear method', () => {
    it('should clear all notifications', () => {
      service.show('Message 1', 'info');
      service.show('Message 2', 'success');
      service.show('Message 3', 'error');
      
      service.clear();
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(0);
      });
    });

    it('should not error when clearing empty list', () => {
      expect(() => {
        service.clear();
      }).not.toThrow();
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(0);
      });
    });
  });

  describe('notification management', () => {
    it('should handle multiple notifications', () => {
      service.showSuccess('Success');
      service.showError('Error');
      service.showWarning('Warning');
      service.showInfo('Info');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications.length).toBe(4);
        expect(notifications[0].type).toBe('success');
        expect(notifications[1].type).toBe('error');
        expect(notifications[2].type).toBe('warning');
        expect(notifications[3].type).toBe('info');
      });
    });

    it('should maintain order of notifications', () => {
      service.show('First', 'info');
      service.show('Second', 'success');
      service.show('Third', 'error');
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        expect(notifications[0].message).toBe('First');
        expect(notifications[1].message).toBe('Second');
        expect(notifications[2].message).toBe('Third');
      });
    });
  });

  describe('id generation', () => {
    it('should generate different ids for consecutive notifications', () => {
      const ids = new Set();
      
      for (let i = 0; i < 10; i++) {
        service.show(`Message ${i}`, 'info');
      }
      
      service.notifications$.subscribe((notifications: Notification[]) => {
        notifications.forEach(notification => {
          ids.add(notification.id);
        });
        
        expect(ids.size).toBe(10);
      });
    });
  });
});