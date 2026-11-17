import test from 'node:test';
import assert from 'node:assert/strict';

import {
        createCartService,
        STORAGE_KEY,
} from '../src/services/cart/cart-service.js';

function createMemoryStorage(initialValue = null) {
        let value = initialValue;

        return {
                read() {
                        return value;
                },

                write(nextValue) {
                        value = structuredClone(nextValue);
                        return true;
                },
        };
}

function createCart(initialValue = null) {
        const storage = createMemoryStorage(initialValue);

        return {
                cart: createCartService(storage),
                storage,
        };
}

const product = {
        id: 'product-1',
        variantId: 'variant-m-black',
};

test('uses the new cart storage version', () => {
        assert.equal(STORAGE_KEY, 'oblako-rau-cart-v3');
});

test('starts with an empty cart', () => {
        const { cart } = createCart();

        assert.deepEqual(cart.getState(), { items: [] });
        assert.equal(cart.getItemCount(), 0);
});

test('adds a product variant to the cart', () => {
        const { cart } = createCart();

        cart.addItem(product);

        assert.deepEqual(cart.getState(), {
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-m-black',
                                quantity: 1,
                        },
                ],
        });

        assert.equal(cart.getItemCount(), 1);
});

test('increases quantity of the same product variant', () => {
        const { cart } = createCart();

        cart.addItem(product, 2);
        cart.addItem(product, 3);

        assert.equal(cart.getItemCount(), 5);
        assert.equal(cart.getState().items[0].quantity, 5);
});

test('stores different variants of one product as separate items', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m-black',
        });

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-l-black',
        });

        assert.deepEqual(cart.getState(), {
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-m-black',
                                quantity: 1,
                        },
                        {
                                productId: 'product-1',
                                variantId: 'variant-l-black',
                                quantity: 1,
                        },
                ],
        });

        assert.equal(cart.getItemCount(), 2);
});

test('stores different colors of one product as separate items', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m-black',
        });

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m-white',
        });

        assert.equal(cart.getState().items.length, 2);
});

test('changes quantity of a specific variant only', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m',
        });

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-l',
        });

        cart.setQuantity('product-1', 'variant-m', 4);

        assert.deepEqual(
                cart.getState().items.map((item) => item.quantity),
                [4, 1]
        );
});

test('removes a variant when its quantity becomes zero', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m',
        });

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-l',
        });

        cart.setQuantity('product-1', 'variant-m', 0);

        assert.deepEqual(cart.getState(), {
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-l',
                                quantity: 1,
                        },
                ],
        });
});

test('removes only the specified variant', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m',
        });

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-l',
        });

        cart.removeItem('product-1', 'variant-m');

        assert.equal(cart.getState().items.length, 1);
        assert.equal(
                cart.getState().items[0].variantId,
                'variant-l'
        );
});

test('clears the cart', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m',
        });

        cart.addItem({
                id: 'product-2',
                variantId: 'variant-default',
        });

        cart.clear();

        assert.equal(cart.getItemCount(), 0);
});

test('rejects quantities exceeding the selected variant stock', () => {
        const { cart } = createCart();

        assert.throws(
                () =>
                        cart.addItem(
                                {
                                        id: 'product-1',
                                        variantId: 'variant-m',
                                        stock: 2,
                                },
                                3
                        ),
                /Not enough product stock/
        );

        assert.equal(cart.getItemCount(), 0);
});

test('checks stock independently for different variants', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m',
                stock: 2,
        });

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-l',
                stock: 5,
        }, 4);

        assert.equal(cart.getItemCount(), 5);
});

test('rejects quantity changes exceeding variant stock', () => {
        const { cart } = createCart();

        cart.addItem({
                id: 'product-1',
                variantId: 'variant-m',
        });

        assert.throws(
                () =>
                        cart.setQuantity(
                                'product-1',
                                'variant-m',
                                5,
                                3
                        ),
                /Not enough product stock/
        );
});

