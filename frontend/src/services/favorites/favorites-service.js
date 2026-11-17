export const STORAGE_KEY = 'oblako-rau-favorites-v1';

function createEmptyFavorites() {
        return { items: [] };
}

function isValidId(value) {
        return typeof value === 'string' && value.trim().length > 0;
}

function normalizeFavorites(value) {
        if (!value || !Array.isArray(value.items)) {
                return createEmptyFavorites();
        }

        return {
                items: [...new Set(value.items.filter(isValidId))],
        };
}

export function createFavoritesService(storage) {
        if (
                !storage ||
                typeof storage.read !== 'function' ||
                typeof storage.write !== 'function'
        ) {
                throw new TypeError('Valid storage adapter is required');
        }

        let state = normalizeFavorites(storage.read());
        const listeners = new Set();

        function getState() {
                return {
                        items: [...state.items],
                };
        }

        function notify() {
                const snapshot = getState();

                listeners.forEach((listener) => {
                        try {
                                listener(snapshot);
                        } catch (error) {
                                console.error('Favorites subscriber error:', error);
                        }
                });
        }

        function update(nextItems) {
                state = normalizeFavorites({ items: nextItems });

                storage.write(getState());
                notify();

                return getState();
        }

        function subscribe(listener) {
                if (typeof listener !== 'function') {
                        throw new TypeError('Listener must be a function');
                }

                listeners.add(listener);

                return () => {
                        listeners.delete(listener);
                };
        }

        function addItem(productId) {
                if (!isValidId(productId)) {
                        throw new TypeError('Valid product ID is required');
                }

                if (state.items.includes(productId)) {
                        return getState();
                }

                return update([...state.items, productId]);
        }

        function removeItem(productId) {
                if (!isValidId(productId)) {
                        throw new TypeError('Valid product ID is required');
                }

                return update(state.items.filter((id) => id !== productId));
        }

        function toggleItem(productId) {
                if (!isValidId(productId)) {
                        throw new TypeError('Valid product ID is required');
                }

                return state.items.includes(productId)
                        ? removeItem(productId)
                        : addItem(productId);
        }

        function hasItem(productId) {
                return state.items.includes(productId);
        }

        function getItemCount() {
                return state.items.length;
        }

        return {
                getState,
                subscribe,
                addItem,
                removeItem,
                toggleItem,
                hasItem,
                getItemCount,
        };
}
