"use strict";

import { glob } from "glob";
import { readFile, writeFile } from "node:fs/promises";

const CODE_BLOCK_PATTERN = /(<pre class="astro-code[\s\S]*?<\/pre>)/g;
const LEADING_SPACE_PATTERN = /\n\s+(<span class="line">)/g;

async function normalizeCodeBlocks(file) {
  let content = await readFile(file, "utf8");
  if (!content.includes('class="astro-code')) {
    return;
  }

  const next = content.replace(CODE_BLOCK_PATTERN, (block) =>
    block.replace(LEADING_SPACE_PATTERN, "\n$1")
  );

  if (next !== content) {
    await writeFile(file, next);
  }
}

const files = await glob("dist/**/*.html", { nodir: true });
await Promise.all(files.map(normalizeCodeBlocks));
