import { access, copyFile, mkdir } from 'node:fs/promises';
import { constants } from 'node:fs';
import { resolve } from 'node:path';

const distDir = resolve(process.cwd(), 'dist');
const sourcePath = resolve(distDir, '404.html');
const targetDir = resolve(distDir, '404');
const targetPath = resolve(targetDir, 'index.html');

async function ensure404Directory() {
  try {
    await access(sourcePath, constants.F_OK);
  } catch {
    // Nothing to copy if the source file is missing (e.g. partial builds)
    return;
  }

  await mkdir(targetDir, { recursive: true });
  await copyFile(sourcePath, targetPath);
}

ensure404Directory().catch((error) => {
  console.error('[postbuild] Failed to duplicate 404.html for directory access.');
  console.error(error);
  process.exitCode = 1;
});
