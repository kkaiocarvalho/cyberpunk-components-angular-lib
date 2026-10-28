import { ChangeDetectionStrategy, Component, Directive, booleanAttribute, input } from '@angular/core';
import { CfIcon, CfIconName } from '../icon/icon';

/**
 * <cf-card variant="panel" hot corners>
 *   <cf-card-header><h3 cfCardTitle>Nó 0x4F2A</h3><cf-badge>Estável</cf-badge></cf-card-header>
 *   …conteúdo…
 *   <cf-card-footer><button cfButton>Abrir</button></cf-card-footer>
 * </cf-card>
 */
@Component({
  selector: 'cf-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-card',
    '[class.cf-card--panel]': "variant() === 'panel'",
    '[class.cf-card--glass]': "variant() === 'glass'",
    '[class.cf-card--hot]': 'hot()',
    '[class.cf-corners]': 'corners()',
  },
  template: `
    @if (corners()) {
      <span class="cf-corner cf-corner--tr" aria-hidden="true"></span>
      <span class="cf-corner cf-corner--bl cf-corner--fill" aria-hidden="true"></span>
    }
    <ng-content />
  `,
})
export class CfCard {
  readonly variant = input<'default' | 'panel' | 'glass'>('default');
  readonly hot = input(false, { transform: booleanAttribute });
  readonly corners = input(false, { transform: booleanAttribute });
}

@Component({
  selector: 'cf-card-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-card__head' },
  template: '<ng-content />',
})
export class CfCardHeader {}

@Directive({ selector: '[cfCardTitle]', host: { class: 'cf-card__title' } })
export class CfCardTitle {}

@Component({
  selector: 'cf-card-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-card__foot' },
  template: '<ng-content />',
})
export class CfCardFooter {}

/**
 * Cabeçalho de seção: ícone + título + régua com sublinhado ciano.
 * <cf-section-header heading="Inventário" icon="grid" description="10/50 slots" />
 */
@Component({
  selector: 'cf-section-header',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfIcon],
  host: { class: 'cf-header', '[class.cf-header--red]': "tone() === 'red'" },
  template: `
    <div class="cf-header__row">
      @if (icon(); as i) { <span class="cf-header__icon"><cf-icon [name]="i" /></span> }
      @switch (level()) {
        @case (1) { <h1 class="cf-header__title">{{ heading() }}</h1> }
        @case (3) { <h3 class="cf-header__title">{{ heading() }}</h3> }
        @default { <h2 class="cf-header__title">{{ heading() }}</h2> }
      }
      <ng-content />
    </div>
    <div class="cf-header__rule" aria-hidden="true"></div>
    @if (description()) { <p class="cf-header__desc">{{ description() }}</p> }
  `,
})
export class CfSectionHeader {
  readonly heading = input.required<string>();
  readonly icon = input<CfIconName>();
  readonly description = input<string>();
  readonly tone = input<'cyan' | 'red'>('cyan');
  readonly level = input<1 | 2 | 3>(2);
}
