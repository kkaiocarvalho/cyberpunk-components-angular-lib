import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CHAMFER_UI, CfToastService } from '@kkaiocarvalho/chamfer-ui';

interface NetNode { id: string; district: string; status: 'Estável' | 'Instável' | 'Offline'; latency: number | null; load: number }

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAMFER_UI, ReactiveFormsModule, JsonPipe],
  templateUrl: './app.html',
})
export class App {
  private readonly toast = inject(CfToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly view = signal('components');
  protected readonly invTab = signal('inv');
  protected readonly selectedItem = signal(1);
  protected readonly dialogOpen = signal(false);
  protected readonly menuOpen = signal(false);

  protected readonly encrypt = signal(true);
  protected readonly stealth = signal(false);
  protected readonly shield = signal(true);
  protected readonly power = signal(70);
  protected readonly reflex = signal(8);
  protected readonly access = signal('pub');

  protected readonly items = [
    { id: 1, label: 'Deck Kiroshi M2', rarity: 'legendary', tag: 'Novo', tagVariant: 'new', amount: 680, kind: 'Tech', icon: 'item-deck' },
    { id: 2, label: 'Drone vigia', rarity: 'epic', tag: 'Épico', amount: 450, kind: 'Suporte', icon: 'item-drone' },
    { id: 3, label: 'Visor tático', rarity: 'rare', tag: 'Raro', amount: 156, kind: 'Óptica', icon: 'item-visor' },
    { id: 4, label: 'Módulo de memória', rarity: 'uncommon', tag: 'Incomum', amount: 50, kind: 'Peça', icon: 'item-module' },
  ] as const;

  protected readonly nodes: NetNode[] = [
    { id: '0x4F2A', district: 'Leste', status: 'Estável', latency: 18, load: 42 },
    { id: '0x1B07', district: 'Porto', status: 'Instável', latency: 96, load: 88 },
    { id: '0x77E0', district: 'Centro', status: 'Estável', latency: 22, load: 51 },
    { id: '0x9C11', district: 'Centro', status: 'Offline', latency: null, load: 0 },
  ];

  protected readonly form = this.fb.nonNullable.group({
    handle: ['Kestrel', [Validators.required, Validators.minLength(3)]],
    key: ['4F2A-00', [Validators.required, Validators.pattern(/^[A-F0-9]{4}-[A-F0-9]{4}$/)]],
    district: ['leste'],
    access: ['pub'],
    level: [3],
    bandwidth: [60],
    notify: [true],
    terms: [false, Validators.requiredTrue],
    notes: [''],
  });

  protected statusVariant(s: NetNode['status']) {
    return s === 'Estável' ? 'cyan' : s === 'Instável' ? 'orange' : 'solid';
  }

  protected toastDefault() { this.toast.show({ heading: 'Intrusão detectada', body: 'Nó 0x4F2A bloqueado.' }); }
  protected toastInfo() { this.toast.show({ heading: 'Sinal recebido', variant: 'info' }); }
  protected toastQuest() { this.toast.show({ heading: 'Missão atualizada', body: 'Novo objetivo no mapa.', variant: 'quest' }); }

  protected wipe() {
    this.dialogOpen.set(false);
    this.toast.show({ heading: 'Registros apagados', body: '1 204 entradas removidas.', variant: 'success' });
  }

  protected submit() {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      this.toast.show({ heading: 'Corrija os campos marcados', variant: 'warning' });
      return;
    }
    this.toast.show({ heading: 'Operador registrado', body: `Codinome ${this.form.getRawValue().handle}.`, variant: 'success' });
  }

  protected err(name: 'handle' | 'key' | 'terms'): string | null {
    const c = this.form.controls[name];
    if (!c.touched || c.valid) return null;
    if (c.hasError('required')) return 'Campo obrigatório';
    if (c.hasError('requiredTrue')) return 'Aceite para continuar';
    if (c.hasError('minlength')) return 'Mínimo de 3 caracteres';
    if (c.hasError('pattern')) return 'Use o formato XXXX-XXXX (hex)';
    return 'Valor inválido';
  }
}
