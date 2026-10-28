import {
  ChangeDetectionStrategy, Component, ElementRef, Injectable, booleanAttribute, computed, effect,
  inject, input, model, output, signal, viewChild,
} from '@angular/core';
import { CfIcon, CfIconName } from '../icon/icon';

export type CfAlertVariant = 'default' | 'info' | 'success' | 'warning' | 'quest';

const ALERT_ICON: Record<CfAlertVariant, CfIconName> = {
  default: 'warn', info: 'info', success: 'check', warning: 'warn', quest: 'pin',
};

/* -------------------------------------------------------------------------- */
/* Alert                                                                       */
/* -------------------------------------------------------------------------- */
/**
 * <cf-alert variant="info" heading="Atualização disponível" dismissible (dismissed)="…">
 *   Firmware 2.1 pronto para instalar.
 * </cf-alert>
 */
@Component({
  selector: 'cf-alert',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfIcon],
  host: {
    class: 'cf-alert cf-bracket',
    '[class]': "variant() !== 'default' ? 'cf-alert--' + variant() : ''",
    '[attr.role]': "variant() === 'default' || variant() === 'warning' ? 'alert' : 'status'",
  },
  template: `
    <cf-icon class="cf-alert__icon" [name]="icon() ?? defaultIcon()" />
    <div>
      <p class="cf-alert__title">{{ heading() }}</p>
      <div class="cf-alert__body"><ng-content /></div>
    </div>
    @if (dismissible()) {
      <button type="button" class="cf-alert__close" aria-label="Fechar" (click)="dismissed.emit()">×</button>
    } @else { <span></span> }
  `,
})
export class CfAlert {
  readonly variant = input<CfAlertVariant>('default');
  readonly heading = input.required<string>();
  readonly icon = input<CfIconName>();
  readonly dismissible = input(false, { transform: booleanAttribute });
  readonly dismissed = output<void>();
  protected readonly defaultIcon = computed(() => ALERT_ICON[this.variant()]);
}

/* -------------------------------------------------------------------------- */
/* Toast                                                                       */
/* -------------------------------------------------------------------------- */
export interface CfToastOptions {
  heading: string;
  body?: string;
  variant?: CfAlertVariant;
  /** ms até sumir. 0 = só fecha manualmente. Padrão 4200. */
  duration?: number;
}
interface CfToastItem extends Required<Omit<CfToastOptions, 'body'>> { id: number; body?: string; leaving: boolean }

/**
 * Serviço de toast. Coloque <cf-toaster /> uma vez no componente raiz e injete:
 *   private toast = inject(CfToastService);
 *   this.toast.show({ heading: 'Contrato concluído', variant: 'success' });
 */
@Injectable({ providedIn: 'root' })
export class CfToastService {
  private seq = 0;
  readonly toasts = signal<CfToastItem[]>([]);

  show(o: CfToastOptions): number {
    const t: CfToastItem = { id: ++this.seq, variant: 'default', duration: 4200, leaving: false, ...o };
    this.toasts.update((l) => [...l, t]);
    if (t.duration > 0) setTimeout(() => this.dismiss(t.id), t.duration);
    return t.id;
  }
  dismiss(id: number): void {
    this.toasts.update((l) => l.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
    setTimeout(() => this.toasts.update((l) => l.filter((t) => t.id !== id)), 260);
  }
  clear(): void { this.toasts().forEach((t) => this.dismiss(t.id)); }
}

@Component({
  selector: 'cf-toaster',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfAlert],
  host: {
    class: 'cf-toaster', role: 'region', 'aria-label': 'Notificações', 'aria-live': 'polite',
    '[class.cf-toaster--center]': "position() === 'center'",
    '[class.cf-toaster--top]': "position() === 'top'",
  },
  template: `
    @for (t of service.toasts(); track t.id) {
      <cf-alert [variant]="t.variant" [heading]="t.heading" dismissible (dismissed)="service.dismiss(t.id)"
                [class.is-leaving]="t.leaving">{{ t.body }}</cf-alert>
    }
  `,
})
export class CfToaster {
  protected readonly service = inject(CfToastService);
  /** Onde os avisos aparecem: canto inferior (padrão), centro da tela ou topo. */
  readonly position = input<'bottom-end' | 'center' | 'top'>('bottom-end');
}

/* -------------------------------------------------------------------------- */
/* Dialog (sobre o <dialog> nativo)                                            */
/* -------------------------------------------------------------------------- */
/**
 * <cf-dialog [(open)]="aberto" heading="Apagar 1 204 registros?">
 *   <p class="cf-p">Essa ação não pode ser desfeita.</p>
 *   <div cfDialogActions>
 *     <button cfButton variant="ghost" (click)="aberto.set(false)">Cancelar</button>
 *     <button cfButton variant="solid" (click)="apagar()">Apagar</button>
 *   </div>
 * </cf-dialog>
 */
@Component({
  selector: 'cf-dialog',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <dialog #dlg class="cf-dialog" [attr.aria-labelledby]="headingId" (close)="open.set(false)"
            (click)="closeOnBackdrop() && $event.target === dlg && open.set(false)">
      @if (open()) {
        <div class="cf-dialog__panel">
          <h2 class="cf-dialog__title" [id]="headingId">{{ heading() }}</h2>
          <ng-content />
          <div class="cf-dialog__actions"><ng-content select="[cfDialogActions]" /></div>
        </div>
      }
    </dialog>
  `,
})
export class CfDialog {
  private static seq = 0;
  readonly open = model(false);
  readonly heading = input.required<string>();
  readonly closeOnBackdrop = input(true, { transform: booleanAttribute });
  protected readonly headingId = `cf-dialog-title-${++CfDialog.seq}`;
  private readonly dlg = viewChild.required<ElementRef<HTMLDialogElement>>('dlg');

  constructor() {
    effect(() => {
      const d = this.dlg().nativeElement;
      if (this.open() && !d.open) d.showModal();
      else if (!this.open() && d.open) d.close();
    });
  }
}
