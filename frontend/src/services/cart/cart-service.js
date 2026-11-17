export const STORAGE_KEY = 'oblako-rau-cart-v3';

function createEmptyCart() {
        return { items: [] };
}

function isValidId(value) {
        return typeof value === 'string' && value.trim().length > 0;
}

function validateStock(stock) {
        if (
                stock !== undefined &&
                stock !== null &&
                (!Number.isSafeInteger(stock) || stock < 0)
        ) {
                throw new RangeError('Stock must be a non-negative integer');
        }
}

function getItemKey(productId, variantId) {
        return JSON.stringify([productId, variantId]);
}

function normalizeCart(value) {
        if (!value || !Array.isArray(value.items)) {
                return createEmptyCart();
        }

        const quantities = new Map();

        value.items.forEach((item) => {
                if (
                        !item ||
                        !isValidId(item.productId) ||
                        !isValidId(item.variantId) ||
                        !Number.isSafeInteger(item.quantity) ||
                        item.quantity < 1
                ) {
                        return;
                }

                const key = getItemKey(item.productId, item.variantId);
                const currentQuantity = quantities.get(key)?.quantity ?? 0;
                const nextQuantity = currentQuantity + item.quantity;

                if (Number.isSafeInteger(nextQuantity)) {
                        quantities.set(key, {
                                productId: item.productId,
                                variantId: item.variantId,
                                quantity: nextQuantity,
                        });
                }
        });

        return {
                items: Array.from(quantities.values()),
        };
}

export function createCartService(storage) {
        if (
                !storage ||
                typeof storage.read !== 'function' ||
                typeof storage.write !== 'function'
        ) {
                throw new TypeError('Valid storage adapter is required');
        }

        let state = normalizeCart(storage.read());
        const listeners = new Set();

        function getState() {
                return {
                        items: state.items.map((item) => ({ ...item })),
                };
        }

        function notify() {
                const snapshot = getState();

                listeners.forEach((listener) => {
                        try {
                                listener(snapshot);
                        } catch (error) {
                                console.error('Cart subscriber error:', error);
                        }
                });
        }

        function update(nextItems) {
                state = normalizeCart({ items: nextItems });

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

        function addItem(product, quantity = 1) {
                if (
                        !product ||
                        !isValidId(product.id) ||
                        !isValidId(product.variantId)
                ) {
                        throw new TypeError(
                                'Valid product with variant ID is required'
                        );
                }

                if (!Number.isSafeInteger(quantity) || quantity < 1) {
                        throw new RangeError(
                                'Quantity must be a positive integer'
                        );
                }

                validateStock(product.stock);

                const existing = state.items.find(
                        (item) =>
                                item.productId === product.id &&
                                item.variantId === product.variantId
                );

                const currentQuantity = existing?.quantity ?? 0;
                const nextQuantity = currentQuantity + quantity;

                if (!Number.isSafeInteger(nextQuantity)) {
                        throw new RangeError(
                                'Product quantity exceeds the safe limit'
                        );
                }

                if (
                        product.stock !== undefined &&
                        product.stock !== null &&
                        nextQuantity > product.stock
                ) {
                        throw new RangeError('Not enough product stock');
                }

                const nextItems = existing
                        ? state.items.map((item) =>
                                  item.productId === product.id &&
                                  item.variantId === product.variantId
                                          ? { ...item, quantity: nextQuantity }
                                          : item
                          )
                        : [
                                  ...state.items,
                                  {
                                          productId: product.id,
                                          variantId: product.variantId,
                                          quantity,
                                  },
                          ];

                return update(nextItems);
        }

        function setQuantity(
                productId,
                variantId,
                quantity,
                stock = null
        ) {
                if (!isValidId(productId) || !isValidId(variantId)) {
                        throw new TypeError(
                                'Valid product ID and variant ID are required'
                        );
                }

                if (!Number.isSafeInteger(quantity) || quantity < 0) {
                        throw new RangeError(
                                'Quantity must be a non-negative integer'
                        );
                }

                validateStock(stock);

                if (
                        stock !== null &&
                        stock !== undefined &&
                        quantity > stock
                ) {
                        throw new RangeError('Not enough product stock');
                }

                if (quantity === 0) {
                        return removeItem(productId, variantId);
                }

                const exists = state.items.some(
                        (item) =>
                                item.productId === productId &&
                                item.variantId === variantId
                );

                if (!exists) {
                        return getState();
                }

                return update(
                        state.items.map((item) =>
                                item.productId === productId &&
                                item.variantId === variantId
                                        ? { ...item, quantity }
                                        : item
                        )
                );
        }

        function removeItem(productId, variantId) {
                if (!isValidId(productId) || !isValidId(variantId)) {
                        throw new TypeError(
                                'Valid product ID and variant ID are required'
                        );
                }

                return update(
                        state.items.filter(
                                (item) =>
                                        !(
                                                item.productId === productId &&
                                                item.variantId === variantId
                                        )
                        )
                );
        }

        function clear() {
                return update([]);
        }

        function getItemCount() {
                return state.items.reduce(
                        (total, item) => total + item.quantity,
                        0
                );
        }

        return {
                getState,
                subscribe,
                addItem,
                setQuantity,
                removeItem,
                clear,
                getItemCount,
        };
}