test('rejects invalid product IDs, variant IDs and quantities', () => {
        const { cart } = createCart();

        assert.throws(
                () => cart.addItem({ id: '', variantId: 'variant-1' }),
                /Valid product/
        );

        assert.throws(
                () => cart.addItem({ id: 'product-1' }),
                /variant ID/
        );

        assert.throws(
                () =>
                        cart.addItem(
                                {
                                        id: 'product-1',
                                        variantId: 'variant-1',
                                },
                                0
                        ),
                /positive integer/
        );

        assert.throws(
                () => cart.setQuantity('', 'variant-1', 2),
                /Valid product ID/
        );

        assert.throws(
                () => cart.setQuantity('product-1', '', 2),
                /Valid product ID/
        );

        assert.throws(
                () =>
                        cart.setQuantity(
                                'product-1',
                                'variant-1',
                                -1
                        ),
                /non-negative integer/
        );

        assert.throws(
                () => cart.removeItem('product-1', ''),
                /Valid product ID/
        );
});

test('rejects invalid stock values', () => {
        const { cart } = createCart();

        assert.throws(
                () =>
                        cart.addItem({
                                id: 'product-1',
                                variantId: 'variant-1',
                                stock: -1,
                        }),
                /Stock must be/
        );
});

test('restores cart state from storage', () => {
        const { cart } = createCart({
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-m',
                                quantity: 3,
                        },
                ],
        });

        assert.equal(cart.getItemCount(), 3);
});

test('merges duplicate product variants when restoring cart state', () => {
        const { cart } = createCart({
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-m',
                                quantity: 2,
                        },
                        {
                                productId: 'product-1',
                                variantId: 'variant-m',
                                quantity: 3,
                        },
                        {
                                productId: 'product-1',
                                variantId: 'variant-l',
                                quantity: 1,
                        },
                ],
        });

        assert.deepEqual(cart.getState(), {
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-m',
                                quantity: 5,
                        },
                        {
                                productId: 'product-1',
                                variantId: 'variant-l',
                                quantity: 1,
                        },
                ],
        });
});

test('ignores legacy cart items without variant IDs', () => {
        const { cart } = createCart({
                items: [
                        {
                                productId: 'product-1',
                                quantity: 2,
                        },
                ],
        });

        assert.deepEqual(cart.getState(), { items: [] });
});

test('saves changes to storage', () => {
        const { cart, storage } = createCart();

        cart.addItem(product, 2);

        assert.deepEqual(storage.read(), {
                items: [
                        {
                                productId: 'product-1',
                                variantId: 'variant-m-black',
                                quantity: 2,
                        },
                ],
        });
});

test('notifies subscribers about changes', () => {
        const { cart } = createCart();
        const states = [];

        const unsubscribe = cart.subscribe((state) => {
                states.push(state);
        });

        cart.addItem(product);
        cart.setQuantity(
                'product-1',
                'variant-m-black',
                3
        );

        unsubscribe();

        assert.equal(states.length, 2);
        assert.equal(states[1].items[0].quantity, 3);
});

test('does not notify an unsubscribed listener', () => {
        const { cart } = createCart();
        let calls = 0;

        const unsubscribe = cart.subscribe(() => {
                calls += 1;
        });

        unsubscribe();

        cart.addItem(product);

        assert.equal(calls, 0);
});

test('one failing subscriber does not block other subscribers', () => {
        const { cart } = createCart();
        let secondSubscriberCalled = false;

        const originalConsoleError = console.error;
        console.error = () => {};

        try {
                cart.subscribe(() => {
                        throw new Error('Subscriber failure');
                });

                cart.subscribe(() => {
                        secondSubscriberCalled = true;
                });

                cart.addItem(product);

                assert.equal(secondSubscriberCalled, true);
        } finally {
                console.error = originalConsoleError;
        }
});
