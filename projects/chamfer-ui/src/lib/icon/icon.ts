import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Kit de ícones no traço angular do Chamfer UI.
 * Todos em viewBox 24x24 (exceto os "item" 64x36), traço 1.6, cantos chanfrados.
 */
export const CF_ICONS = {
  grid: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h6v4l-2 2h-4z"/>',
  user: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M8 4h8v7l-2 2H8zM4 21v-3l3-3h10l3 3v3"/>',
  users: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 5h6v5l-2 2H6zM2 20v-3l2-2h8l2 2v3M15 5h4v5l-1 1h-3M16 15h3l3 2v3"/>',
  chip: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M7 7h10v8l-2 2H7zM10 3v4M14 3v4M10 17v4M14 17v4M3 10h4M3 14h4M17 10h4M17 14h4"/>',
  map: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2zM9 4v16M15 6v16"/>',
  bolt: '<path fill="currentColor" d="M13 2 4 14h6l-1 8 9-12h-6z"/>',
  search: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 4h10v8l-2 2H4zM14 14l6 6"/>',
  warn: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3 2 21h20zM12 10v5M12 17v2"/>',
  info: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 3h16v14l-4 4H4zM12 10v6M12 7v1"/>',
  check: '<path fill="none" stroke="currentColor" stroke-width="2" d="M4 12l5 5L20 6"/>',
  close: '<path fill="none" stroke="currentColor" stroke-width="2" d="M5 5l14 14M19 5 5 19"/>',
  plus: '<path fill="none" stroke="currentColor" stroke-width="2" d="M12 4v16M4 12h16"/>',
  minus: '<path fill="none" stroke="currentColor" stroke-width="2" d="M4 12h16"/>',
  gear: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M9 3h6l1 3 3 1v6l-3 1-1 3H9l-1-3-3-1V7l3-1zM10 10h4v4h-4z"/>',
  plug: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M8 3v5M16 3v5M5 8h14v4l-4 4H9l-4-4zM12 16v5"/>',
  lock: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M7 10V6l2-3h6l2 3v4M4 10h16v9l-2 2H4zM12 14v3"/>',
  unlock: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M7 10V6l2-3h6l2 3M4 10h16v9l-2 2H4zM12 14v3"/>',
  eye: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M2 12l5-6h10l5 6-5 6H7zM10 10h4v4h-4z"/>',
  terminal: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 4h18v14l-2 2H3zM7 9l3 3-3 3M12 15h5"/>',
  signal: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 20v-3M9 20v-7M14 20v-11M19 20V4"/>',
  wifi: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M2 9l4-3h12l4 3M5 13l3-2h8l3 2M9 17l1-1h4l1 1M12 20v.5"/>',
  cart: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M2 4h3l3 11h11l2-8H7M9 19h2M16 19h2"/>',
  credit: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 6h18v10l-2 2H3zM3 10h18M6 14h4"/>',
  heart: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 20 3 11V6l2-2h4l3 3 3-3h4l2 2v5z"/>',
  star: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 3l2.5 6H21l-5 4 2 7-6-4-6 4 2-7-5-4h6.5z"/>',
  bell: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 17V9l3-5h6l3 5v8l2 2H4zM10 21h4"/>',
  mail: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 5h18v12l-2 2H3zM3 6l9 7 9-7"/>',
  chat: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 4h18v11l-2 2h-9l-5 4v-4H3z"/>',
  calendar: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 6h18v13l-2 2H3zM3 10h18M8 3v5M16 3v5"/>',
  clock: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M8 3h8l5 5v8l-5 5H8l-5-5V8zM12 7v5l3 3"/>',
  pin: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 3h12v9l-6 9-6-9zM10 7h4v4h-4z"/>',
  home: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 11 12 3l9 8v8l-2 2H3zM10 21v-6h4v6"/>',
  file: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M5 3h10l4 4v14H5zM15 3v4h4M8 12h8M8 16h5"/>',
  folder: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 5h7l2 2h9v11l-2 2H3z"/>',
  upload: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 16V4M7 9l5-5 5 5M4 15v5h14l2-2v-3"/>',
  download: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 4v12M7 11l5 5 5-5M4 15v5h14l2-2v-3"/>',
  trash: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 6h16M9 6V3h6v3M6 6l1 15h8l2-2 1-13M10 10v7M14 10v7"/>',
  edit: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M4 20v-4L16 4l4 4L8 20zM13 7l4 4"/>',
  copy: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M8 8h12v10l-2 2H8zM4 16V4h12"/>',
  link: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M10 14l4-4M8 10l-4 4 2 4h4l2-2M16 14l4-4-2-4h-4l-2 2"/>',
  filter: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M3 4h18l-7 8v6l-4 2v-8z"/>',
  sort: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M7 4v16M3 16l4 4 4-4M17 20V4M13 8l4-4 4 4"/>',
  menu: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 6h18M3 12h18M3 18h12"/>',
  more: '<path fill="currentColor" d="M5 10h3v3H5zM10.5 10h3v3h-3zM16 10h3v3h-3z"/>',
  arrowRight: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M4 12h15M13 6l6 6-6 6"/>',
  arrowLeft: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M20 12H5M11 6l-6 6 6 6"/>',
  chevronDown: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M5 9l7 7 7-7"/>',
  chevronRight: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M9 5l7 7-7 7"/>',
  power: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M12 3v8M7 6 4 9v7l4 4h8l4-4V9l-3-3"/>',
  shield: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 3l8 3v6l-3 6-5 3-5-3-3-6V6z"/>',
  target: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M12 2v5M12 17v5M2 12h5M17 12h5M8 8h8v8H8z"/>',
  radar: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M8 3h8l5 5v8l-5 5H8l-5-5V8zM12 12l6-6M10 10h4v4h-4z"/>',
  phone: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4l-2 2C10 21 3 14 3 5z"/>',
  phoneOff: '<path fill="none" stroke="currentColor" stroke-width="1.8" d="M3 14c5-5 13-5 18 0l-2 3-4-1v-3c-2-1-4-1-6 0v3l-4 1z"/>',
  video: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M3 6h12v10l-2 2H3zM15 10l6-4v12l-6-4"/>',
  videoOff: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M3 6h12v10l-2 2H3zM15 10l6-4v12l-6-4M2 2l20 20"/>',
  mic: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M9 3h6v10l-2 2h-4zM5 11v2l4 5h6l4-5v-2M12 18v3"/>',
  micOff: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M9 3h6v10l-2 2h-4zM5 11v2l4 5h6l4-5v-2M12 18v3M3 3l18 18"/>',
  volume: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M3 9h4l5-4v14l-5-4H3zM16 9c1 1 1 5 0 6M19 6c3 3 3 9 0 12"/>',
  bellOff: '<path fill="none" stroke="currentColor" stroke-width="1.6" d="M6 17V9l3-5h6l3 5v8l2 2H4zM10 21h4M3 3l18 18"/>',
  logout: '<path fill="none" stroke="currentColor" stroke-width="1.7" d="M14 4H5v16h9M10 12h11M17 8l4 4-4 4"/>',
  /* ilustrações de item (64x36) */
  'item-deck': '<path fill="none" stroke="currentColor" stroke-width="1.4" d="M6 10h40l6 4h6v8H34l-4 6h-8l2-6H6zM12 14h16M10 18h4"/>',
  'item-drone': '<path fill="none" stroke="currentColor" stroke-width="1.4" d="M22 14h20l4 6H18zM8 10h12M44 10h12M14 10v4M50 10v4M28 20v6h8v-6"/>',
  'item-visor': '<path fill="none" stroke="currentColor" stroke-width="1.4" d="M10 12h44l-4 12H38l-6-4-6 4H14zM18 16h8M38 16h8"/>',
  'item-module': '<path fill="none" stroke="currentColor" stroke-width="1.4" d="M20 6h24v20l-4 4H20zM26 12h12v8H26zM14 12h6M14 20h6M44 12h6M44 20h6"/>',
} as const;

export type CfIconName = keyof typeof CF_ICONS;

/**
 * <cf-icon name="search" />
 * Tamanho herda de font-size (1em) ou do CSS do componente pai.
 */
@Component({
  selector: 'cf-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'aria-hidden': 'true', '[innerHTML]': 'svg()' },
  template: '',
})
export class CfIcon {
  private readonly sanitizer = inject(DomSanitizer);
  readonly name = input.required<CfIconName>();

  protected readonly svg = computed<SafeHtml>(() => {
    const n = this.name();
    const wide = n.startsWith('item-');
    return this.sanitizer.bypassSecurityTrustHtml(
      `<svg viewBox="0 0 ${wide ? '64 36' : '24 24'}" xmlns="http://www.w3.org/2000/svg">${CF_ICONS[n] ?? ''}</svg>`,
    );
  });
}
