import assert from 'assert';
import toml from 'toml';
import { readdir } from 'fs/promises';
import path from 'path';
import glob from 'glob';
import fs from 'fs';

describe('material', () => {
  it('should be valid TOML', async () => {
    const allMaterial = glob.sync(path.join(path.resolve('__dirname'), '/material/**/*.toml'))
      .map(path => fs.readFileSync(path, { encoding: 'utf-8'}));
    allMaterial.forEach(f => {
      assert.doesNotThrow(f => { toml.parse(f); });
    });
  });
});
