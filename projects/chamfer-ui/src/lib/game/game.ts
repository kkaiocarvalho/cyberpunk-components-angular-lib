import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, booleanAttribute, computed, contentChildren, inject, input,
  numberAttribute, output,
} from '@angular/core';

/**
 * Barra de vida/energia. Quando o valor cai, o pedaço perdido fica branco
 * por um instante e depois "escorre" (como o dano no jogo).
 *   <cf-health label="Saúde" [value]="hp()" [max]="420" />
 *   <cf-health label="RAM" tone="cyan" [value]="6" [max]="10" [cells]="10" />
 */
@Component({
  selector: 'cf-health',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-health',
    role: 'meter',
    '[class.cf-health--cyan]': "tone() === 'cyan'",
    '[class.cf-health--mint]': "tone() === 'mint'",
    '[class.cf-health--thick]': 'thick()',
    '[class.cf-health--low]': 'low()',
    '[style.--v]': "pct() + '%'",
    '[style.--cells]': 'cells()',
    '[attr.aria-label]': 'label() || null',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemax]': 'max()',
    'aria-valuemin': '0',
  },
  template: `
    @if (label() || showValue()) {
      <div class="cf-health__meta">
        <span class="cf-health__label">{{ label() }}</span>
        @if (showValue()) { <span class="cf-health__value">{{ value() }}<small> / {{ max() }}</small></span> }
      </div>
    }
    <div class="cf-health__track"><i class="cf-health__ghost"></i><i class="cf-health__bar"></i></div>
  `,
})
export class CfHealth {
  readonly value = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly label = input<string>();
  readonly tone = input<'red' | 'cyan' | 'mint'>('red');
  /** Quantas divisões a barra tem. */
  readonly cells = input(10, { transform: numberAttribute });
  readonly thick = input(false, { transform: booleanAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  /** Abaixo desta fração a barra pisca (0 desliga). */
  readonly lowAt = input(0.25, { transform: numberAttribute });
  protected readonly pct = computed(() => Math.min(100, Math.max(0, (this.value() / (this.max() || 1)) * 100)));
  protected readonly low = computed(() => this.lowAt() > 0 && this.pct() > 0 && this.pct() <= this.lowAt() * 100);
}

export type CfChoiceKind = 'default' | 'main' | 'exit' | 'visited' | 'locked';

/**
 * Uma opção de diálogo. Use dentro de <cf-choices>.
 *   <button cfChoice key="1" kind="main">Quem te mandou?</button>
 *   <button cfChoice key="2" tag="Frio 6" kind="locked">[Intimidar] Fala logo.</button>
 */
@Component({
  selector: 'button[cfChoice]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-choice cf-frame',
    type: 'button',
    '[attr.data-kind]': "kind() === 'default' ? null : kind()",
    '[attr.aria-disabled]': "kind() === 'locked' ? 'true' : null",
  },
  template: `
    @if (key() !== undefined && key() !== '') { <span class="cf-choice__key" aria-hidden="true">{{ key() }}</span> }
    <span class="cf-choice__text"><ng-content /></span>
    @if (tag()) { <span class="cf-choice__tag">{{ tag() }}</span> }
  `,
})
export class CfChoice {
  readonly key = input<string | number>();
  readonly tag = input<string>();
  readonly kind = input<CfChoiceKind>('default');
  readonly el = inject<ElementRef<HTMLButtonElement>>(ElementRef).nativeElement;
}

/**
 * Lista de opções de diálogo, com setas ↑↓ e atalhos numéricos.
 *   <cf-choices speaker="Jackie" (choose)="responder($event)">
 *     <button cfChoice key="1" kind="main" (click)="…">Bora.</button>
 *     <button cfChoice key="2" kind="exit">[Sair]</button>
 *   </cf-choices>
 * (choose) emite a key da opção escolhida (clique, Enter ou número).
 */
@Component({
  selector: 'cf-choices',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    role: 'group',
    '[attr.aria-label]': 'speaker() || "Opções de diálogo"',
    '(keydown)': 'onKey($event)',
    '(click)': 'onClick($event)',
  },
  template: `
    @if (speaker()) { <p class="cf-choices__speaker">{{ speaker() }}</p> }
    <div class="cf-choices"><ng-content /></div>
  `,
})
export class CfChoices {
  readonly speaker = input<string>();
  /** Atalhos numéricos funcionam na página inteira (para telas só de diálogo). */
  readonly globalKeys = input(false, { transform: booleanAttribute });
  readonly choose = output<string>();
  private readonly items = contentChildren(CfChoice);

