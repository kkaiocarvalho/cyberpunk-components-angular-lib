import {
  ChangeDetectionStrategy, Component, Directive, ElementRef, booleanAttribute, computed, forwardRef,
  ModelSignal, inject, input, model, numberAttribute, signal,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { CfIcon, CfIconName } from '../icon/icon';

let uid = 0;
const nextId = (p: string) => `${p}-${++uid}`;

/* -------------------------------------------------------------------------- */
/* Base para controles com ControlValueAccessor + model()                      */
/* Funciona com [(ngModel)], formControl, e também só com [(value)].          */
/* -------------------------------------------------------------------------- */
@Directive()
abstract class CfValueControl<T> implements ControlValueAccessor {
  abstract readonly value: ModelSignal<T>;
  readonly disabledInput = input(false, { alias: 'disabled', transform: booleanAttribute });
  protected readonly formDisabled = signal(false);
  readonly isDisabled = computed(() => this.disabledInput() || this.formDisabled());

  private onChange: (v: T) => void = () => {};
  protected onTouched: () => void = () => {};

  protected commit(v: T): void {
    this.value.set(v);
    this.onChange(v);
  }
  writeValue(v: T): void { if (v !== null && v !== undefined) this.value.set(v); }
  registerOnChange(fn: (v: T) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
  setDisabledState(d: boolean): void { this.formDisabled.set(d); }
}

/* -------------------------------------------------------------------------- */
/* Field: label + controle + ajuda/erro                                       */
/* -------------------------------------------------------------------------- */
/**
 * <cf-field label="Codinome" for="handle" help="Visível para o grupo" [error]="erro()">
 *   <cf-input-group icon="user"><input cfInput id="handle" /></cf-input-group>
 * </cf-field>
 */
@Component({
  selector: 'cf-field',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-field' },
  template: `
    @if (label()) { <label class="cf-field__label" [attr.for]="for() || null">{{ label() }}</label> }
    <ng-content />
    @if (error()) { <span class="cf-field__error" role="alert">{{ error() }}</span> }
    @else if (help()) { <span class="cf-field__help">{{ help() }}</span> }
  `,
})
export class CfField {
  readonly label = input<string>();
  readonly for = input<string>();
  readonly help = input<string>();
  readonly error = input<string | null>();
}

/** Moldura chanfrada que envolve input/textarea/select. */
@Component({
  selector: 'cf-input-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CfIcon],
  host: { class: 'cf-input-wrap', '[class.is-invalid]': 'invalid()', '[class.cf-input-wrap--textarea]': 'multiline()' },
  template: `@if (icon(); as i) { <cf-icon [name]="i" /> }<ng-content />`,
})
export class CfInputGroup {
  readonly icon = input<CfIconName>();
  readonly invalid = input(false, { transform: booleanAttribute });
  readonly multiline = input(false, { transform: booleanAttribute });
}

/** <input cfInput> / <textarea cfInput> — estilo de texto sem borda própria. */
@Directive({
  selector: 'input[cfInput], textarea[cfInput]',
  host: { '[class.cf-input]': '!isTextarea', '[class.cf-textarea]': 'isTextarea' },
})
export class CfInput {
  protected readonly isTextarea = inject(ElementRef).nativeElement.tagName === 'TEXTAREA';
}

/**
 * Select nativo estilizado (acessível e leve):
 * <cf-native-select><select cfSelect [(ngModel)]="d"><option>Centro</option></select></cf-native-select>
 */
@Component({
  selector: 'cf-native-select',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'cf-input-wrap cf-input-wrap--select', '[class.is-invalid]': 'invalid()' },
  template: `<ng-content /><span class="cf-select-caret" aria-hidden="true"></span>`,
})
export class CfNativeSelect {
  readonly invalid = input(false, { transform: booleanAttribute });
}

@Directive({ selector: 'select[cfSelect]', host: { class: 'cf-select' } })
export class CfSelect {}

/* -------------------------------------------------------------------------- */
/* Checkbox                                                                    */
/* -------------------------------------------------------------------------- */
/** <cf-checkbox [(checked)]="cripto">Criptografar</cf-checkbox> ou com [(ngModel)] / formControl */
@Component({
  selector: 'cf-checkbox',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CfCheckbox), multi: true }],
  template: `
    <label class="cf-check">
      <input type="checkbox" [id]="id()" [checked]="value()" [disabled]="isDisabled()"
             (change)="commit($any($event.target).checked)" (blur)="onTouched()" />
      <ng-content />
    </label>
  `,
})
export class CfCheckbox extends CfValueControl<boolean> {
  readonly value = model(false, { alias: 'checked' });
  readonly id = input(nextId('cf-check'));
}

/* -------------------------------------------------------------------------- */
/* Radio group (losangos)                                                      */
/* -------------------------------------------------------------------------- */
/**
 * <cf-radio-group [(value)]="acesso">
 *   <cf-radio value="pub">Público</cf-radio>
 *   <cf-radio value="priv">Privado</cf-radio>
 * </cf-radio-group>
 */
