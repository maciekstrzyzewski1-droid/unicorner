import { test } from 'node:test';
import assert from 'node:assert/strict';
import { porownaj, porownajForme, zaimekZwrotny, wzorPodpowiedzi } from '../../src/scripts/jezyki/porownanie.js';

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

test('porownajForme: zaimek osobowy na początku jest dozwolony', () => {
  assert.equal(porownajForme('hablo', 'hablo', 0), 'ok');
  assert.equal(porownajForme('yo hablo', 'hablo', 0), 'ok');
  assert.equal(porownajForme('Tú hablas', 'hablas', 1), 'ok');
  assert.equal(porownajForme('usted habla', 'habla', 2), 'ok');
  assert.equal(porownajForme('nosotras hablamos', 'hablamos', 3), 'ok');
  assert.equal(porownajForme('yo me llamo', 'me llamo', 0), 'ok');
  assert.equal(porownajForme('tú te llamas', 'te llamas', 1), 'ok');
});
test('porownajForme: zaimek bez akcentu to uwaga, zaimek z innej osoby to błąd', () => {
  assert.equal(porownajForme('tu hablas', 'hablas', 1), 'akcent');
  assert.equal(porownajForme('el habla', 'habla', 2), 'akcent');
  assert.equal(porownajForme('yo hablas', 'hablas', 1), null);
  assert.equal(porownajForme('ellos hablamos', 'hablamos', 3), null);
});
test('porownajForme: brak zaimka zwrotnego', () => {
  assert.equal(porownajForme('llamas', 'te llamas', 1), 'zaimek');
  assert.equal(porownajForme('tú llamas', 'te llamas', 1), 'zaimek');
  assert.equal(porownajForme('llamais', 'os llamáis', 4), 'zaimek');
  assert.equal(porownajForme('se llamo', 'me llamo', 0), null);
  assert.equal(porownajForme('', 'me llamo', 0), null);
  assert.equal(porownajForme('habla', 'habla', 2), 'ok');
});
test('zaimekZwrotny', () => {
  assert.equal(zaimekZwrotny('nos llamamos'), 'nos');
  assert.equal(zaimekZwrotny('hablamos'), null);
  assert.equal(zaimekZwrotny('se'), null);
});
test('wzorPodpowiedzi', () => {
  assert.equal(wzorPodpowiedzi('hasta luego'), 'h____ l____');
  assert.equal(wzorPodpowiedzi('te llamas'), 't_ l_____');
  assert.equal(wzorPodpowiedzi('¿Cómo te llamas?'), '¿C___ t_ l_____?');
  assert.equal(wzorPodpowiedzi('y'), 'y');
  assert.equal(wzorPodpowiedzi('enseñáis'), 'e_______');
});
