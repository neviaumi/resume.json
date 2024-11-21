import path from 'node:path';

export const WORKSPACE_ROOT = path.resolve(import.meta.dirname, '..'),
  DOCS_FOLDER = path.join(WORKSPACE_ROOT, 'docs'),
  PUBLIC_ASSETS_FOLDER = path.join(WORKSPACE_ROOT, 'public');
