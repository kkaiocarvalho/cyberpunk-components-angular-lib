import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input, signal } from '@angular/core';

export type CfButtonVariant = 'default' | 'solid' | 'cyan' | 'gold' | 'ghost' | 'link';
export type CfButtonSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm';

/**
 * Botão. Aplique em <button> ou <a> nativos (acessibilidade grátis).
 *
 * <button cfButton variant="solid" size="lg">Confirmar</button>
 * <a cfButton variant="cyan" href="/scan"><cf-icon name="radar" /> Escanear</a>
 */
@Component({
  selector: 'button[cfButton], a[cfButton]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-btn',
    '[class]': 'classes()',
    '[class.is-flash]': 'flashing()',
    '[attr.aria-pressed]': 'pressed()',
    '(click)': 'flash()',
  },
  template: '<ng-content />',
})
export class CfButton {
  readonly variant = input<CfButtonVariant>('default');
  readonly size = input<CfButtonSize>('md');
  readonly block = input(false, { transform: booleanAttribute });
  /** Estado de toggle (vira aria-pressed). Deixe undefined para botão comum. */
  readonly pressed = input<boolean | undefined>(undefined);

  protected readonly flashing = signal(false);

  protected readonly classes = computed(() => {
    const c: string[] = [];
    if (this.variant() !== 'default') c.push(`cf-btn--${this.variant()}`);
    switch (this.size()) {
      case 'sm': c.push('cf-btn--sm'); break;
      case 'lg': c.push('cf-btn--lg'); break;
      case 'icon': c.push('cf-btn--icon'); break;
      case 'icon-sm': c.push('cf-btn--icon', 'cf-btn--sm'); break;
    }
    if (this.block()) c.push('cf-btn--block');
    return c.join(' ');
  });

  protected flash(): void {
    this.flashing.set(true);
    setTimeout(() => this.flashing.set(false), 140);
  }
}

/** Grupo segmentado: <cf-button-group> com vários cfButton dentro. */
@Component({
  selector: 'cf-button-group, [cfButtonGroup]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-btn-group', role: 'group' },
  template: '<ng-content />',
})
export class CfButtonGroup {}
