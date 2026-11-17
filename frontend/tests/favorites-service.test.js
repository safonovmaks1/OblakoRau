import test from 'node:test';
import assert from 'node:assert/strict';

import {
        createFavoritesService,
        STORAGE_KEY,
} from '../src/services/favorites/favorites-service.js';

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

function createFavorites(initialValue = null) {
        const storage = createMemoryStorage(initialValue);

        return {
                favorites: createFavoritesService(storage),
                storage,
        };
}

test('uses a dedicated favorites storage key', () => {
        assert.equal(STORAGE_KEY, 'oblako-rau-favorites-v1');
});

test('starts with an empty favorites list', () => {
        const { favorites } = createFavorites();

        assert.deepEqual(favorites.getState(), { items: [] });
        assert.equal(favorites.getItemCount(), 0);
});

test('adds a product to favorites', () => {
        const { favorites } = createFavorites();

        favorites.addItem('product-1');

        assert.deepEqual(favorites.getState(), {
                items: ['product-1'],
        });
        assert.equal(favorites.hasItem('product-1'), true);
});

test('does not add duplicate products', () => {
        const { favorites } = createFavorites();

        favorites.addItem('product-1');
        favorites.addItem('product-1');

        assert.deepEqual(favorites.getState(), {
                items: ['product-1'],
        });
});

test('removes a product from favorites', () => {
        const { favorites } = createFavorites();

        favorites.addItem('product-1');
        favorites.addItem('product-2');
        favorites.removeItem('product-1');

        assert.deepEqual(favorites.getState(), {
                items: ['product-2'],
        });
});

test('toggles a product in and out of favorites', () => {
        const { favorites } = createFavorites();

        favorites.toggleItem('product-1');

        assert.equal(favorites.hasItem('product-1'), true);

        favorites.toggleItem('product-1');

        assert.equal(favorites.hasItem('product-1'), false);
});

test('returns the number of unique favorite products', () => {
        const { favorites } = createFavorites();

        favorites.addItem('product-1');
        favorites.addItem('product-2');

        assert.equal(favorites.getItemCount(), 2);
});

test('restores favorites from storage', () => {
        const { favorites } = createFavorites({
                items: ['product-1', 'product-2'],
        });

        assert.deepEqual(favorites.getState(), {
                items: ['product-1', 'product-2'],
        });
});

test('removes invalid and duplicate IDs when restoring state', () => {
        const { favorites } = createFavorites({
                items: [
                        'product-1',
                        '',
                        null,
                        'product-1',
                        'product-2',
                        123,
                ],
        });

        assert.deepEqual(favorites.getState(), {
                items: ['product-1', 'product-2'],
        });
});

test('saves changes to storage', () => {
        const { favorites, storage } = createFavorites();

        favorites.addItem('product-1');

        assert.deepEqual(storage.read(), {
                items: ['product-1'],
        });
});

test('notifies subscribers about changes', () => {
        const { favorites } = createFavorites();
        const states = [];

        const unsubscribe = favorites.subscribe((state) => {
                states.push(state);
        });

        favorites.addItem('product-1');
        favorites.removeItem('product-1');

        unsubscribe();

        assert.equal(states.length, 2);
        assert.deepEqual(states[0], {
                items: ['product-1'],
        });
        assert.deepEqual(states[1], {
                items: [],
        });
});

test('does not notify an unsubscribed listener', () => {
        const { favorites } = createFavorites();
        let calls = 0;

        const unsubscribe = favorites.subscribe(() => {
                calls += 1;
        });

        unsubscribe();
        favorites.addItem('product-1');

        assert.equal(calls, 0);
});

test('rejects invalid product IDs', () => {
        const { favorites } = createFavorites();

        assert.throws(() => favorites.addItem(''), /Valid product ID/);
        assert.throws(() => favorites.removeItem(''), /Valid product ID/);
        assert.throws(() => favorites.toggleItem(''), /Valid product ID/);
});

test('rejects invalid storage adapters', () => {
        assert.throws(
                () => createFavoritesService(null),
                /Valid storage adapter/,
        );

        assert.throws(
                () => createFavoritesService({ read() {} }),
                /Valid storage adapter/,
        );
});

test('one failing subscriber does not block other subscribers', () => {
        const { favorites } = createFavorites();
        let secondSubscriberCalled = false;

        const originalConsoleError = console.error;
        console.error = () => {};

        try {
                favorites.subscribe(() => {
                        throw new Error('Subscriber failure');
                });

                favorites.subscribe(() => {
                        secondSubscriberCalled = true;
                });

                favorites.addItem('product-1');

                assert.equal(secondSubscriberCalled, true);
        } finally {
                console.error = originalConsoleError;
        }
});
