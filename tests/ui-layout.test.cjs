const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const biz = require('../shared/business-logic.js');

test('items with images are prioritized before items without images', () => {
  const items = [
    { id: 'a', image: '' },
    { id: 'b', image: 'https://example.com/image.jpg' },
    { id: 'c', image: '' },
    { id: 'd', image: 'https://example.com/image2.jpg' }
  ];

  const split = biz.splitItemsByImage(items);
  assert.deepEqual(split.withImage.map((entry) => entry.id), ['b', 'd']);
  assert.deepEqual(split.withoutImage.map((entry) => entry.id), ['a', 'c']);
});

test('condensed list is available for items without images', () => {
  const items = [
    { id: '1', image: '' },
    { id: '2', image: '' },
    { id: '3', image: 'x' }
  ];

  const split = biz.splitItemsByImage(items);
  assert.equal(split.withImage.length, 1);
  assert.equal(split.withoutImage.length, 2);
});

test('fluid responsive rules exist for the menu layout', () => {
  const cssPath = path.resolve(__dirname, '..', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');
  const scriptPath = path.resolve(__dirname, '..', 'script.js');
  const script = fs.readFileSync(scriptPath, 'utf8');

  assert.match(
    css,
    /\.item-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(auto-fill, minmax\(min\(100%, 280px\), 1fr\)\);/m
  );
  assert.match(
    css,
    /\.popular-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(auto-fill, minmax\(min\(100%, 250px\), 1fr\)\);/m
  );
  assert.match(css, /\.menu-card\s*\{[\s\S]*grid-template-rows:\s*var\(--card-media-height\) minmax\(0, 1fr\);/m);
  assert.match(css, /\.food-media img\s*\{[\s\S]*object-fit:\s*contain;/m);
  assert.match(script, /food-media-placeholder/);
  assert.doesNotMatch(script, /split\.withoutImage\.length \? `<ul class="compact-menu-list"/);
});
