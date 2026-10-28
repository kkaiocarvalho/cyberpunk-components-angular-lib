import { ChangeDetectionStrategy, Component, booleanAttribute, input, numberAttribute } from '@angular/core';

/** <cf-avatar initials="KS" online /> · <cf-avatar src="/foto.jpg" alt="Kestrel" [size]="64" /> */
@Component({
  selector: 'cf-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-avatar', '[class.cf-avatar--online]': 'online()', '[style.--size.px]': 'size()' },
  template: `@if (src()) { <img [src]="src()" [alt]="alt()" /> } @else { {{ initials() }} }`,
})
export class CfAvatar {
  readonly src = input<string>();
  readonly alt = input('');
  readonly initials = input('');
  readonly size = input(48, { transform: numberAttribute });
  readonly online = input(false, { transform: booleanAttribute });
}

/** Texto com glitch RGB: <cf-glitch text="Sinal perdido" class="cf-h2" /> */
@Component({
  selector: 'cf-glitch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-glitch', '[attr.data-text]': 'text()' },
  template: '{{ text() }}',
})
export class CfGlitch {
  readonly text = input.required<string>();
}

/** <cf-divider variant="tick" /> */
@Component({
  selector: 'cf-divider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'cf-divider', role: 'separator', style: 'display:block',
    '[class.cf-divider--dashed]': "variant() === 'dashed'",
    '[class.cf-divider--tick]': "variant() === 'tick'",
  },
  template: '',
})
export class CfDivider {
  readonly variant = input<'solid' | 'dashed' | 'tick'>('solid');
}

/** <cf-skeleton width="60%" /> */
@Component({
  selector: 'cf-skeleton',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-skeleton', 'aria-hidden': 'true', style: 'display:block', '[style.width]': 'width()', '[style.height]': 'height()' },
  template: '',
})
export class CfSkeleton {
  readonly width = input('100%');
  readonly height = input('12px');
}

/** Loader de 9 quadrados. */
@Component({
  selector: 'cf-spinner',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-spinner', role: 'status', '[attr.aria-label]': 'label()' },
  template: `@for (i of cells; track i) { <i></i> }`,
})
export class CfSpinner {
  readonly label = input('Carregando');
  protected readonly cells = [0, 1, 2, 3, 4, 5, 6, 7, 8];
}

/** Bloco de micro-texto de sistema com a marca listrada. */
@Component({
  selector: 'cf-sysblock',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-sysblock' },
  template: `<span class="cf-sysblock__mark" aria-hidden="true"></span><div class="cf-micro"><ng-content /></div>`,
})
export class CfSysblock {}
