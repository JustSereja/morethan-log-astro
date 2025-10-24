import type { IslandMetadata } from '../types';

export { default } from './DemoCounter';
export type { DemoCounterProps } from './DemoCounter';

export const island: IslandMetadata = {
  name: 'DemoCounter',
  description: 'Interactive counter used to showcase React island hydration.',
  tags: ['demo', 'react', 'counter'],
  category: 'demos',
};
