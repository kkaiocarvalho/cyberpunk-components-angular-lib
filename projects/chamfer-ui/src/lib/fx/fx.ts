import {
  ChangeDetectionStrategy, Component, DestroyRef, Directive, ElementRef, PLATFORM_ID, booleanAttribute, effect, inject, input,
  numberAttribute,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

const reducedMotion = (): boolean =>
  typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Boot: a moldura se desenha, o fundo acende e o conteúdo pisca
 * quando o elemento aparece na tela (uma vez só).
 *   <cf-card cfBoot>…</cf-card>
 *   <cf-card cfBoot [bootDelay]="120">…</cf-card>
 */
@Directive({ selector: '[cfBoot]' })
export class CfBoot {
  readonly bootDelay = input(0, { transform: numberAttribute });

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return;
    if (reducedMotion() || typeof IntersectionObserver === 'undefined') return;
    // Esconde até aparecer, para não "piscar" o estado final antes da animação.
    el.style.opacity = '0';
    const io = new IntersectionObserver((entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      el.style.removeProperty('opacity');
      el.style.setProperty('--cf-boot-delay', `${this.bootDelay()}ms`);
      el.classList.add('cf-boot');
      el.addEventListener('animationend', (ev) => {
        if (ev.target === el && ev.animationName === 'cf-boot-in') el.classList.remove('cf-boot');
      });
    }, { threshold: 0.15 });
    io.observe(el);
    inject(DestroyRef).onDestroy(() => io.disconnect());
  }
}

const NOISE = '01ABCDEFGHJKLMNPQRSTUVWXYZ#%&*+=<>/\\[]{}';

/**
 * Texto que "decodifica": os caracteres embaralham e vão se fixando da
 * esquerda para a direita. Roda de novo sempre que o texto muda.
 *   <span cfDecode="BRAÇO GORILA MK.2"></span>
 *   <span [cfDecode]="saldo() + ' €$'" [decodeDuration]="500"></span>
 * Leitores de tela recebem o texto final direto (aria-label).
 */
@Directive({ selector: '[cfDecode]', host: { '[attr.aria-label]': 'cfDecode()' } })
export class CfDecode {
  readonly cfDecode = input.required<string | number>();
  readonly decodeDuration = input(650, { transform: numberAttribute });

  private raf = 0;

  constructor() {
    const el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
    const browser = isPlatformBrowser(inject(PLATFORM_ID));
    inject(DestroyRef).onDestroy(() => cancelAnimationFrame(this.raf));

    effect(() => {
      const text = String(this.cfDecode() ?? '');
      const dur = this.decodeDuration();
      cancelAnimationFrame(this.raf);
      if (!browser || reducedMotion() || !text) {
        el.textContent = text;
        return;
      }
      const start = performance.now();
      el.classList.add('cf-decoding');
      const frame = (now: number) => {
        const t = Math.min(1, (now - start) / dur);
        const fixed = Math.floor(t * text.length);
        let noise = '';
        for (let i = fixed; i < text.length; i++) {
          noise += text[i] === ' ' ? ' ' : NOISE[(Math.random() * NOISE.length) | 0];
        }
        el.replaceChildren(document.createTextNode(text.slice(0, fixed)));
        if (noise) {
          const s = document.createElement('span');
          s.className = 'cf-decode-noise';
          s.textContent = noise;
          el.appendChild(s);
        }
        if (t < 1) {
          this.raf = requestAnimationFrame(frame);
        } else {
          el.textContent = text;
          el.classList.remove('cf-decoding');
        }
      };
      this.raf = requestAnimationFrame(frame);
    });
  }
}

/**
 * Camada de tela inteira com textura de monitor (não bloqueia cliques).
 *   <cf-fx-overlay scan grain vignette />
 */
@Component({
  selector: 'cf-fx-overlay',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-fx-overlay', 'aria-hidden': 'true' },
  template: `
    @if (scan()) { <i class="cf-fx-overlay__scan"></i> }
    @if (grain()) { <i class="cf-fx-overlay__grain"></i> }
    @if (vignette()) { <i class="cf-fx-overlay__vignette"></i> }
    @if (flicker()) { <i class="cf-fx-overlay__flicker"></i> }
  `,
})
export class CfFxOverlay {
  readonly scan = input(false, { transform: booleanAttribute });
  readonly grain = input(false, { transform: booleanAttribute });
  readonly vignette = input(false, { transform: booleanAttribute });
  readonly flicker = input(false, { transform: booleanAttribute });
}
