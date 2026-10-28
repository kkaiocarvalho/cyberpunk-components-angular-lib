import { ChangeDetectionStrategy, Component, booleanAttribute, computed, input } from '@angular/core';

export type CfBadgeVariant =
  | 'default' | 'solid' | 'cyan' | 'new' | 'mint' | 'steel' | 'violet' | 'orange' | 'grey'
  | 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'iconic';

const RARITY_MAP: Record<string, string> = {
  common: 'grey', uncommon: 'mint', rare: 'steel', epic: 'violet', legendary: 'orange', iconic: 'new',
};

/**
 * <cf-badge variant="rare">Raro</cf-badge>
 * <cf-badge variant="cyan" pulse>Online</cf-badge>
 * <cf-badge variant="cyan" count>3</cf-badge>
 */
@Component({
  selector: 'cf-badge',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-badge', '[class]': 'classes()' },
  template: `@if (pulse()) {<span class="cf-dot cf-dot--pulse"></span>}<ng-content />`,
})
export class CfBadge {
  readonly variant = input<CfBadgeVariant>('default');
  readonly pulse = input(false, { transform: booleanAttribute });
  readonly count = input(false, { transform: booleanAttribute });

  protected readonly classes = computed(() => {
    const v = RARITY_MAP[this.variant()] ?? this.variant();
    return [v !== 'default' ? `cf-badge--${v}` : '', this.count() ? 'cf-badge--count' : ''].join(' ');
  });
}

/** <cf-kbd>Esc</cf-kbd> · <cf-kbd round>X</cf-kbd> */
@Component({
  selector: 'cf-kbd',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-kbd', '[class.cf-kbd--round]': 'round()' },
  template: '<ng-content />',
})
export class CfKbd {
  readonly round = input(false, { transform: booleanAttribute });
}

/**
 * Barra de dicas de comando:
 * <cf-hints><cf-hint key="Esc">Voltar</cf-hint></cf-hints>
 */
@Component({
  selector: 'cf-hints',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-hints' },
  template: '<ng-content />',
})
export class CfHints {}

@Component({
  selector: 'cf-hint',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfKbd],
  host: { class: 'cf-hint' },
  template: `<cf-kbd [round]="round()">{{ key() }}</cf-kbd><ng-content />`,
})
export class CfHint {
  readonly key = input.required<string>();
  readonly round = input(false, { transform: booleanAttribute });
}