@Component({
  selector: 'cf-radio-group',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CfRadioGroup), multi: true }],
  host: { class: 'cf-radio-group', role: 'radiogroup', '[class.cf-radio-group--col]': "orientation() === 'vertical'" },
  template: '<ng-content />',
})
export class CfRadioGroup<T = string> extends CfValueControl<T | null> {
  readonly value = model<T | null>(null);
  readonly name = input(nextId('cf-radio'));
  readonly orientation = input<'horizontal' | 'vertical'>('horizontal');
  select(v: T): void { this.commit(v); this.onTouched(); }
}

@Component({
  selector: 'cf-radio',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <label class="cf-check">
      <input type="radio" [name]="group.name()" [checked]="group.value() === value()"
             [disabled]="group.isDisabled() || disabled()" (change)="group.select(value())" />
      <ng-content />
    </label>
  `,
})
export class CfRadio<T = string> {
  protected readonly group = inject<CfRadioGroup<T>>(CfRadioGroup);
  readonly value = input.required<T>();
  readonly disabled = input(false, { transform: booleanAttribute });
}

/* -------------------------------------------------------------------------- */
/* Switch                                                                      */
/* -------------------------------------------------------------------------- */
/** <cf-switch [(checked)]="escudo">Escudo</cf-switch> */
@Component({
  selector: 'cf-switch',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CfSwitch), multi: true }],
  template: `
    <label class="cf-switch">
      <input type="checkbox" role="switch" [id]="id()" [checked]="value()" [disabled]="isDisabled()"
             (change)="commit($any($event.target).checked)" (blur)="onTouched()" />
      <span><ng-content /></span>
      @if (showState()) { <span class="cf-switch__state">{{ value() ? onLabel() : offLabel() }}</span> }
    </label>
  `,
})
export class CfSwitch extends CfValueControl<boolean> {
  readonly value = model(false, { alias: 'checked' });
  readonly id = input(nextId('cf-switch'));
  readonly showState = input(true, { transform: booleanAttribute });
  readonly onLabel = input('ON');
  readonly offLabel = input('OFF');
}

/* -------------------------------------------------------------------------- */
/* Slider                                                                      */
/* -------------------------------------------------------------------------- */
/** <cf-slider label="Potência" [(value)]="potencia" [min]="0" [max]="100" /> */
@Component({
  selector: 'cf-slider',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CfSlider), multi: true }],
  host: { class: 'cf-field' },
  template: `
    @if (label() || showValue()) {
      <span class="cf-row" style="justify-content:space-between">
        <label class="cf-field__label" [for]="id()">{{ label() }}</label>
        @if (showValue()) { <span class="cf-num">{{ value() }}{{ unit() }}</span> }
      </span>
    }
    <input class="cf-range" type="range" [id]="id()" [min]="min()" [max]="max()" [step]="step()"
           [value]="value()" [disabled]="isDisabled()" [style.--val]="percent()"
           (input)="commit(+$any($event.target).value)" (blur)="onTouched()" />
  `,
})
export class CfSlider extends CfValueControl<number> {
  readonly value = model(0);
  readonly id = input(nextId('cf-slider'));
  readonly label = input<string>();
  readonly unit = input('');
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(100, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  readonly showValue = input(true, { transform: booleanAttribute });
  protected readonly percent = computed(
    () => `${((this.value() - this.min()) / (this.max() - this.min() || 1)) * 100}%`,
  );
}

/* -------------------------------------------------------------------------- */
/* Stepper (− 8 +)                                                             */
/* -------------------------------------------------------------------------- */
/** <cf-stepper [(value)]="reflexos" [min]="3" [max]="20" label="Reflexos" /> */
@Component({
  selector: 'cf-stepper',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => CfStepper), multi: true }],
  host: { class: 'cf-stepper', role: 'group', '[attr.aria-label]': 'label() || null' },
  template: `
    <button type="button" class="cf-stepper__btn" [disabled]="isDisabled() || value() <= min()"
            (click)="change(-step())" [attr.aria-label]="'Diminuir ' + (label() ?? '')">−</button>
    <output class="cf-stepper__value" aria-live="polite">{{ value() }}</output>
    <button type="button" class="cf-stepper__btn" [disabled]="isDisabled() || value() >= max()"
            (click)="change(step())" [attr.aria-label]="'Aumentar ' + (label() ?? '')">+</button>
  `,
})
export class CfStepper extends CfValueControl<number> {
  readonly value = model(0);
  readonly label = input<string>();
  readonly min = input(0, { transform: numberAttribute });
  readonly max = input(99, { transform: numberAttribute });
  readonly step = input(1, { transform: numberAttribute });
  protected change(d: number): void {
    this.commit(Math.min(this.max(), Math.max(this.min(), this.value() + d)));
    this.onTouched();
  }
}