  constructor() {
    const handler = (e: KeyboardEvent) => {
      if (!this.globalKeys() || (e.target as HTMLElement)?.closest?.('input, textarea, [contenteditable="true"]')) return;
      this.byKey(e);
    };
    if (typeof document !== 'undefined') {
      document.addEventListener('keydown', handler);
      inject(DestroyRef).onDestroy(() => document.removeEventListener('keydown', handler));
    }
  }

  private usable() {
    return this.items().filter((c) => c.kind() !== 'locked');
  }

  private byKey(e: KeyboardEvent): boolean {
    if (e.ctrlKey || e.metaKey || e.altKey) return false;
    const hit = this.usable().find((c) => String(c.key() ?? '') === e.key);
    if (!hit) return false;
    e.preventDefault();
    hit.el.focus();
    hit.el.click();
    return true;
  }

  protected onKey(e: KeyboardEvent): void {
    if (!this.globalKeys() && this.byKey(e)) return;
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    const list = this.usable();
    if (!list.length) return;
    e.preventDefault();
    const i = list.findIndex((c) => c.el === document.activeElement);
    const next = e.key === 'ArrowDown' ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
    list[next].el.focus();
  }

  protected onClick(e: Event): void {
    const btn = (e.target as HTMLElement).closest('.cf-choice');
    const item = this.items().find((c) => c.el === btn);
    if (!item) return;
    if (item.kind() === 'locked') {
      e.preventDefault();
      e.stopImmediatePropagation();
      return;
    }
    this.choose.emit(String(item.key() ?? ''));
  }
}

export interface CfObjectiveStep {
  text: string;
  done?: boolean;
  optional?: boolean;
}

/**
 * Rastreador de missão (o bloco do canto da tela).
 *   <cf-objective heading="O Assalto" distance="120 m"
 *     [steps]="[{ text: 'Encontre Dex', done: true }, { text: 'Vá ao Afterlife' }]" />
 * Mude [updated] para true por um instante para destacar uma atualização.
 */
@Component({
  selector: 'cf-objective',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-objective', role: 'status', '[class.cf-objective--updated]': 'updated()' },
  template: `
    <div class="cf-objective__head">
      <i class="cf-objective__diamond" aria-hidden="true"></i>
      <h3 class="cf-objective__title">{{ heading() }}</h3>
      @if (distance()) { <span class="cf-objective__dist">{{ distance() }}</span> }
    </div>
    <ul class="cf-objective__list">
      @for (s of steps(); track $index) {
        <li class="cf-objective__step" [class.is-done]="s.done" [class.is-optional]="s.optional">
          {{ s.text }}@if (s.optional) { <span class="cf-sr-only"> (opcional)</span> }@if (s.done) { <span class="cf-sr-only"> (concluído)</span> }
        </li>
      }
    </ul>
    <ng-content />
  `,
})
export class CfObjective {
  readonly heading = input.required<string>();
  readonly distance = input<string>();
  readonly steps = input<CfObjectiveStep[]>([]);
  readonly updated = input(false, { transform: booleanAttribute });
}

/** Re-export auxiliar para quem só quer as diretivas de forma tipada. */
export const CF_GAME = [CfHealth, CfChoices, CfChoice, CfObjective] as const;
