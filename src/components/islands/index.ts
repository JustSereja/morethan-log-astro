import type { ComponentType } from 'react';

import type { IslandMetadata } from './types';

export type IslandComponent<Props = unknown> = ComponentType<Props>;

type IslandModule = {
  default?: IslandComponent;
  island?: IslandMetadata;
};

const modules = import.meta.glob<IslandModule>('./**/index.{ts,tsx}', {
  eager: true,
});

const registry = new Map<string, IslandComponent>();
const metadata = new Map<string, IslandMetadata>();

const toClassCase = (segment: string): string =>
  segment
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');

const devWarn = (message: string) => {
  if (import.meta.env.MODE === 'development') {
    console.warn(message);
  }
};

for (const [path, module] of Object.entries(modules)) {
  const component = module.default;
  if (!component) {
    devWarn(`[islands] Skipping "${path}" because it does not export a default component.`);
    continue;
  }

  const segments = path.replace('./', '').split('/');
  segments.pop(); // remove index file name
  const folder = segments.pop() ?? segments.pop() ?? 'Component';
  const fallbackName = toClassCase(folder);

  const displayName =
    (typeof (component as { displayName?: unknown }).displayName === 'string'
      ? (component as { displayName: string }).displayName
      : undefined) ?? undefined;

  const resolvedName = module.island?.name ?? displayName ?? fallbackName;

  if (registry.has(resolvedName)) {
    devWarn(
      `[islands] Duplicate island name "${resolvedName}" detected in "${path}". ` +
        'The component will be ignored.',
    );
    continue;
  }

  registry.set(resolvedName, component);
  metadata.set(resolvedName, { ...module.island, name: resolvedName });
}

const islandsProxyHandler: ProxyHandler<Record<string, IslandComponent>> = {
  get(_, prop) {
    if (typeof prop !== 'string') {
      return undefined;
    }
    return registry.get(prop);
  },
  has(_, prop) {
    return typeof prop === 'string' && registry.has(prop);
  },
  ownKeys() {
    return Array.from(registry.keys());
  },
  getOwnPropertyDescriptor(_, prop) {
    if (typeof prop !== 'string') {
      return undefined;
    }
    const component = registry.get(prop);
    if (!component) {
      return undefined;
    }
    return {
      configurable: true,
      enumerable: true,
      value: component,
      writable: false,
    };
  },
};

export const islands = new Proxy<Record<string, IslandComponent>>({}, islandsProxyHandler);

export function listIslands(): string[] {
  return Array.from(registry.keys()).sort((a, b) => a.localeCompare(b));
}

export function getIsland<Props = unknown>(
  name: string,
): IslandComponent<Props> | undefined {
  return registry.get(name) as IslandComponent<Props> | undefined;
}

export function requireIsland<Props = unknown>(name: string): IslandComponent<Props> {
  const component = getIsland<Props>(name);
  if (!component) {
    const available = listIslands();
    const suggestion =
      available.length > 0 ? ` Available islands: ${available.join(', ')}.` : '';
    throw new Error(`Island "${name}" is not registered.${suggestion}`);
  }
  return component;
}

export function getIslandMetadata(name: string): IslandMetadata | undefined {
  return metadata.get(name);
}

export type { IslandMetadata } from './types';
