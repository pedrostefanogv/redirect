import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, interval } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-redirect',
  template: `
    <div class="redirect-container">
      <div class="redirect-card">
        <div class="icon-container">
          <div class="redirect-icon">🔗</div>
        </div>
        
        <h2 class="redirect-title">Redirecionando...</h2>
        
        <div class="url-display" *ngIf="targetUrl">
          <p class="url-label">Você será redirecionado para:</p>
          <div class="url-box">
            <span class="url-text">{{ displayUrl }}</span>
          </div>
        </div>
        
        <div class="timer-container">
          <div class="timer-circle">
            <svg class="timer-svg" viewBox="0 0 100 100">
              <circle 
                class="timer-background" 
                cx="50" 
                cy="50" 
                r="45"
              />
              <circle 
                class="timer-progress" 
                cx="50" 
                cy="50" 
                r="45"
                [style.stroke-dasharray]="circumference"
                [style.stroke-dashoffset]="strokeDashoffset"
              />
            </svg>
            <div class="timer-text">{{ countdown }}</div>
          </div>
        </div>
        
        <p class="timer-label">segundos restantes</p>
        
        <div class="action-buttons" *ngIf="targetUrl">
          <button class="btn btn-primary" (click)="redirectNow()">
            Ir Agora
          </button>
          <button class="btn btn-secondary" (click)="cancelRedirect()">
            Cancelar
          </button>
        </div>
        
        <div class="error-message" *ngIf="!targetUrl && !loading">
          <div class="error-icon">⚠️</div>
          <h3>URL não encontrada</h3>
          <p>Nenhuma URL foi fornecida para redirecionamento.</p>
          <p class="help-text">
            Use: <code>?url=https://exemplo.com</code> como parâmetro
          </p>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./redirect.component.scss']
})
export class RedirectComponent implements OnInit, OnDestroy {
  public targetUrl: string = '';
  public displayUrl: string = '';
  public countdown: number = 5;
  public loading: boolean = true;
  
  private subscription: Subscription = new Subscription();
  public readonly circumference = 2 * Math.PI * 45;
  public strokeDashoffset: number = this.circumference;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Record<string, string>) => {
      this.targetUrl = params['url'] || params['deeplink'] || '';
      this.loading = false;
      
      if (this.targetUrl) {
        this.displayUrl = this.truncateUrl(this.targetUrl);
        this.startCountdown();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  private startCountdown(): void {
    const timer$ = interval(1000).pipe(take(5));
    
    this.subscription.add(
      timer$.subscribe((value: number) => {
        this.countdown = 5 - value - 1;
        this.updateProgress();
        
        if (this.countdown === 0) {
          this.redirect();
        }
      })
    );
  }

  private updateProgress(): void {
    const progress = (5 - this.countdown) / 5;
    this.strokeDashoffset = this.circumference - (progress * this.circumference);
  }

  private truncateUrl(url: string): string {
    if (url.length <= 50) return url;
    return url.substring(0, 47) + '...';
  }

  public redirectNow(): void {
    this.redirect();
  }

  public cancelRedirect(): void {
    this.subscription.unsubscribe();
    this.countdown = -1;
  }

  private redirect(): void {
    if (this.targetUrl) {
      try {
        // Tentar abrir como deeplink primeiro
        if (this.targetUrl.includes('://') && !this.targetUrl.startsWith('http')) {
          window.location.href = this.targetUrl;
        } else {
          // Para URLs HTTP/HTTPS, redirecionar na mesma aba
          window.location.href = this.targetUrl;
        }
      } catch (error) {
        console.error('Erro ao redirecionar:', error);
        window.location.href = this.targetUrl;
      }
    }
  }
}