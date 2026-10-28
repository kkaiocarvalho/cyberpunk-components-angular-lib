<div align="center">

# ◤ CHAMFER UI ◢

**Design system cyberpunk / FUI para Angular.**
Cantos chanfrados a 45°, linhas de 1px, vermelho como cor de sistema e ciano como destaque.
Componentes standalone com signals, prontos para `ngModel` e Reactive Forms.

**[▶ Demo ao vivo](https://cyberpunk-components-angular-lib.vercel.app)** · **[Referência HTML](https://cyberpunk-components-angular-lib.vercel.app/docs)**

![Angular](https://img.shields.io/badge/Angular-22-F75049?style=flat-square&labelColor=0E0E17)
![Standalone](https://img.shields.io/badge/standalone-signals-5EF6FF?style=flat-square&labelColor=0E0E17)
![Deps](https://img.shields.io/badge/dependências-0-1DED83?style=flat-square&labelColor=0E0E17)
![Border radius](https://img.shields.io/badge/border--radius-0px-F0B537?style=flat-square&labelColor=0E0E17)
![License](https://img.shields.io/badge/licença-MIT-D6D0D0?style=flat-square&labelColor=0E0E17)
[![CI](https://github.com/kkaiocarvalho/cyberpunk-components-angular-lib/actions/workflows/ci.yml/badge.svg)](https://github.com/kkaiocarvalho/cyberpunk-components-angular-lib/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/@kkaiocarvalho/chamfer-ui?style=flat-square&color=F75049&labelColor=0E0E17)](https://www.npmjs.com/package/@kkaiocarvalho/chamfer-ui)

</div>

---

## Sumário

- [O que é](#o-que-é)
- [Anatomia do estilo](#anatomia-do-estilo)
- [Instalação](#instalação)
- [Início rápido](#início-rápido)
- [Fundamentos](#fundamentos)
  - [Tokens de cor](#tokens-de-cor)
  - [Tipografia](#tipografia)
  - [Geometria e espaçamento](#geometria-e-espaçamento)
  - [Estados interativos](#estados-interativos)
  - [Primitiva de chanfro (`cfFrame`)](#primitiva-de-chanfro-cfframe)
- [Componentes](#componentes)
  - [Button](#button) · [Button group](#button-group)
  - [Badge](#badge) · [Kbd e Hints](#kbd-e-hints)
  - [Card](#card) · [Section header](#section-header)
  - [Field e Input](#field-e-input) · [Native select](#native-select)
  - [Checkbox](#checkbox) · [Radio group](#radio-group) · [Switch](#switch) · [Slider](#slider) · [Stepper](#stepper)
  - [Tabs](#tabs)
  - [Progress](#progress) · [Segments](#segments) · [Stat](#stat)
  - [Item cell](#item-cell)
  - [Table e Key/Value](#table-e-keyvalue)
  - [Alert](#alert) · [Toast](#toast) · [Dialog](#dialog)
  - [Tooltip](#tooltip) · [Menu e Dropdown](#menu-e-dropdown)
  - [Tile](#tile) · [Accordion](#accordion)
  - [Avatar](#avatar) · [Decoração](#decoração)
  - [Icon](#icon)
- [Formulários](#formulários)
- [Classes CSS utilitárias](#classes-css-utilitárias)
- [Temas e customização](#temas-e-customização)
- [Acessibilidade](#acessibilidade)
- [Uso sem Angular](#uso-sem-angular)
- [Desenvolvimento](#desenvolvimento)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Roadmap](#roadmap)
- [Créditos](#créditos)

---

## O que é

O Chamfer UI tem duas camadas:

1. **`chamfer.css`**: tokens, a primitiva de chanfro e o visual de todos os componentes. É CSS puro, funciona em qualquer stack.
2. **Componentes Angular**: wrappers standalone, `OnPush`, com `input()`, `model()` e `output()`. Eles cuidam de estado, teclado, ARIA e integração com formulários.

A ideia é a mesma do shadcn/ui: você usa os elementos nativos (`<button>`, `<input>`, `<table>`) e o sistema adiciona o estilo por atributo. Assim você mantém a semântica e a acessibilidade do HTML.

```html
<button cfButton variant="solid">Confirmar</button>
<cf-badge variant="rare">Raro</cf-badge>
<button cfItem label="Deck M2" rarity="legendary" amount="680" kind="Tech" icon="item-deck"></button>
```

## Anatomia do estilo

A linguagem visual foi extraída de um estudo da interface de *Cyberpunk 2077* (veja [Créditos](#créditos)). As regras são:

| Regra | Como aparece |
|---|---|
| **Zero arredondamento** | Nenhum `border-radius`. Todo canto é reto ou cortado a 45°. |
| **Chanfro padrão** | Células e botões cortam o canto **inferior-direito**. Painéis grandes cortam **dois cantos opostos** (superior-esquerdo e inferior-direito). |
| **Linha fina** | Contorno de 1px. A espessura se mantém igual inclusive na diagonal do corte. |
| **Bracket + gapper** | Barra vertical de 3px à esquerda, separada do corpo por uma fresta de 3px. Indica raridade, status ou seleção. |
| **Vermelho é sistema** | `#F75049` é a cor da interface, não de erro. Erro e aviso usam laranja. |
| **Ciano é destaque** | `#5EF6FF` marca hover, foco, valores numéricos e o item selecionado. |
| **Estados por opacidade** | Idle 30%, hover 100%, selecionado 40% de preenchimento, clique 70% (flash). |
| **Texto em caixa alta** | Labels, botões e títulos em uppercase com tracking largo. |

```
 ┌─┬┐┌──────────────────────────┐
 │ ││ │ DECK KIROSHI M2    [NOVO] │   ← célula: linha 1px + fundo
 │ ││ │                          │
 │ ││ │ ▮ 680             TECH  ╱    ← chanfro inferior-direito
 └─┴┘└────────────────────────╱
  │ └ gapper (3px)
  └── bracket (3px, cor da raridade)
```

---

## Instalação

**Requisitos:** Angular 22 ou superior.

```bash
ng add @kkaiocarvalho/chamfer-ui
```

Pronto. O `ng add` instala o pacote e configura o projeto:

| O que ele faz | Onde |
|---|---|
| Registra o `chamfer.css` como primeiro item de `styles` (build e test) | `angular.json` |
| Adiciona as fontes Rajdhani, Orbitron e Share Tech Mono do Google Fonts | `<head>` do `index.html` |
| Aplica `cf-root` (e `cf-screen`, opcional) no `<body>` | `index.html` |

Ele pergunta se você quer as fontes e o fundo com vinheta. Para pular as perguntas e aceitar o padrão, use `--defaults`. Em workspaces com mais de um app, informe `--project=<nome>`. Pode rodar de novo sem medo: nada é duplicado.

<details>
<summary><b>Instalação manual</b> (sem <code>ng add</code>)</summary>

```bash
npm install @kkaiocarvalho/chamfer-ui
```

**1. CSS:** no `angular.json`, em `projects.<app>.architect.build.options`:

```json
"styles": [
  "node_modules/@kkaiocarvalho/chamfer-ui/styles/chamfer.css",
  "src/styles.css"
]
```

**2. Fontes:** no `<head>` do `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap" />
```

Se você hospeda as fontes por conta própria, declare os `@font-face` com os mesmos nomes de família.

**3. Raiz:** `<body class="cf-root cf-screen">`. O `cf-root` define a fonte, a cor e o fundo base; o `cf-screen` adiciona a vinheta de fundo e é opcional.

</details>

---

## Início rápido

```ts
import { Component, inject, signal } from '@angular/core';
import { CHAMFER_UI, CfToastService } from '@kkaiocarvalho/chamfer-ui';

@Component({
  selector: 'app-root',
  imports: [CHAMFER_UI],
  template: `
    <cf-section-header heading="Central de rede" icon="radar" />

    <cf-card variant="panel" hot>
      <cf-card-header>
        <h3 cfCardTitle>Nó 0x4F2A</h3>
        <cf-badge variant="cyan" pulse>Online</cf-badge>
      </cf-card-header>
      <cf-progress label="Sincronizando" [value]="75" />
      <cf-card-footer>
        <button cfButton variant="solid" (click)="connect()">Conectar</button>
      </cf-card-footer>
    </cf-card>

    <cf-toaster />
  `,
})
export class App {
  private readonly toast = inject(CfToastService);
  connect() {
    this.toast.show({ heading: 'Conectado', variant: 'success' });
  }
}
```

`CHAMFER_UI` importa tudo de uma vez. Para um bundle mais enxuto, importe só o que usar:

```ts
import { CfButton, CfCard, CfCardHeader, CfCardTitle } from '@kkaiocarvalho/chamfer-ui';
```

---

## Fundamentos

### Tokens de cor

Todos os tokens são variáveis CSS em `:root`, com prefixo `--cf-`.

**Paleta principal**

| Token | Hex | Uso |
|---|---|---|
| `--cf-red` | `#F75049` | Texto, linhas, botões, títulos. A cor do sistema. |
| `--cf-cyan` | `#5EF6FF` | Hover, foco, números, aba e item selecionados. |
| `--cf-white` | `#FFFFFF` | Uso raro: ícones neutros. |
| `--cf-void` | `#0E0E17` | Fundo de tudo. |

**Paleta secundária (raridade e semântica)**

| Token | Hex | Raridade | Semântica |
|---|---|---|---|
| `--cf-grey` | `#D6D0D0` | Comum | Neutro |
| `--cf-mint` | `#1DED83` | Incomum | Sucesso |
| `--cf-steel` | `#2570D4` | Raro | Informação secundária |
| `--cf-violet` | `#9D2BF5` | Épico | — |
| `--cf-orange` | `#FB932E` | Lendário | Aviso e erro de validação |
| `--cf-gold` | `#F0B537` | Icônico | Moeda, missão, "novo" |

**Superfícies e texto**

| Token | Valor | Uso |
|---|---|---|
| `--cf-bg` / `--cf-bg-2` | `#0E0E17` / `#13121D` | Fundo da página |
| `--cf-surface` / `--cf-surface-2` | `#191722` / `#221D28` | Cards e painéis |
| `--cf-red-deep` | `#3A1418` | Preenchimentos avermelhados |
| `--cf-fg` | `#F2E9E8` | Texto principal |
| `--cf-fg-muted` | vermelho 72% | Texto secundário, labels |
| `--cf-fg-dim` | cinza 45% | Ajuda, desabilitado |

### Tipografia

| Token | Família | Papel |
|---|---|---|
| `--cf-font` | Rajdhani | Fonte de trabalho: UI, corpo e títulos |
| `--cf-font-disp` | Orbitron | Display: marca e títulos de impacto, com moderação |
| `--cf-font-mono` | Share Tech Mono | Micro-texto técnico decorativo, números de código |

**Escala:** `--cf-text-2xs` 11 · `xs` 12 · `sm` 14 · `md` 16 · `lg` 20 · `xl` 26 · `2xl` 36 · `3xl` 52 (px).

**Classes:** `cf-h1` a `cf-h4`, `cf-display`, `cf-label`, `cf-micro`, `cf-mono`, `cf-num` (tabular, ciano), `cf-p` (parágrafo com no máximo 65 caracteres por linha).

### Geometria e espaçamento

| Token | Valor | Uso |
|---|---|---|
| `--cf-bw` | `1px` | Espessura da linha |
| `--cf-cut-xs` … `--cf-cut-xl` | 4, 8, 12, 20, 32px | Tamanhos de chanfro |
| `--cf-gap-bracket` | `3px` | Largura do bracket |
| `--cf-gapper` | `3px` | Fresta entre bracket e corpo |
| `--cf-s1` … `--cf-s8` | 4, 8, 12, 16, 24, 32, 48, 64px | Escala de espaço |
| `--cf-fast` / `--cf-base` / `--cf-slow` | 90 / 160 / 320ms | Durações |
| `--cf-ease` | `cubic-bezier(.2,.8,.2,1)` | Curva padrão |

### Estados interativos

Os quatro estados vêm do manual de UI que serviu de referência e usam opacidades fixas:

| Estado | Linha | Fundo | Gatilho |
|---|---|---|---|
| **Idle** | vermelho 30% | void 95% | padrão |
| **Hover** | vermelho 100% | ciano 10% | `:hover`, `:focus-visible` |
| **Selecionado** | vermelho 100% | vermelho 40% | `aria-selected`, `aria-pressed`, `.is-active` |
| **Flash** | vermelho 100% | vermelho 70% | `:active`, `.is-flash` |

As cores de linha e fundo são as propriedades registradas `--cf-line` e `--cf-fill` (via `@property`). Por isso as transições entre estados são animadas.

### Primitiva de chanfro (`cfFrame`)

A peça central do sistema: qualquer elemento ganha cantos cortados e contorno.

```html
<section cfFrame cut="diag" cutSize="lg" line="hot">Painel</section>
<div cfFrame interactive bracket="epic">Clicável, com bracket violeta</div>
```

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `cut` | `'none' \| 'br' \| 'tl' \| 'tr' \| 'bl' \| 'diag' \| 'anti' \| 'all'` | `'br'` | Quais cantos cortar. `diag` corta superior-esquerdo e inferior-direito; `anti` corta os outros dois. |
| `cutSize` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Tamanho do corte. |
| `line` | `'idle' \| 'hot' \| 'cyan' \| 'none'` | `'idle'` | Cor da linha. |
| `fill` | `'default' \| 'none' \| 'red' \| 'solid' \| 'cyan'` | `'default'` | Preenchimento. |
| `interactive` | `boolean` | `false` | Ativa os quatro estados. |
| `bracket` | `boolean \| CfRarity` | `false` | Adiciona o bracket; uma raridade define a cor. |
| `notch` | `boolean` | `false` | Entalhe decorativo na borda esquerda. |

**Como funciona:** o elemento em si não é recortado, então foco, glow e tooltips continuam funcionando. Duas pseudo-camadas fazem o desenho:

- `::before` é a **linha**: um anel vazado, desenhado com `clip-path: polygon(evenodd, …)`.
- `::after` é o **fundo**: recuado pela espessura da linha. O chanfro interno é recalculado como `corte − bw·(2−√2)` para a diagonal ter a mesma espessura das retas.

Como a linha é um anel, o fundo pode ser translúcido sem a linha aparecer por baixo do conteúdo.

**Controle fino com variáveis:**

```css
.meu-painel {
  --cf-tl: 16px; --cf-tr: 0px; --cf-br: 16px; --cf-bl: 0px;   /* cada canto */
  --cf-line: var(--cf-cyan);
  --cf-fill: rgb(25 23 34 / .9);
}
```

---

## Componentes

> Convenção: componentes com seletor de **atributo** (`button[cfButton]`) estilizam o elemento nativo. Componentes com seletor de **elemento** (`<cf-card>`) são contêineres. Inputs que seriam atributos nativos do HTML foram renomeados para não colidir: `heading` em vez de `title`, `label` em vez de `name`, `kind` em vez de `type`.

### Button

`button[cfButton]`, `a[cfButton]`

```html
<button cfButton>Padrão</button>
<button cfButton variant="solid">Confirmar</button>
<button cfButton variant="cyan"><cf-icon name="radar" />Escanear</button>
<button cfButton variant="gold">Comprar</button>
<button cfButton variant="ghost">Cancelar</button>
<a cfButton variant="link" href="/detalhes">Ver detalhes</a>
<button cfButton size="icon" aria-label="Configurar"><cf-icon name="gear" /></button>
<button cfButton disabled>Bloqueado</button>
```

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `variant` | `'default' \| 'solid' \| 'cyan' \| 'gold' \| 'ghost' \| 'link'` | `'default'` | Estilo visual |
| `size` | `'sm' \| 'md' \| 'lg' \| 'icon' \| 'icon-sm'` | `'md'` | Altura e padding. `icon` deixa o botão quadrado. |
| `block` | `boolean` | `false` | Largura total |
| `pressed` | `boolean \| undefined` | `undefined` | Estado de toggle, vira `aria-pressed` |

Todo clique dispara o **flash** de 140ms automaticamente.

### Button group

`<cf-button-group>` ou `[cfButtonGroup]` junta botões segmentados. Só o último mantém o chanfro.

```html
<cf-button-group>
  <button cfButton size="sm" [pressed]="cat() === 'hw'" (click)="cat.set('hw')">Hardware</button>
  <button cfButton size="sm" [pressed]="cat() === 'misc'" (click)="cat.set('misc')">Diversos</button>
</cf-button-group>
```

### Badge

```html
<cf-badge>Padrão</cf-badge>
<cf-badge variant="solid">Ativo</cf-badge>
<cf-badge variant="cyan" pulse>Online</cf-badge>
<cf-badge variant="new">Novo</cf-badge>
<cf-badge variant="legendary">Lendário</cf-badge>
<cf-badge variant="cyan" count>3</cf-badge>
```

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `variant` | `'default' \| 'solid' \| 'cyan' \| 'new' \| 'mint' \| 'steel' \| 'violet' \| 'orange' \| 'grey'` ou uma raridade | `'default'` | Raridades (`common`…`iconic`) são mapeadas para a cor certa |
| `pulse` | `boolean` | `false` | Ponto piscante antes do texto |
| `count` | `boolean` | `false` | Formato de contador (mono, sem chanfro) |

### Kbd e Hints

```html
<cf-kbd>Esc</cf-kbd>
<cf-kbd round>X</cf-kbd>

<cf-hints>
  <cf-hint key="L" round>Navegar</cf-hint>
  <cf-hint key="Enter">Selecionar</cf-hint>
  <cf-hint key="Esc">Voltar</cf-hint>
</cf-hints>
```

| Componente | Input | Descrição |
|---|---|---|
| `cf-kbd` | `round: boolean` | Tecla circular (botões de controle) |
| `cf-hint` | `key: string` (obrigatório), `round: boolean` | Tecla + rótulo |

### Card

```html
<cf-card variant="panel" hot corners>
  <cf-card-header>
    <h3 cfCardTitle>Contrato · Sombra</h3>
    <cf-badge variant="new">Missão</cf-badge>
  </cf-card-header>
  <p class="cf-p">Conteúdo do card.</p>
  <cf-card-footer>
    <button cfButton variant="ghost" size="sm">Logs</button>
    <button cfButton size="sm">Abrir</button>
  </cf-card-footer>
</cf-card>
```

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `variant` | `'default' \| 'panel' \| 'glass'` | `'default'` | `panel` corta dois cantos; `glass` tem fundo translúcido com blur |
| `hot` | `boolean` | `false` | Linha 100% vermelha |
| `corners` | `boolean` | `false` | Marcadores quadrados nos cantos |

Subcomponentes: `cf-card-header`, `[cfCardTitle]` e `cf-card-footer`.

### Section header

Ícone em moldura, título, régua horizontal com sublinhado ciano e descrição opcional.

```html
<cf-section-header heading="Inventário" icon="grid" description="10/50 slots ocupados" />
<cf-section-header heading="Atributos" tone="red" [level]="3">
  <cf-badge variant="cyan">3 pontos</cf-badge>   <!-- conteúdo extra vai na linha do título -->
</cf-section-header>
```

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `heading` | `string` | obrigatório | Texto do título |
| `icon` | `CfIconName` | — | Ícone à esquerda |
| `description` | `string` | — | Linha abaixo da régua |
| `tone` | `'cyan' \| 'red'` | `'cyan'` | Cor do título |
| `level` | `1 \| 2 \| 3` | `2` | Nível do heading (`h1`/`h2`/`h3`) |

### Field e Input

```html
<cf-field label="Codinome" for="handle" help="Visível para o seu grupo." [error]="erro()">
  <cf-input-group icon="user" [invalid]="!!erro()">
    <input cfInput id="handle" [(ngModel)]="codinome" />
  </cf-input-group>
</cf-field>

<cf-field label="Relatório" for="notes">
  <cf-input-group multiline>
    <textarea cfInput id="notes"></textarea>
  </cf-input-group>
</cf-field>
```

| Componente | Inputs |
|---|---|
| `cf-field` | `label`, `for` (id do controle), `help`, `error` (quando preenchido, substitui `help` e usa `role="alert"`) |
| `cf-input-group` | `icon`, `invalid` (linha laranja), `multiline` (para textarea) |
| `input[cfInput]`, `textarea[cfInput]` | — (aplica o estilo de texto) |

A moldura do `cf-input-group` acende em ciano com `:focus-within`.

### Native select

Usa o `<select>` nativo, que é acessível, leve e mostra o seletor do sistema no celular.

```html
<cf-native-select>
  <select cfSelect id="district" formControlName="district">
    <option value="centro">Centro</option>
    <option value="leste">Distrito leste</option>
  </select>
</cf-native-select>
```

Input: `invalid: boolean`.

### Checkbox

```html
<cf-checkbox [(checked)]="criptografar">Criptografar</cf-checkbox>
<cf-checkbox formControlName="terms">Aceito os protocolos</cf-checkbox>
```

| API | Tipo | Descrição |
|---|---|---|
| `checked` | `model<boolean>` | Two-way binding |
| `disabled` | `boolean` | Desabilita |
| `id` | `string` | Id do input interno (gerado automaticamente) |

Implementa `ControlValueAccessor`.

### Radio group

Opções em losango.

```html
<cf-radio-group [(value)]="acesso" orientation="vertical">
  <cf-radio value="pub">Público</cf-radio>
  <cf-radio value="priv">Privado</cf-radio>
  <cf-radio value="ghost" disabled>Fantasma</cf-radio>
</cf-radio-group>
```

| Componente | API |
|---|---|
| `cf-radio-group` | `value: model<T>`, `name`, `orientation: 'horizontal' \| 'vertical'`, `disabled`. Implementa `ControlValueAccessor`. |
| `cf-radio` | `value: T` (obrigatório), `disabled` |

### Switch

```html
<cf-switch [(checked)]="escudo">Escudo</cf-switch>
<cf-switch formControlName="notify" onLabel="SIM" offLabel="NÃO">Notificações</cf-switch>
```

| API | Tipo | Padrão |
|---|---|---|
| `checked` | `model<boolean>` | `false` |
| `showState` | `boolean` | `true` (mostra ON/OFF) |
| `onLabel` / `offLabel` | `string` | `'ON'` / `'OFF'` |
| `disabled` | `boolean` | `false` |

Usa `role="switch"`. Implementa `ControlValueAccessor`.

### Slider

```html
<cf-slider label="Potência" [(value)]="potencia" [min]="0" [max]="100" [step]="5" unit="%" />
```

| API | Tipo | Padrão |
|---|---|---|
| `value` | `model<number>` | `0` |
| `label`, `unit` | `string` | — |
| `min`, `max`, `step` | `number` | `0`, `100`, `1` |
| `showValue` | `boolean` | `true` |

O preenchimento da trilha acompanha o valor. Implementa `ControlValueAccessor`.

### Stepper

O contador `− 8 +` das telas de atributo.

```html
<cf-stepper label="Reflexos" [(value)]="reflexos" [min]="3" [max]="20" />
```

| API | Tipo | Padrão |
|---|---|---|
| `value` | `model<number>` | `0` |
| `min`, `max`, `step` | `number` | `0`, `99`, `1` |
| `label` | `string` | Usado no `aria-label` dos botões |

Os botões são desabilitados nos limites. O valor é anunciado via `aria-live`. Implementa `ControlValueAccessor`.

### Tabs

Navegação superior com sublinhado ciano e glow.

```html
<cf-tabs [(value)]="aba">
  <cf-tab-list>
    <cf-kbd>Q</cf-kbd>
    <button cfTab value="inv" icon="grid">Inventário</button>
    <button cfTab value="map" icon="map">Mapa</button>
    <cf-kbd>E</cf-kbd>
  </cf-tab-list>
  <cf-tab-panel value="inv">…</cf-tab-panel>
  <cf-tab-panel value="map">…</cf-tab-panel>
</cf-tabs>
```

| Componente | API |
|---|---|
| `cf-tabs` | `value: model<string>` |
| `cf-tab-list` | Teclado: `←` `→` `Home` `End` |
| `button[cfTab]` | `value: string` (obrigatório), `icon` |
| `cf-tab-panel` | `value: string` (obrigatório). O conteúdo só é renderizado quando a aba está ativa. |

Os IDs e os atributos `aria-controls`, `aria-labelledby`, `aria-selected` e o `tabindex` móvel são gerados automaticamente.

### Progress

```html
<cf-progress label="Sincronizando banco" [value]="75" caption="Pacote 3 de 4" />
<cf-progress label="Escaneando" tone="cyan" indeterminate />
<cf-progress [value]="3" [max]="4" thick [showValue]="false" />
```

| Input | Tipo | Padrão |
|---|---|---|
| `value`, `max` | `number` | `0`, `100` |
| `label`, `caption` | `string` | — |
| `tone` | `'red' \| 'cyan'` | `'red'` |
| `thick` | `boolean` | `false` |
| `indeterminate` | `boolean` | `false` (barra de varredura) |
| `showValue` | `boolean` | `true` |

Conteúdo extra no cabeçalho: projete um elemento com `cfProgressMeta`.

### Segments

Barra segmentada (vida, munição, carga).

```html
<cf-segments [total]="10" [value]="6" />
<cf-segments [total]="5" [value]="3" tone="cyan" />
```

Inputs: `total` (10), `value` (0), `tone` (`'red' | 'cyan'`). Usa `role="meter"`.

### Stat

```html
<cf-stat label="Latência" value="18" unit="ms" delta="▼ 4 ms" deltaDir="down" />
<cf-stat label="Créditos" value="15 251" tone="gold" />
```

| Input | Tipo | Padrão |
|---|---|---|
| `label`, `value` | `string`, `string \| number` | obrigatórios |
| `unit`, `delta` | `string` | — |
| `deltaDir` | `'up' \| 'down' \| 'none'` | `'none'` |
| `tone` | `'cyan' \| 'red' \| 'gold' \| 'mint'` | `'cyan'` |

### Item cell

A peça mais característica do sistema: a célula de inventário com bracket de raridade. Serve para produtos, arquivos, cards de feed e listas selecionáveis.

```html
<cf-item-grid>
  @for (it of itens; track it.id) {
    <button cfItem
      [label]="it.nome" [rarity]="it.raridade" [tag]="it.tag"
      [amount]="it.preco" [kind]="it.tipo" icon="item-deck"
      [selected]="selecionado() === it.id"
      (click)="selecionado.set(it.id)">
    </button>
  }
</cf-item-grid>
```

| Input | Tipo | Padrão | Descrição |
|---|---|---|---|
| `label` | `string` | obrigatório | Nome (truncado com reticências) |
| `rarity` | `'common' \| 'uncommon' \| 'rare' \| 'epic' \| 'legendary' \| 'iconic'` | `'common'` | Cor do bracket |
| `tag` | `string` | — | Badge no canto superior |
| `tagVariant` | `CfBadgeVariant` | a raridade | Cor do badge |
| `amount` | `string \| number` | — | Valor em ciano no rodapé |
| `kind` | `string` | — | Categoria em vermelho no rodapé |
| `icon` | `CfIconName` | — | Ilustração central (use os ícones `item-*`) |
| `selected` | `boolean` | `false` | Estado selecionado (`aria-pressed`) |

Para mídia própria (uma imagem, por exemplo), projete um elemento com o atributo `cfItemMedia`. `cf-item-grid` é uma grade responsiva com colunas de no mínimo 190px.

### Table e Key/Value

```html
<cf-table-container>
  <table cfTable>
    <thead><tr><th>Nó</th><th>Status</th><th cfNum>Latência</th></tr></thead>
    <tbody>
      <tr><td>0x4F2A</td><td><cf-badge variant="cyan">Estável</cf-badge></td><td cfNum>18 ms</td></tr>
    </tbody>
  </table>
</cf-table-container>

<dl cfKv>
  <dt>Latência</dt><dd>18 ms</dd>
  <dt>Uptime</dt><dd>99,97%</dd>
</dl>
```

- `cf-table-container` faz a rolagem horizontal em telas estreitas.
- `table[cfTable]` cria linhas espaçadas, com barra vermelha à esquerda, que vira ciano no hover.
- `[cfNum]` em `td`/`th` alinha o número à direita, em ciano e tabular.
- `dl[cfKv]` cria uma lista chave/valor com linhas tracejadas.

### Alert

```html
<cf-alert heading="Intrusão detectada" dismissible (dismissed)="fechar()">
  Três tentativas de acesso no nó 0x4F2A.
</cf-alert>
<cf-alert variant="info" heading="Atualização disponível">Firmware 2.1 pronto.</cf-alert>
<cf-alert variant="success" heading="Contrato concluído" />
<cf-alert variant="warning" heading="Sinal fraco" />
<cf-alert variant="quest" heading="Nova missão" icon="pin">Vá até o porto.</cf-alert>
```

| API | Tipo | Padrão |
|---|---|---|
| `heading` | `string` | obrigatório |
| `variant` | `'default' \| 'info' \| 'success' \| 'warning' \| 'quest'` | `'default'` |
| `icon` | `CfIconName` | um ícone por variante |
| `dismissible` | `boolean` | `false` |
| `(dismissed)` | `output<void>` | — |

As variantes `default` e `warning` usam `role="alert"`; as outras usam `role="status"`.

### Toast

Coloque `<cf-toaster />` **uma vez** no componente raiz e use o serviço:

```ts
private readonly toast = inject(CfToastService);

this.toast.show({ heading: 'Contrato concluído', variant: 'success' });
this.toast.show({ heading: 'Intrusão', body: 'Nó 0x1B07 bloqueado.', duration: 0 }); // fica até fechar
```

| Método | Descrição |
|---|---|
| `show(opts): number` | Mostra e retorna o id. `opts`: `heading`, `body?`, `variant?`, `duration?` (ms, padrão 4200, `0` = manual) |
| `dismiss(id)` | Fecha com a animação de glitch |
| `clear()` | Fecha todos |
| `toasts` | `signal` com a lista atual (útil para testes ou para um toaster próprio) |

O toast entra deslizando e sai com glitch. O toaster é uma região `aria-live="polite"`.

### Dialog

Construído sobre o `<dialog>` nativo, então foco preso, `Esc` e camada de topo vêm de graça. Abre com um "scan" vertical.

```html
<button cfButton variant="solid" (click)="aberto.set(true)">Apagar registros</button>

<cf-dialog [(open)]="aberto" heading="Apagar 1 204 registros?">
  <p class="cf-p">Essa ação não pode ser desfeita.</p>
  <div cfDialogActions>
    <button cfButton variant="ghost" (click)="aberto.set(false)">Cancelar</button>
    <button cfButton variant="solid" (click)="apagar()">Apagar</button>
  </div>
</cf-dialog>
```

| API | Tipo | Padrão |
|---|---|---|
| `open` | `model<boolean>` | `false` |
| `heading` | `string` | obrigatório (vira `aria-labelledby`) |
| `closeOnBackdrop` | `boolean` | `true` |

### Tooltip

Diretiva em qualquer elemento, inclusive nos chanfrados. O balão é renderizado no `<body>`, então nunca é cortado por `overflow`.

```html
<button cfButton size="icon" cfTooltip="Abre o diagnóstico" aria-label="Diagnóstico">
  <cf-icon name="gear" />
</button>
<span cfTooltip="Latência média" tooltipTone="red" tooltipPlacement="bottom" tabindex="0">18 ms</span>
```

Inputs: `cfTooltip` (texto), `tooltipTone` (`'cyan' | 'red'`) e `tooltipPlacement` (`'top' | 'bottom'`, inverte sozinho se não houver espaço). Aparece no hover e no foco, some com `Esc` e liga `aria-describedby` automaticamente.

### Menu e Dropdown

```html
<cf-dropdown [(open)]="menuAberto" align="end">
  <button cfButton cfDropdownTrigger>Ações <cf-icon name="chevronDown" /></button>
  <cf-menu>
    <cf-menu-label>Nó 0x4F2A</cf-menu-label>
    <button cfMenuItem icon="plug" shortcut="C" (click)="conectar()">Conectar</button>
    <button cfMenuItem icon="search" shortcut="S">Escanear</button>
    <cf-menu-separator />
    <button cfMenuItem icon="power">Desligar</button>
  </cf-menu>
</cf-dropdown>
```

| Componente | API |
|---|---|
| `cf-dropdown` | `open: model<boolean>`, `align: 'start' \| 'end'`, `side: 'bottom' \| 'top'`, `closeOnSelect: boolean` (padrão `true`) |
| `[cfDropdownTrigger]` | Gerencia `aria-haspopup` e `aria-expanded` |
| `cf-menu` | `role="menu"`, navegação com `↑` `↓` |
| `button[cfMenuItem]` | `icon`, `shortcut` |
| `cf-menu-label`, `cf-menu-separator` | — |

O dropdown fecha com `Esc` (o foco volta ao gatilho), clique fora ou seleção de item. Ao abrir, o foco vai para o primeiro item. `cf-menu` também funciona sozinho, como menu fixo.

### Tile

O botão grande de hub, com ícone em losango e texto ciano.

```html
<a cfTile icon="map" routerLink="/mapa">Mapa</a>
<button cfTile icon="chip" bracket="legendary">Fabricação</button>
```

Inputs: `icon` e `bracket` (`boolean` ou raridade).

### Accordion

Usa `<details>`/`<summary>` nativos.

```html
<cf-accordion exclusive>
  <cf-accordion-item heading="Protocolos de acesso" [open]="true">Chaves rotacionam a cada 24h.</cf-accordion-item>
  <cf-accordion-item heading="Espelhos de dados">Três espelhos ativos.</cf-accordion-item>
</cf-accordion>
```

| Componente | API |
|---|---|
| `cf-accordion` | `exclusive: boolean`: só um item aberto por vez (usa o atributo nativo `name` do `<details>`) |
| `cf-accordion-item` | `heading` (obrigatório), `open: model<boolean>` |

### Avatar

Retrato com o canto inferior-direito cortado. Fotos recebem um filtro avermelhado.

```html
<cf-avatar initials="KS" online />
<cf-avatar src="/foto.jpg" alt="Kestrel" [size]="64" />
```

Inputs: `src`, `alt`, `initials`, `size` (px, padrão 48), `online`.

### Decoração

Use com moderação: uma ou duas decorações por tela.

```html
<cf-glitch class="cf-h2" text="Sinal perdido" />      <!-- glitch RGB periódico -->
<cf-divider variant="tick" />                          <!-- solid | dashed | tick -->
<cf-skeleton width="60%" height="12px" />              <!-- placeholder com shimmer -->
<cf-spinner label="Carregando" />                      <!-- grade 3×3 piscando -->
<cf-sysblock>Protocolo 2077-SAK<br />Acesso autorizado</cf-sysblock>
```

### Icon

Kit próprio com mais de 50 ícones no traço angular do sistema: traço 1,6px e cantos chanfrados.

```html
<cf-icon name="radar" />
```

O tamanho segue o `font-size` (`1em`). Dentro de botões, abas, inputs e tiles o tamanho já vem ajustado.

| Categoria | Nomes |
|---|---|
| Interface | `grid` `menu` `more` `search` `filter` `sort` `gear` `close` `check` `plus` `minus` `edit` `copy` `link` `trash` `upload` `download` |
| Navegação | `arrowRight` `arrowLeft` `chevronDown` `chevronRight` `home` `map` `pin` |
| Status | `warn` `info` `bolt` `bell` `signal` `wifi` `power` `shield` `lock` `unlock` `eye` |
| Pessoas e comunicação | `user` `users` `chat` `mail` `calendar` `clock` |
| Sistema | `chip` `plug` `terminal` `radar` `target` `file` `folder` |
| Comércio | `cart` `credit` `heart` `star` |
| Ilustração de item (64×36) | `item-deck` `item-drone` `item-visor` `item-module` |

Para adicionar ícones, edite `CF_ICONS` em `projects/chamfer-ui/src/lib/icon/icon.ts`. O tipo `CfIconName` é derivado das chaves, então o autocomplete funciona automaticamente.

---

## Formulários

Todos os controles de valor implementam `ControlValueAccessor` e também expõem `model()`. Os três estilos funcionam:

```html
<!-- signals puros -->
<cf-switch [(checked)]="escudo" />

<!-- template-driven -->
<cf-slider [(ngModel)]="potencia" name="potencia" />

<!-- reactive forms -->
<form [formGroup]="form">
  <cf-stepper formControlName="level" [min]="1" [max]="5" />
  <cf-radio-group formControlName="access">…</cf-radio-group>
</form>
```

| Controle | Valor |
|---|---|
| `cf-checkbox`, `cf-switch` | `boolean` |
| `cf-radio-group` | o `value` do `cf-radio` escolhido |
| `cf-slider`, `cf-stepper` | `number` |
| `input[cfInput]`, `textarea[cfInput]`, `select[cfSelect]` | nativos (usam os accessors padrão do Angular) |

`disable()` e `enable()` do formulário são respeitados. O `touched` é marcado no blur.

**Exibindo erros:** passe a mensagem para `cf-field [error]` e marque o grupo com `[invalid]`:

```ts
err(name: string) {
  const c = this.form.get(name)!;
  if (!c.touched || c.valid) return null;
  if (c.hasError('required')) return 'Campo obrigatório';
  if (c.hasError('pattern')) return 'Use o formato XXXX-XXXX';
  return 'Valor inválido';
}
```

```html
<cf-field label="Chave" for="key" [error]="err('key')">
  <cf-input-group icon="lock" [invalid]="!!err('key')">
    <input cfInput id="key" formControlName="key" />
  </cf-input-group>
</cf-field>
```

O app demo tem um formulário reativo completo em `projects/demo`.

---

## Classes CSS utilitárias

Disponíveis em qualquer template, com ou sem os componentes.

| Grupo | Classes |
|---|---|
| Base | `cf-root`, `cf-screen` (fundo com vinheta), `cf-grid-bg` (grade 32px), `cf-scanlines` |
| Texto | `cf-h1`…`cf-h4`, `cf-display`, `cf-label`, `cf-micro`, `cf-mono`, `cf-num`, `cf-p`, `cf-glow`, `cf-glow-cyan` |
| Cor de texto | `cf-text-red`, `cf-text-cyan`, `cf-text-gold`, `cf-text-mint`, `cf-text-muted`, `cf-text-dim` |
| Layout | `cf-stack` (grid vertical), `cf-row` (flex com wrap), `cf-grid` (grade de itens) |
| Chanfro | `cf-frame` + `cf-cut-{br,tl,tr,bl,diag,anti,all,none}` + `cf-cut-{xs,sm,md,lg,xl}` |
| Linha e fundo | `cf-line-{hot,cyan,none}`, `cf-fill-{none,red,solid,cyan}` |
| Detalhes | `cf-bracket` (+ `data-rarity`), `cf-notch`, `cf-interactive`, `cf-corners` + `cf-corner--{tl,tr,bl,br}` |
| Decoração | `cf-divider`, `cf-divider--{dashed,tick}`, `cf-skeleton`, `cf-dot`, `cf-dot--pulse`, `cf-rail`, `cf-sysblock` |

---

## Temas e customização

Todo o sistema lê os tokens, então um tema novo é só sobrescrever variáveis. Exemplo de um tema **ciano** (para uma interface "civil" em vez de "militar"):

```css
.theme-civil {
  --cf-red: #5EF6FF;                       /* cor de sistema passa a ser ciano */
  --cf-cyan: #F0B537;                      /* destaque passa a ser dourado */
  --cf-line-idle: rgb(94 246 255 / .30);
  --cf-line-hot:  rgb(94 246 255 / 1);
  --cf-fill-act:  rgb(94 246 255 / .25);
  --cf-fill-flash: rgb(94 246 255 / .60);
  --cf-fill-hover: rgb(240 181 55 / .10);
  --cf-fg-muted: rgb(94 246 255 / .72);
  --cf-red-deep: #0F2A30;
}
```

```html
<section class="theme-civil">…tudo aqui dentro muda…</section>
```

Outras personalizações comuns:

```css
:root {
  --cf-cut-sm: 6px;          /* chanfros mais sutis */
  --cf-bw: 2px;              /* linhas mais grossas */
  --cf-font: "Barlow Semi Condensed", sans-serif;
}
```

Para um componente específico, os mesmos tokens funcionam inline: `<cf-card style="--cf-fill: rgb(14 14 23 / .6)">`.

---

## Acessibilidade

- **HTML nativo primeiro:** botões são `<button>`, o select é `<select>`, o dialog é `<dialog>` e o acordeão é `<details>`.
- **Teclado:** abas com `←` `→` `Home` `End`; menu com `↑` `↓`; `Esc` fecha dialog, dropdown e tooltip; o foco volta ao gatilho.
- **ARIA automático:** `aria-selected` e `aria-controls` nas abas, `aria-pressed` em toggles e itens, `aria-expanded` e `aria-haspopup` no dropdown, `aria-describedby` no tooltip, `role="switch"`, `role="meter"` e `role="progressbar"` com valores.
- **Foco visível:** contorno ciano em todo elemento focável. Nos chanfrados, a própria linha do chanfro fica ciano.
- **Movimento reduzido:** com `prefers-reduced-motion`, animações e glitch são desligados.
- **Contraste:** o vermelho `#F75049` sobre `#0E0E17` tem contraste de aproximadamente 5,6:1 e o ciano, de aproximadamente 14:1. Ambos passam no AA para texto normal.

> Ícones decorativos usam `aria-hidden`. Em botões só com ícone, sempre passe um `aria-label`.

---

## Uso sem Angular

O CSS é independente. Em qualquer projeto (HTML puro, React, Vue, Svelte):

```html
<link rel="stylesheet" href="chamfer.css" />
<script src="vanilla/chamfer.js" defer></script>   <!-- opcional: abas, dialog, stepper, toast -->

<body class="cf-root cf-screen">
  <button class="cf-btn cf-btn--solid">Confirmar</button>
  <span class="cf-badge cf-badge--cyan">Online</span>
  <div class="cf-card cf-card--panel">…</div>
</body>
```

A pasta [`docs/`](docs/) tem a página de referência em HTML com todos os componentes e o código de cada um para copiar. A pasta [`vanilla/`](vanilla/) tem o JS mínimo (3 KB) que liga os comportamentos por `data-attributes` (`data-cf-tabs`, `data-cf-open`, `data-cf-stepper`, `ChamferUI.toast({...})`).

---

## Desenvolvimento

```bash
npm install
npm start            # builda a lib e sobe o app demo em http://localhost:4200
```

| Script | O que faz |
|---|---|
| `npm start` | Builda a lib e roda `ng serve demo` |
| `npm run watch:lib` | Rebuilda a lib a cada mudança (rode junto com `ng serve demo` em outro terminal) |
| `npm run build` | Build de produção da lib e do demo |
| `npm run build:lib` | Gera o pacote em `dist/chamfer-ui` (formato Angular Package Format) |
| `npm run pack:lib` | Gera o `.tgz` instalável |
| `npm run build:schematics` | Compila o schematic `ng add` (já incluído no `build:lib`) |
| `npm run release -- <tipo>` | Sobe a versão, faz commit e cria a tag (veja abaixo) |
| `npm test` | Testes da lib |

O demo importa a lib por `@kkaiocarvalho/chamfer-ui`, mapeado no `tsconfig.json` para `dist/chamfer-ui`. Por isso a lib precisa estar buildada antes de subir o demo.

### Testando o `ng add` localmente

```bash
npm run pack:lib                       # gera dist/chamfer-ui/kkaiocarvalho-chamfer-ui-x.y.z.tgz
cd ../algum-app-angular
ng add ../cyberpunk-components-angular-lib/dist/chamfer-ui/kkaiocarvalho-chamfer-ui-x.y.z.tgz
```

### Lançando uma versão

A publicação no npm é automática. Quando uma tag `vX.Y.Z` chega ao GitHub, o workflow [`release.yml`](.github/workflows/release.yml):

1. confere se a tag bate com a versão em `projects/chamfer-ui/package.json`;
2. builda a lib e o schematic;
3. publica no npm com [provenance](https://docs.npmjs.com/generating-provenance-statements) (o selo de "build verificado" no npmjs.com);
4. cria a GitHub Release com as notas geradas a partir dos commits.

Para lançar:

```bash
npm run release -- patch      # 0.1.0 → 0.1.1  (correções)
npm run release -- minor      # 0.1.0 → 0.2.0  (componentes novos)
npm run release -- major      # 0.1.0 → 1.0.0  (mudanças que quebram a API)
npm run release -- prerelease # 0.1.1-next.0   (publicado na tag "next" do npm)
git push --follow-tags
```

O script se recusa a rodar com alterações não commitadas e builda a lib antes de criar a tag.

**Configuração inicial (uma vez só):**

1. Crie uma conta em [npmjs.com](https://www.npmjs.com/signup) com o usuário `kkaiocarvalho` (o escopo `@kkaiocarvalho` é o seu usuário).
2. Em **Access Tokens → Generate New Token → Granular Access Token**, crie um token com permissão de leitura e escrita para pacotes.
3. No GitHub, em **Settings → Secrets and variables → Actions → New repository secret**, salve o token com o nome `NPM_TOKEN`.

A primeira versão (`0.1.0`) já está no `package.json`. Para publicá-la, crie a tag direto: `git tag v0.1.0 && git push --tags`.

### Integração contínua

O workflow [`ci.yml`](.github/workflows/ci.yml) roda em todo push e PR. Ele builda a lib e o demo, gera o `.tgz` e, num app Angular criado do zero, roda o `ng add`, confere as alterações e builda o app usando os componentes. Se o `ng add` quebrar, o CI avisa antes de qualquer publicação.

### Criando um componente novo

1. Crie o arquivo em `projects/chamfer-ui/src/lib/<grupo>/`.
2. Siga o padrão: `standalone` (padrão), `ChangeDetectionStrategy.OnPush`, `input()`, `model()`, `output()`, classes aplicadas via `host`.
3. Escreva o CSS em `projects/chamfer-ui/styles/chamfer.css`, usando só tokens. Se o elemento for chanfrado, adicione o seletor ao grupo da primitiva de chanfro (seção 3 do CSS).
4. Exporte em `src/public-api.ts` e adicione ao array `CHAMFER_UI` em `src/lib/chamfer.ts`.
5. Mostre o componente no demo e documente aqui.

---

## Estrutura do repositório

```
.
├── projects/
│   ├── chamfer-ui/                  # a biblioteca
│   │   ├── styles/
│   │   │   ├── chamfer.css          # tokens + primitiva + todos os componentes
│   │   │   └── chamfer-fonts.css    # @import do Google Fonts (opcional)
│   │   └── src/
│   │       ├── public-api.ts
│   │       └── lib/
│   │           ├── chamfer.ts       # CHAMFER_UI (import de tudo)
│   │           ├── core/            # CfFrame e tipos (CfCut, CfRarity…)
│   │           ├── icon/            # CfIcon + CF_ICONS
│   │           ├── button/          # CfButton, CfButtonGroup
│   │           ├── badge/           # CfBadge, CfKbd, CfHints, CfHint
│   │           ├── card/            # CfCard e partes, CfSectionHeader
│   │           ├── form/            # Field, InputGroup, Input, Select, Checkbox, Radio, Switch, Slider, Stepper
│   │           ├── tabs/            # CfTabs, CfTabList, CfTab, CfTabPanel
│   │           ├── data/            # Progress, Segments, Stat, Item, Table, Kv
│   │           ├── feedback/        # Alert, Toast (serviço + toaster), Dialog
│   │           ├── overlay/         # Tooltip, Menu, Dropdown
│   │           ├── navigation/      # Tile, Accordion
│   │           └── decor/           # Avatar, Glitch, Divider, Skeleton, Spinner, Sysblock
│   └── demo/                        # app de demonstração (componentes, painel, formulário)
├── projects/chamfer-ui/schematics/   # schematic do ng add
├── scripts/                         # release.mjs e cópia de assets do schematic
├── .github/workflows/               # ci.yml e release.yml
├── docs/index.html                  # referência visual em HTML puro
├── vanilla/chamfer.js               # comportamentos para uso sem framework
├── angular.json
└── package.json
```

---

## Roadmap

- [x] Pipeline de publicação no npm (tag → publish com provenance)
- [ ] Primeira versão publicada no npm
- [x] Demo e docs publicados na Vercel
- [ ] Combobox com busca, Date picker, Paginação, Breadcrumb
- [ ] Sidebar de aplicação e Command palette (`Ctrl+K`)
- [ ] Drawer e File upload
- [ ] Componentes de assinatura: HUD/minimapa, grade de hacking, terminal com digitação, transição de tela com glitch
- [ ] Temas prontos (`civil`, `terminal-verde`, `ouro`)
- [x] Schematic `ng add` (CSS, fontes e classes do `<body>`)
- [x] CI com teste do `ng add` num app novo
- [ ] Testes unitários por componente e testes visuais de regressão

---

## Créditos

A linguagem visual deste projeto é um **estudo inspirado** na interface de *Cyberpunk 2077*, a partir do portfólio público de Vladimír Vilimovský (Senior UI Artist na CD PROJEKT RED): [Cyberpunk 2077 — User Interface (Part 2)](https://www.behance.net/gallery/133185623/Cyberpunk-2077User-Interface-(Part-2)).

Este é um projeto de fã, independente e sem afiliação com a CD PROJEKT RED. Nenhum asset, logo ou arte do jogo é incluído: os componentes, ícones e o código são originais. As fontes Rajdhani, Orbitron e Share Tech Mono são distribuídas pelo Google Fonts sob a SIL Open Font License.

**Licença:** [MIT](LICENSE) © Kaio Sergio
