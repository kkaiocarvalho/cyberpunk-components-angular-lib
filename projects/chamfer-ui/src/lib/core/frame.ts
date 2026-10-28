import { Directive, booleanAttribute, computed, input } from '@angular/core';

export type CfCut = 'none' | 'br' | 'tl' | 'tr' | 'bl' | 'diag' | 'anti' | 'all';
export type CfCutSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type CfLine = 'idle' | 'hot' | 'cyan' | 'none';
export type CfRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'iconic';

/**
 * Primitiva de chanfro. Transforma qualquer elemento numa peça com cantos cortados.
 *
 * <section cfFrame cut="diag" cutSize="lg" line="hot">…</section>
 * <div cfFrame interactive [bracket]="'epic'">…</div>
 */
@Directive({
  selector: '[cfFrame]',
  host: {
    class: 'cf-frame',
    '[class]': 'classes()',
    '[attr.data-rarity]': 'bracketRarity()',
  },
})
export class CfFrame {
  readonly cut = input<CfCut>('br');
  readonly cutSize = input<CfCutSize>('sm');
  readonly line = input<CfLine>('idle');
  readonly fill = input<'default' | 'none' | 'red' | 'solid' | 'cyan'>('default');
  readonly interactive = input(false, { transform: booleanAttribute });
  /** true = bracket vermelho; ou o nome de uma raridade para colorir. */
  readonly bracket = input<boolean | CfRarity | ''>(false);
  readonly notch = input(false, { transform: booleanAttribute });
  /** Fenda horizontal no meio da borda esquerda (acabamento dos botões do jogo). */
  readonly slot = input(false, { transform: booleanAttribute });

  protected readonly bracketRarity = computed(() => {
    const b = this.bracket();
    return typeof b === 'string' && b ? b : null;
  });

  protected readonly classes = computed(() => {
    const c = [`cf-cut-${this.cut()}`, `cf-cut-${this.cutSize()}`];
    if (this.line() !== 'idle') c.push(`cf-line-${this.line()}`);
    if (this.fill() !== 'default') c.push(`cf-fill-${this.fill()}`);
    if (this.interactive()) c.push('cf-interactive');
    const b = this.bracket();
    if (b === true || b === '' || typeof b === 'string') c.push('cf-bracket');
    if (this.notch()) c.push('cf-notch');
    if (this.slot()) c.push('cf-slot');
    return c.join(' ');
  });
}
