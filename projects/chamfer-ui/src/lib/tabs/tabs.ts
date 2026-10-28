import { ChangeDetectionStrategy, Component, ElementRef, computed, inject, input, model } from '@angular/core';
import { CfIcon, CfIconName } from '../icon/icon';

let uid = 0;

/**
 * <cf-tabs [(value)]="aba">
 *   <cf-tab-list>
 *     <button cfTab value="inv" icon="grid">Inventário</button>
 *     <button cfTab value="map" icon="map">Mapa</button>
 *   </cf-tab-list>
 *   <cf-tab-panel value="inv">…</cf-tab-panel>
 *   <cf-tab-panel value="map">…</cf-tab-panel>
 * </cf-tabs>
 */
@Component({
  selector: 'cf-tabs',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-tabs' },
  template: '<ng-content />',
})
export class CfTabs {
  readonly value = model<string>('');
  readonly baseId = `cf-tabs-${++uid}`;
}

@Component({
  selector: 'cf-tab-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-tabs__list', role: 'tablist', '(keydown)': 'onKey($event)' },
  template: '<ng-content />',
})
export class CfTabList {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef);

  protected onKey(e: KeyboardEvent): void {
    const keys: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    const tabs = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>('[role="tab"]:not([disabled])'));
    const i = tabs.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    let next: HTMLElement | undefined;
    if (e.key in keys) next = tabs[(i + keys[e.key] + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    if (!next) return;
    e.preventDefault();
    next.focus();
    next.click();
  }
}

@Component({
  selector: 'button[cfTab]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfIcon],
  host: {
    class: 'cf-tab',
    role: 'tab',
    type: 'button',
    '[id]': "tabs.baseId + '-tab-' + value()",
    '[attr.aria-controls]': "tabs.baseId + '-panel-' + value()",
    '[attr.aria-selected]': 'selected()',
    '[tabIndex]': 'selected() ? 0 : -1',
    '(click)': 'tabs.value.set(value())',
  },
  template: `@if (icon(); as i) { <cf-icon [name]="i" /> }<ng-content />`,
})
export class CfTab {
  protected readonly tabs = inject(CfTabs);
  readonly value = input.required<string>();
  readonly icon = input<CfIconName>();
  protected readonly selected = computed(() => this.tabs.value() === this.value());
}

@Component({
  selector: 'cf-tab-panel',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-tab-panel',
    role: 'tabpanel',
    tabindex: '0',
    '[id]': "tabs.baseId + '-panel-' + value()",
    '[attr.aria-labelledby]': "tabs.baseId + '-tab-' + value()",
    '[hidden]': '!active()',
  },
  template: `@if (active()) { <ng-content /> }`,
})
export class CfTabPanel {
  protected readonly tabs = inject(CfTabs);
  readonly value = input.required<string>();
  protected readonly active = computed(() => this.tabs.value() === this.value());
}
