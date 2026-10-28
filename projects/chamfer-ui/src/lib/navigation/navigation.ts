import { ChangeDetectionStrategy, Component, booleanAttribute, computed, inject, input, model } from '@angular/core';
import { CfIcon, CfIconName } from '../icon/icon';
import { CfRarity } from '../core/frame';

/**
 * Botão grande de hub/menu principal, com ícone em losango.
 * <a cfTile icon="map" routerLink="/mapa">Mapa</a>
 */
@Component({
  selector: 'a[cfTile], button[cfTile]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfIcon],
  host: {
    class: 'cf-tile',
    '[class.cf-bracket]': 'bracket() !== false',
    '[attr.data-rarity]': 'rarity()',
  },
  template: `
    @if (icon(); as i) { <span class="cf-tile__icon"><cf-icon [name]="i" /></span> }
    <span><ng-content /></span>
  `,
})
export class CfTile {
  readonly icon = input<CfIconName>();
  readonly bracket = input<boolean | CfRarity | ''>(false);
  protected readonly rarity = computed(() => {
    const b = this.bracket();
    return typeof b === 'string' && b ? b : null;
  });
}

/**
 * <cf-accordion>
 *   <cf-accordion-item heading="Protocolos" open>…</cf-accordion-item>
 * </cf-accordion>
 * Use [exclusive]="true" no acordeão para abrir um item por vez.
 */
@Component({
  selector: 'cf-accordion',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-accordion' },
  template: '<ng-content />',
})
export class CfAccordion {
  readonly exclusive = input(false, { transform: booleanAttribute });
  readonly groupName = `cf-acc-${Math.random().toString(36).slice(2, 8)}`;
}

@Component({
  selector: 'cf-accordion-item',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { style: 'display: contents' },
  template: `
    <details [open]="open()" [attr.name]="acc?.exclusive() ? acc?.groupName : null" (toggle)="open.set($any($event.target).open)">
      <summary>{{ heading() }}</summary>
      <div class="cf-accordion__body"><ng-content /></div>
    </details>
  `,
})
export class CfAccordionItem {
  protected readonly acc = inject(CfAccordion, { optional: true });
  readonly heading = input.required<string>();
  readonly open = model(false);
}
