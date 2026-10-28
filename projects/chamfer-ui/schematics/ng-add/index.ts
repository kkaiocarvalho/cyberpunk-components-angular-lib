import { Rule, SchematicContext, SchematicsException, Tree, chain } from '@angular-devkit/schematics';
import { readWorkspace, updateWorkspace } from '@schematics/angular/utility';
import { Schema } from './schema';

const PKG = '@kkaiocarvalho/chamfer-ui';
const CSS_PATH = `node_modules/${PKG}/styles/chamfer.css`;
const FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;500;700;900&family=Share+Tech+Mono&display=swap';

type StyleEntry = string | { input: string; [k: string]: unknown };

/** Resolve o nome do projeto: o informado, o único app do workspace, ou erro claro. */
async function resolveProject(tree: Tree, options: Schema) {
  const workspace = await readWorkspace(tree);
  let name = options.project;
  if (!name) {
    const apps = [...workspace.projects.entries()].filter(([, p]) => p.extensions['projectType'] === 'application');
    if (apps.length === 1) name = apps[0][0];
  }
  if (!name) {
    throw new SchematicsException('Não consegui escolher o projeto. Rode de novo com --project=<nome-do-app>.');
  }
  const project = workspace.projects.get(name);
  if (!project) throw new SchematicsException(`Projeto "${name}" não existe neste workspace.`);
  if (project.extensions['projectType'] !== 'application') {
    throw new SchematicsException(`"${name}" é uma biblioteca. O Chamfer UI deve ser configurado num app.`);
  }
  return { name, project };
}

/** 1. Registra o chamfer.css como primeiro item de "styles" nos targets build e test. */
function addStyles(projectName: string): Rule {
  return updateWorkspace((workspace) => {
    const project = workspace.projects.get(projectName)!;
    for (const targetName of ['build', 'test']) {
      const target = project.targets.get(targetName);
      if (!target) continue;
      const options = (target.options ??= {}) as Record<string, unknown>;
      const styles = (Array.isArray(options['styles']) ? options['styles'] : []) as StyleEntry[];
      const already = styles.some((s) => (typeof s === 'string' ? s : s.input).includes(`${PKG}/styles/chamfer.css`));
      if (!already) options['styles'] = [CSS_PATH, ...styles];
    }
  });
}

/** Lê o caminho do index.html a partir das opções do build. */
async function findIndexHtml(tree: Tree, projectName: string): Promise<string | null> {
  const workspace = await readWorkspace(tree);
  const project = workspace.projects.get(projectName)!;
  const index = project.targets.get('build')?.options?.['index'] as string | { input?: string } | false | undefined;
  const candidates = [
    typeof index === 'string' ? index : index && typeof index === 'object' ? index.input : undefined,
    `${project.sourceRoot ?? `${project.root}/src`}/index.html`,
  ].filter((p): p is string => !!p);
  return candidates.find((p) => tree.exists(p)) ?? null;
}

/** 2 e 3. Fontes no <head> e classes no <body>. */
function updateIndexHtml(projectName: string, options: Schema): Rule {
  return async (tree: Tree, context: SchematicContext) => {
    const path = await findIndexHtml(tree, projectName);
    if (!path) {
      context.logger.warn('index.html não encontrado. Adicione manualmente as fontes e class="cf-root" no <body>.');
      return;
    }
    let html = tree.readText(path);
    const original = html;

    if (options.fonts && !html.includes('family=Rajdhani')) {
      const tags = [
        '<link rel="preconnect" href="https://fonts.googleapis.com" />',
        '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />',
        `<link rel="stylesheet" href="${FONTS_URL}" />`,
      ];
      const indent = html.match(/\n([ \t]*)<\/head>/)?.[1] ?? '  ';
      html = html.replace(/([ \t]*)<\/head>/i, `${tags.map((t) => `${indent}  ${t}`).join('\n')}\n${indent}</head>`);
    }

    const wanted = ['cf-root', ...(options.background ? ['cf-screen'] : [])];
    html = html.replace(/<body([^>]*)>/i, (_m, attrs: string) => {
      const classMatch = attrs.match(/\sclass\s*=\s*(["'])(.*?)\1/i);
      if (classMatch) {
        const current = classMatch[2].split(/\s+/).filter(Boolean);
        const merged = [...current, ...wanted.filter((c) => !current.includes(c))].join(' ');
        return `<body${attrs.replace(classMatch[0], ` class="${merged}"`)}>`;
      }
      return `<body${attrs} class="${wanted.join(' ')}">`;
    });

    if (html !== original) tree.overwrite(path, html);
  };
}

function printNextSteps(projectName: string): Rule {
  return (_tree, context) => {
    context.logger.info('');
    context.logger.info(`◤ CHAMFER UI configurado em "${projectName}" ◢`);
    context.logger.info('');
    context.logger.info('Próximo passo: importe os componentes num componente standalone:');
    context.logger.info('');
    context.logger.info(`  import { CHAMFER_UI } from '${PKG}';`);
    context.logger.info('  @Component({ imports: [CHAMFER_UI], ... })');
    context.logger.info('');
    context.logger.info('Docs: https://github.com/kkaiocarvalho/cyberpunk-components-angular-lib#readme');
  };
}

export function ngAdd(options: Schema): Rule {
  return async (tree: Tree) => {
    const { name } = await resolveProject(tree, options);
    return chain([addStyles(name), updateIndexHtml(name, options), printNextSteps(name)]);
  };
}
