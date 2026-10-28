# @kkaiocarvalho/chamfer-ui

Design system cyberpunk/FUI para Angular 22+: cantos chanfrados a 45°, linhas de 1px, componentes standalone com signals e suporte completo a formulários.

```bash
ng add @kkaiocarvalho/chamfer-ui
```

O `ng add` registra o CSS no `angular.json`, adiciona as fontes ao `index.html` e aplica as classes do `<body>`.

```ts
import { CHAMFER_UI } from '@kkaiocarvalho/chamfer-ui';

@Component({ imports: [CHAMFER_UI], template: `<button cfButton variant="solid">Confirmar</button>` })
```

Documentação completa: https://github.com/kkaiocarvalho/cyberpunk-components-angular-lib#readme

MIT © Kaio Sergio
