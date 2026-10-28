// Sobe a versão da lib, faz commit e cria a tag. O push da tag dispara a publicação no npm.
//   npm run release -- patch | minor | major | 1.4.0 | prerelease
import { execSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';

const bump = process.argv[2];
if (!bump) {
  console.error('Uso: npm run release -- <patch|minor|major|prerelease|x.y.z>');
  process.exit(1);
}

const sh = (cmd) => execSync(cmd, { stdio: 'pipe' }).toString().trim();

if (sh('git status --porcelain')) {
  console.error('Há alterações não commitadas. Faça commit ou stash antes de lançar uma versão.');
  process.exit(1);
}

const pkgPath = 'projects/chamfer-ui/package.json';
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const [maj, min, pat] = pkg.version.split('-')[0].split('.').map(Number);
const pre = pkg.version.match(/-next\.(\d+)$/);

let next;
if (/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(bump)) next = bump;
else if (bump === 'major') next = `${maj + 1}.0.0`;
else if (bump === 'minor') next = `${maj}.${min + 1}.0`;
else if (bump === 'patch') next = pre ? `${maj}.${min}.${pat}` : `${maj}.${min}.${pat + 1}`;
else if (bump === 'prerelease') next = pre ? `${maj}.${min}.${pat}-next.${+pre[1] + 1}` : `${maj}.${min}.${pat + 1}-next.0`;
else {
  console.error(`Tipo de versão desconhecido: ${bump}`);
  process.exit(1);
}

pkg.version = next;
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');

execSync('npm run build:lib', { stdio: 'inherit' }); // garante que a versão nova compila
sh(`git add ${pkgPath}`);
sh(`git commit -m "release: v${next}"`);
sh(`git tag v${next}`);

console.log(`\nVersão v${next} pronta. Para publicar:\n\n  git push --follow-tags\n`);
