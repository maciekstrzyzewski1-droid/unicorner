import { test } from 'node:test';
import assert from 'node:assert/strict';
import { porownaj } from '../../src/scripts/jezyki/porownanie.js';

test('porownaj: obecne działanie', () => {
  assert.equal(porownaj('hola', ['Hola.']), 'ok');
  assert.equal(porownaj('  ¿Cómo   te llamas? ', ['¿Cómo te llamas?']), 'ok');
  assert.equal(porownaj('Buenos dias', ['Buenos días']), 'akcent');
  assert.equal(porownaj('ensenar', ['enseñar']), 'akcent');
  assert.equal(porownaj('tu', ['tú']), null);              // inne słowo, nie literówka
  assert.equal(porownaj('esta bien', ['está bien']), null);
  assert.equal(porownaj('', ['hola']), null);
  assert.equal(porownaj('adios', ['hola', 'adiós']), 'akcent');
});
