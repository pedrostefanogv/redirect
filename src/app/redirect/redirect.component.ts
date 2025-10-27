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
            <div class="timer-text">{{ isCanceled ? 'Cancelado' : countdown }}</div>
          </div>
        </div>
        
        <p class="timer-label" *ngIf="!isCanceled">segundos restantes</p>
        <p class="timer-label" *ngIf="isCanceled">Redirecionamento cancelado</p>
        
        <div class="action-buttons" *ngIf="targetUrl && !isCanceled">
          <button class="btn btn-primary" (click)="redirectNow()">
            Ir Agora
          </button>
          <button class="btn btn-secondary" (click)="cancelRedirect()">
            Cancelar
          </button>
        </div>
        
        <div class="github-link">
          <a href="https://github.com/pedrostefanogv/redirect" target="_blank" rel="noopener noreferrer" class="github-repo-link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            Ver repositório no GitHub
          </a>
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
    styleUrls: ['./redirect.component.scss'],
    standalone: false
})
export class RedirectComponent implements OnInit, OnDestroy {
  public targetUrl: string = '';
  public displayUrl: string = '';
  public countdown: number = 3;
  public loading: boolean = true;
  public isCanceled: boolean = false;
  
  private subscription: Subscription = new Subscription();
  public readonly circumference = 2 * Math.PI * 45;
  public strokeDashoffset: number = this.circumference;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params: Record<string, string>) => {
      const raw = params['url'] || params['deeplink'] || '';
      this.targetUrl = this.normalizeUrl(raw);
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
    this.isCanceled = true;
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

  // Normaliza URLs recebidas sem protocolo (ex.: exemplo.com -> https://exemplo.com)
  // e evita paths relativos que o GitHub Pages converte em múltiplas barras.
  private normalizeUrl(input: string): string {
    if (!input) return '';

    const trimmed = input.trim();

    // Se for um deeplink (tem esquema e não começa com http), manter
    const schemeMatch = /^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(trimmed);
    if (schemeMatch && !trimmed.toLowerCase().startsWith('http')) {
      return trimmed;
    }

    // Se começar com // (protocol-relative), prefixar https:
    if (trimmed.startsWith('//')) {
      return `https:${trimmed}`;
    }

    // Se já começa com http(s)://, retorna direto
    if (/^https?:\/\//i.test(trimmed)) {
      return trimmed;
    }

    // Se parece um domínio simples ou caminho, prefixar https://
    // Ex.: exemplo.com, www.exemplo.com, sub.exemplo.com/path
    return `https://${trimmed.replace(/^\/*/, '')}`;
  }
}