import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createSizeSelector,
} from '../src/components/size-selector/size-selector.js';

const createOptions = () => [
  { variantId: 'variant-s', size: 'S', stock: 5 },
  { variantId: 'variant-m', size: 'M', stock: 3 },
  { variantId: 'variant-l', size: 'L', stock: 0 },
  { variantId: 'variant-xl', size: 'XL', available: false },
];

test('starts without a selected size', () => {
  const selector = createSizeSelector(createOptions());

  assert.deepEqual(selector.getState(), {
    selectedVariantId: null,
    selectedSize: null,
  });
});

test('selects an available size', () => {
  const selector = createSizeSelector(createOptions());

  assert.equal(selector.select('variant-m'), true);

  assert.deepEqual(selector.getState(), {
    selectedVariantId: 'variant-m',
    selectedSize: 'M',
  });
});

test('selects the initial variant when it is available', () => {
  const selector = createSizeSelector(createOptions(), 'variant-s');

  assert.deepEqual(selector.getState(), {
    selectedVariantId: 'variant-s',
    selectedSize: 'S',
  });
});

test('does not select an unavailable initial variant', () => {
  const selector = createSizeSelector(createOptions(), 'variant-l');

  assert.equal(selector.getState().selectedVariantId, null);
});

test('does not select a variant with zero stock', () => {
  const selector = createSizeSelector(createOptions());

  assert.equal(selector.select('variant-l'), false);
  assert.equal(selector.getState().selectedVariantId, null);
});

test('does not select a disabled variant', () => {
  const selector = createSizeSelector(createOptions());

  assert.equal(selector.select('variant-xl'), false);
  assert.equal(selector.getState().selectedVariantId, null);
});

test('does not select an unknown variant', () => {
  const selector = createSizeSelector(createOptions());

  assert.equal(selector.select('unknown'), false);
  assert.equal(selector.getState().selectedVariantId, null);
});

test('does not select an invalid variant ID', () => {
  const selector = createSizeSelector(createOptions());

  assert.equal(selector.select(''), false);
  assert.equal(selector.select(null), false);
  assert.equal(selector.select(undefined), false);
});

test('changes the selected variant', () => {
  const selector = createSizeSelector(createOptions());

  selector.select('variant-s');
  selector.select('variant-m');

  assert.deepEqual(selector.getState(), {
    selectedVariantId: 'variant-m',
    selectedSize: 'M',
  });
});

test('does not notify subscribers when selecting the same variant', () => {
  const selector = createSizeSelector(createOptions(), 'variant-s');
  let calls = 0;

  selector.subscribe(() => {
    calls += 1;
  });

  selector.select('variant-s');

  assert.equal(calls, 0);
});

test('notifies subscribers after a selection change', () => {
  const selector = createSizeSelector(createOptions());
  const states = [];

  selector.subscribe((state) => states.push(state));

  selector.select('variant-m');

  assert.deepEqual(states, [
    {
      selectedVariantId: 'variant-m',
      selectedSize: 'M',
    },
  ]);
});

test('supports unsubscribe', () => {
  const selector = createSizeSelector(createOptions());
  let calls = 0;

  const unsubscribe = selector.subscribe(() => {
    calls += 1;
  });

  unsubscribe();
  selector.select('variant-s');

  assert.equal(calls, 0);
});

test('does not allow invalid options input', () => {
  assert.throws(
    () => createSizeSelector(null),
    TypeError
  );
});

test('ignores options with invalid data', () => {
  const selector = createSizeSelector([
    { variantId: '', size: 'S' },
    { variantId: 'variant-m', size: '' },
    { variantId: 'variant-l', size: 'L' },
  ]);

  assert.deepEqual(selector.getOptions().map((option) => option.variantId), [
    'variant-l',
  ]);
});

test('ignores duplicate variant IDs', () => {
  const selector = createSizeSelector([
    { variantId: 'variant-s', size: 'S' },
    { variantId: 'variant-s', size: 'Small' },
  ]);

  assert.equal(selector.getOptions().length, 1);
  assert.equal(selector.getState().selectedSize, null);
});

test('returns a safe copy of options', () => {
  const selector = createSizeSelector(createOptions());
  const options = selector.getOptions();

  options[0].size = 'CHANGED';

  assert.equal(selector.getOptions()[0].size, 'S');
});

test('does not allow invalid subscribers', () => {
  const selector = createSizeSelector(createOptions());

  assert.throws(
    () => selector.subscribe(null),
    TypeError
  );
});

test('one failing subscriber does not block other subscribers', () => {
  const selector = createSizeSelector(createOptions());
  let successfulCalls = 0;

  const originalError = console.error;
  console.error = () => {};

  try {
    selector.subscribe(() => {
      throw new Error('Subscriber error');
    });

    selector.subscribe(() => {
      successfulCalls += 1;
    });

    selector.select('variant-s');
  } finally {
    console.error = originalError;
  }

  assert.equal(successfulCalls, 1);
});
