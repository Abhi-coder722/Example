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

test('desktop and mobile responsive rules exist for the new menu layout', () => {
  const cssPath = path.resolve(__dirname, '..', 'styles.css');
  const css = fs.readFileSync(cssPath, 'utf8');

  assert.match(css, /\.item-grid\s*\{[\s\S]*grid-template-columns:\s*repeat\(3, minmax\(0, 1fr\)\);/m);
  assert.match(css, /@media \(max-width: 1200px\)[\s\S]*\.item-grid[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/m);
  assert.match(css, /@media \(max-width: 660px\)[\s\S]*\.item-grid[\s\S]*grid-template-columns:\s*1fr;/m);
  assert.match(css, /@media \(max-width: 660px\)[\s\S]*\.compact-menu-row[\s\S]*grid-template-columns:\s*1fr;/m);
});
