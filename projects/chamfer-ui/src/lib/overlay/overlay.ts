import {
  ChangeDetectionStrategy, Component, Directive, ElementRef, OnDestroy, booleanAttribute, inject, input, model,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CfKbd } from '../badge/badge';
import { CfIcon, CfIconName } from '../icon/icon';

/* -------------------------------------------------------------------------- */
/* Tooltip                                                                     */
/* -------------------------------------------------------------------------- */
/**
 * Funciona em qualquer elemento, inclusive nos chanfrados (renderiza no <body>).
 * <button cfButton cfTooltip="Abre o diagnóstico">…</button>
 */
@Directive({
  selector: '[cfTooltip]',
  host: {
    '(mouseenter)': 'show()', '(focusin)': 'show()',
    '(mouseleave)': 'hide()', '(focusout)': 'hide()', '(keydown.escape)': 'hide()',
  },
})
export class CfTooltip implements OnDestroy {
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly doc = inject(DOCUMENT);
  private static seq = 0;
  private tip?: HTMLElement;

  readonly cfTooltip = input.required<string>();
  readonly tooltipTone = input<'cyan' | 'red'>('cyan');
  readonly tooltipPlacement = input<'top' | 'bottom'>('top');

  protected show(): void {
    if (this.tip || !this.cfTooltip()) return;
    const tip = this.doc.createElement('div');
    tip.className = 'cf-tooltip' + (this.tooltipTone() === 'red' ? ' cf-tooltip--red' : '');
    tip.id = `cf-tip-${++CfTooltip.seq}`;
    tip.setAttribute('role', 'tooltip');
    tip.textContent = this.cfTooltip();
    this.doc.body.appendChild(tip);
    const r = this.host.nativeElement.getBoundingClientRect();
    const t = tip.getBoundingClientRect();
    const vw = this.doc.documentElement.clientWidth;
    const left = Math.max(8, Math.min(vw - t.width - 8, r.left + r.width / 2 - t.width / 2));
    let top = this.tooltipPlacement() === 'top' ? r.top - t.height - 8 : r.bottom + 8;
    if (top < 8) top = r.bottom + 8;
    tip.style.left = `${left}px`;
    tip.style.top = `${top}px`;
    this.host.nativeElement.setAttribute('aria-describedby', tip.id);
    this.tip = tip;
  }
  protected hide(): void {
    this.tip?.remove();
    this.tip = undefined;
    this.host.nativeElement.removeAttribute('aria-describedby');
  }
  ngOnDestroy(): void { this.hide(); }
}

/* -------------------------------------------------------------------------- */
/* Menu                                                                        */
/* -------------------------------------------------------------------------- */
@Component({
  selector: 'cf-menu',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-menu', role: 'menu', '(keydown)': 'onKey($event)' },
  template: '<ng-content />',
})
export class CfMenu {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  protected onKey(e: KeyboardEvent): void {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault();
    const items = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>('[role="menuitem"]:not([disabled])'));
    const i = items.indexOf(document.activeElement as HTMLElement);
    items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length]?.focus();
  }
}

/** <button cfMenuItem icon="plug" shortcut="C">Conectar</button> */
@Component({
  selector: 'button[cfMenuItem], a[cfMenuItem]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfIcon, CfKbd],
  host: { class: 'cf-menu__item', role: 'menuitem' },
  template: `
    @if (icon(); as i) { <cf-icon [name]="i" style="width:14px;height:14px" /> }
    <ng-content />
    @if (shortcut()) { <cf-kbd>{{ shortcut() }}</cf-kbd> }
  `,
})
export class CfMenuItem {
  readonly icon = input<CfIconName>();
  readonly shortcut = input<string>();
}

@Component({
  selector: 'cf-menu-separator',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-menu__sep', role: 'separator' },
  template: '',
})
export class CfMenuSeparator {}

@Component({
  selector: 'cf-menu-label',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-menu__label cf-label' },
  template: '<ng-content />',
})
export class CfMenuLabel {}

/* -------------------------------------------------------------------------- */
/* Dropdown (trigger + menu)                                                   */
/* -------------------------------------------------------------------------- */
/**
 * <cf-dropdown [(open)]="menuAberto">
 *   <button cfButton cfDropdownTrigger>Ações</button>
 *   <cf-menu>…</cf-menu>
 * </cf-dropdown>
 * Fecha com Esc, clique fora ou clique num item.
 */
@Component({
  selector: 'cf-dropdown',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-dropdown',
    '[class.cf-dropdown--end]': "align() === 'end'",
    '[class.cf-dropdown--top]': "side() === 'top'",
    '(document:click)': 'onDocClick($event)',
    '(keydown.escape)': 'close(true)',
  },
  template: `
    <span (click)="toggle()" style="display:contents"><ng-content select="[cfDropdownTrigger]" /></span>
    @if (open()) {
      <div class="cf-dropdown__panel" (click)="closeOnSelect() && close(true)"><ng-content /></div>
    }
  `,
})
export class CfDropdown {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);
  readonly open = model(false);
  readonly align = input<'start' | 'end'>('start');
  readonly side = input<'bottom' | 'top'>('bottom');
  readonly closeOnSelect = input(true, { transform: booleanAttribute });

  protected toggle(): void {
    this.open.update((v) => !v);
    if (this.open()) {
      queueMicrotask(() => this.el.nativeElement.querySelector<HTMLElement>('[role="menuitem"]')?.focus());
    }
  }
  close(refocus = false): void {
    if (!this.open()) return;
    this.open.set(false);
    if (refocus) this.el.nativeElement.querySelector<HTMLElement>('[cfDropdownTrigger]')?.focus();
  }
  protected onDocClick(e: MouseEvent): void {
    if (!this.el.nativeElement.contains(e.target as Node)) this.close();
  }
}

@Directive({
  selector: '[cfDropdownTrigger]',
  host: { 'aria-haspopup': 'menu', '[attr.aria-expanded]': 'dropdown.open()' },
})
export class CfDropdownTrigger {
  protected readonly dropdown = inject(CfDropdown);
}
