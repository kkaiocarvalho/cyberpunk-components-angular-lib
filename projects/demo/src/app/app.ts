import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CHAMFER_UI, CfObjectiveStep, CfToastService } from '@kkaiocarvalho/chamfer-ui';

interface NetNode { id: string; district: string; status: 'Estável' | 'Instável' | 'Offline'; latency: number | null; load: number }

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CHAMFER_UI, ReactiveFormsModule, JsonPipe],
  templateUrl: './app.html',
})
export class App {
  protected readonly toast = inject(CfToastService);
  private readonly fb = inject(FormBuilder);

  protected readonly view = signal('components');

  /* ---- aba Jogo ---- */
  protected readonly themes = [
    { id: 'default', label: 'Padrão' }, { id: 'yellow', label: 'Amarelo' },
    { id: 'netrunner', label: 'Netrunner' }, { id: 'arasaka', label: 'Arasaka' },
  ];
  protected readonly theme = signal('default');
  protected readonly fxScan = signal(false);
  protected readonly fxGrain = signal(false);
  protected readonly fxVignette = signal(false);
  private readonly titles = ['NIGHT CITY', 'CONEXÃO SEGURA', 'BRAÇO GORILA MK.2', 'CONTRATO ACEITO'];
  protected readonly title = signal(this.titles[0]);
  protected readonly hp = signal(420);
  protected readonly shieldHp = signal(200);
  protected readonly ram = signal(10);
  protected readonly objUpdated = signal(false);
  protected readonly steps = signal<CfObjectiveStep[]>([
    { text: 'Encontre Dex no Afterlife', done: true },
    { text: 'Fale com Jackie' },
    { text: 'Compre um cyberdeck (opcional)', optional: true },
  ]);
  protected readonly bootKey = signal(true);

  protected nextTitle() { this.title.set(this.titles[(this.titles.indexOf(this.title()) + 1) % this.titles.length]); }
  protected hit() {
    if (this.shieldHp() > 0) this.shieldHp.set(Math.max(0, this.shieldHp() - 70));
    else this.hp.set(Math.max(0, this.hp() - 85));
  }
  protected heal() { this.hp.set(420); this.shieldHp.set(200); }
  protected choice(key: string) {
    if (key === '1') {
      this.steps.update((l) => l.map((s, i) => (i === 1 ? { ...s, done: true } : s)));
      this.objUpdated.set(true);
      setTimeout(() => this.objUpdated.set(false), 1600);
      this.toast.show({ heading: 'Missão atualizada', body: 'Siga para o ponto marcado.', variant: 'quest' });
    } else if (key === '5') {
      this.toast.show({ heading: 'Conversa encerrada' });
    }
  }
  protected reboot() { this.bootKey.set(false); setTimeout(() => this.bootKey.set(true), 30); }
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
