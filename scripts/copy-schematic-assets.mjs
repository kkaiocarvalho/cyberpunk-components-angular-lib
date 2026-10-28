// Copia os arquivos .json dos schematics (collection e schemas) para o pacote buildado.
import { cpSync, readdirSync, statSync, mkdirSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';

const src = 'projects/chamfer-ui/schematics';
const out = 'dist/chamfer-ui/schematics';

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith('.json')) {
      const dest = join(out, relative(src, p));
      mkdirSync(dirname(dest), { recursive: true });
      cpSync(p, dest);
    }
  }
}
walk(src);
console.log('schematics: assets copiados');
