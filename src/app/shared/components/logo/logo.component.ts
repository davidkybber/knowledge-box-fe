import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <svg 
      [attr.width]="size" 
      [attr.height]="size"
      [class]="customClass"
      viewBox="0 0 200 200" 
      xmlns="http://www.w3.org/2000/svg"
      [attr.aria-label]="'Knowledge Box Logo'"
    >
      <!-- Book base -->
      <path d="M60 140 Q100 125 140 140 L140 170 Q100 155 60 170 Z" 
            [attr.stroke]="color" stroke-width="4" fill="none"/>
      <path d="M60 140 L60 170 M140 140 L140 170" 
            [attr.stroke]="color" stroke-width="4"/>
      
      <!-- Tree trunk -->
      <rect x="95" y="80" width="10" height="60" [attr.fill]="color"/>
      
      <!-- Lightbulb -->
      <circle cx="100" cy="45" r="20" [attr.fill]="color"/>
      <rect x="97" y="65" width="6" height="8" [attr.fill]="color"/>
      <line x1="100" y1="20" x2="100" y2="10" [attr.stroke]="color" stroke-width="3"/>
      
      <!-- Leaves -->
      <ellipse cx="75" cy="65" rx="12" ry="20" [attr.fill]="color" transform="rotate(-30 75 65)"/>
      <ellipse cx="125" cy="65" rx="12" ry="20" [attr.fill]="color" transform="rotate(30 125 65)"/>
      <ellipse cx="65" cy="90" rx="10" ry="16" [attr.fill]="color" transform="rotate(-45 65 90)"/>
      <ellipse cx="135" cy="90" rx="10" ry="16" [attr.fill]="color" transform="rotate(45 135 90)"/>
      <ellipse cx="70" cy="115" rx="8" ry="14" [attr.fill]="color" transform="rotate(-60 70 115)"/>
      <ellipse cx="130" cy="115" rx="8" ry="14" [attr.fill]="color" transform="rotate(60 130 115)"/>
    </svg>
  `,
  styles: [`
    :host {
      display: inline-block;
    }
    svg {
      transition: all 0.3s ease;
    }
  `]
})
export class LogoComponent {
  @Input() size: string = '40';
  @Input() color: string = '#2E8B57';
  @Input() customClass: string = '';
} 