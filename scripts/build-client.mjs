import { build, context } from 'esbuild';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const isWatch = process.argv.includes('--watch');

const outFile = fileURLToPath(new URL('../public/js/main.js', import.meta.url));

await mkdir(dirname(outFile), { recursive: true });

const buildOptions = {
  entryPoints: [fileURLToPath(new URL('../src/scripts/main.ts', import.meta.url))],
  bundle: true,
  format: 'esm',
  outfile: outFile,
  platform: 'browser',
  target: 'es2018',
  sourcemap: isWatch ? 'inline' : false,
  minify: !isWatch,
  logLevel: 'info',
  treeShaking: true,
};

if (isWatch) {
  const ctx = await context(buildOptions);
  await ctx.watch();
  console.log('[client-build] watching for changes...');

  process.on('SIGINT', async () => {
    await ctx.dispose();
    process.exit(0);
  });
} else {
  await build(buildOptions);
}
