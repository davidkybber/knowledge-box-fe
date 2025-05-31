import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationComponent } from './shared/components/notification/notification.component';
import { TokenExpirationService } from './core/services/token-expiration.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NotificationComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'knowledge-box-fe';

  constructor(private tokenExpirationService: TokenExpirationService) {}

  ngOnInit(): void {
    this.tokenExpirationService.startTokenExpirationCheck();
  }

  ngOnDestroy(): void {
    this.tokenExpirationService.stopTokenExpirationCheck();
  }
}
