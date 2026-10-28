import { ChangeDetectionStrategy, Component, Directive, booleanAttribute, computed, input, numberAttribute } from '@angular/core';
import { CfBadge, CfBadgeVariant } from '../badge/badge';
import { CfIcon, CfIconName } from '../icon/icon';
import { CfRarity } from '../core/frame';

/* -------------------------------------------------------------------------- */
/* Progress                                                                    */
/* -------------------------------------------------------------------------- */
/**
 * <cf-progress label="Sincronizando" [value]="75" caption="Pacote 3 de 4" />
 * <cf-progress label="Escaneando" tone="cyan" indeterminate />
 */
@Component({
  selector: 'cf-progress',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-progress',
    '[class.cf-progress--cyan]': "tone() === 'cyan'",
    '[class.cf-progress--thick]': 'thick()',
    '[class.cf-progress--indeterminate]': 'indeterminate()',
  },
  template: `
    @if (label() || showValue()) {
      <div class="cf-progress__meta">
        <span class="cf-label">{{ label() }}</span>
        @if (showValue() && !indeterminate()) { <span class="cf-progress__value">{{ pct() }}%</span> }
        <ng-content select="[cfProgressMeta]" />
      </div>
    }
    <div class="cf-progress__track" role="progressbar" [attr.aria-label]="label() || null"
         [attr.aria-valuemin]="0" [attr.aria-valuemax]="100" [attr.aria-valuenow]="indeterminate() ? null : pct()">
      <div class="cf-progress__bar" [style.--value]="indeterminate() ? null : pct() + '%'"></div>
    </div>
    @if (caption()) { <span class="cf-micro">{{ caption() }}</span> }
  `,
})
export class CfProgress {
  readonly value = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly label = input<string>();
  readonly caption = input<string>();
  readonly tone = input<'red' | 'cyan'>('red');
  readonly thick = input(false, { transform: booleanAttribute });
  readonly indeterminate = input(false, { transform: booleanAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  protected readonly pct = computed(() => Math.round(Math.min(100, Math.max(0, (this.value() / (this.max() || 1)) * 100))));
}

/** Barra segmentada: <cf-segments [total]="10" [value]="6" tone="cyan" /> */
@Component({
  selector: 'cf-segments',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-segments',
    role: 'meter',
    '[class.cf-segments--cyan]': "tone() === 'cyan'",
    '[style.--n]': 'total()',
    '[attr.aria-valuenow]': 'value()',
    '[attr.aria-valuemax]': 'total()',
    'aria-valuemin': '0',
  },
  template: `@for (s of segs(); track $index) { <i [class.on]="s"></i> }`,
})
export class CfSegments {
  readonly total = input(10, { transform: numberAttribute });
  readonly value = input(0, { transform: numberAttribute });
  readonly tone = input<'red' | 'cyan'>('red');
  protected readonly segs = computed(() => Array.from({ length: this.total() }, (_, i) => i < this.value()));
}

/** <cf-stat label="Latência" value="18" unit="ms" delta="▼ 4 ms" deltaDir="down" /> */
@Component({
  selector: 'cf-stat',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-stat' },
  template: `
    <span class="cf-stat__label">{{ label() }}</span>
    <span class="cf-stat__value" [class.cf-text-red]="tone() === 'red'" [class.cf-text-gold]="tone() === 'gold'"
          [class.cf-text-mint]="tone() === 'mint'">{{ value() }}@if (unit()) {<small>{{ unit() }}</small>}</span>
    @if (delta()) { <span class="cf-delta" [class.cf-delta--up]="deltaDir() === 'up'" [class.cf-delta--down]="deltaDir() === 'down'">{{ delta() }}</span> }
    <ng-content />
  `,
})
export class CfStat {
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  readonly unit = input<string>();
  readonly delta = input<string>();
  readonly deltaDir = input<'up' | 'down' | 'none'>('none');
  readonly tone = input<'cyan' | 'red' | 'gold' | 'mint'>('cyan');
}

/* -------------------------------------------------------------------------- */
/* Item cell                                                                   */
/* -------------------------------------------------------------------------- */
/**
 * Célula de inventário/produto com bracket de raridade e estados.
 * <button cfItem label="Deck M2" rarity="legendary" tag="Novo" tagVariant="new"
 *         amount="680" kind="Tech" icon="item-deck" [selected]="sel()===1" (click)="sel.set(1)"></button>
 * Para mídia própria, projete um elemento com o atributo cfItemMedia.
 */
@Component({
  selector: 'button[cfItem], a[cfItem], div[cfItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfBadge, CfIcon],
  host: {
    class: 'cf-item cf-bracket cf-interactive',
    '[attr.data-rarity]': 'rarity()',
    '[class.is-active]': 'selected()',
    '[attr.aria-pressed]': 'selected()',
  },
  template: `
    <span class="cf-item__name">{{ label() }}</span>
    @if (tag()) { <cf-badge class="cf-item__tag" [variant]="tagVariant() ?? rarity()">{{ tag() }}</cf-badge> }
    <span class="cf-item__media">
      @if (icon(); as i) { <cf-icon [name]="i" /> }
      <ng-content select="[cfItemMedia]" />
    </span>
    <span class="cf-item__meta">
      @if (amount() !== undefined) { <span class="cf-item__value">{{ amount() }}</span> }
      @if (kind()) { <span class="cf-item__type">{{ kind() }}</span> }
    </span>
    <ng-content />
  `,
})
export class CfItem {
  readonly label = input.required<string>();
  readonly rarity = input<CfRarity>('common');
  readonly tag = input<string>();
  readonly tagVariant = input<CfBadgeVariant>();
  readonly amount = input<string | number>();
  readonly kind = input<string>();
  readonly icon = input<CfIconName>();
  readonly selected = input(false, { transform: booleanAttribute });
}

/** Grade responsiva para itens: <cf-item-grid> … </cf-item-grid> */
@Component({
  selector: 'cf-item-grid',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-grid' },
  template: '<ng-content />',
})
export class CfItemGrid {}

/* -------------------------------------------------------------------------- */
/* Table & key/value                                                           */
/* -------------------------------------------------------------------------- */
/** <cf-table-container><table cfTable>…</table></cf-table-container> */
@Component({
  selector: 'cf-table-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-table-wrap' },
  template: '<ng-content />',
})
export class CfTableContainer {}

@Directive({ selector: 'table[cfTable]', host: { class: 'cf-table' } })
export class CfTable {}

/** Célula numérica alinhada à direita em ciano: <td cfNum>18 ms</td> */
@Directive({ selector: 'td[cfNum], th[cfNum]', host: { class: 'is-num' } })
export class CfNum {}

/** Lista chave/valor: <dl cfKv><dt>Latência</dt><dd>18 ms</dd></dl> */
@Directive({ selector: 'dl[cfKv]', host: { class: 'cf-kv' } })
export class CfKv {}
