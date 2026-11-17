const isValidId = (value) =>
  typeof value === 'string' && value.trim().length > 0;

const normalizeOptions = (options) => {
  if (!Array.isArray(options)) {
    throw new TypeError('Size selector options must be an array');
  }

  const seen = new Set();

  return options.reduce((result, option) => {
    if (
      !option ||
      !isValidId(option.variantId) ||
      typeof option.size !== 'string' ||
      !option.size.trim()
    ) {
      return result;
    }

    const variantId = option.variantId.trim();

    if (seen.has(variantId)) {
      return result;
    }

    seen.add(variantId);

    const hasStock = option.stock !== undefined && option.stock !== null;
    const stock = hasStock ? Number(option.stock) : null;

    const available =
      option.available !== false &&
      (!hasStock || (Number.isFinite(stock) && stock > 0));

    result.push({
      variantId,
      size: option.size.trim(),
      available,
      stock,
    });

    return result;
  }, []);
};

export const createSizeSelector = (options, initialVariantId = null) => {
  const normalizedOptions = normalizeOptions(options);
  const listeners = new Set();

  const findOption = (variantId) =>
    normalizedOptions.find((option) => option.variantId === variantId);

  const initialOption = findOption(initialVariantId);

  let selectedVariantId =
    initialOption?.available ? initialOption.variantId : null;

  const getState = () => {
    const selectedOption = findOption(selectedVariantId);

    return {
      selectedVariantId,
      selectedSize: selectedOption?.size ?? null,
    };
  };

  const notify = () => {
    const state = getState();

    listeners.forEach((listener) => {
      try {
        listener(state);
      } catch (error) {
        console.error('Size selector subscriber error:', error);
      }
    });
  };

  const select = (variantId) => {
    if (!isValidId(variantId)) {
      return false;
    }

    const option = findOption(variantId);

    if (!option || !option.available) {
      return false;
    }

    if (selectedVariantId === option.variantId) {
      return true;
    }

    selectedVariantId = option.variantId;
    notify();

    return true;
  };

  const subscribe = (listener) => {
    if (typeof listener !== 'function') {
      throw new TypeError('Size selector listener must be a function');
    }

    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  };

  return {
    getState,
    getOptions: () => normalizedOptions.map((option) => ({ ...option })),
    select,
    subscribe,
  };
};

export const initSizeSelector = (root) => {
  if (!root || typeof root.querySelectorAll !== 'function') {
    return null;
  }

  const buttons = Array.from(
    root.querySelectorAll('[data-size-option]')
  );

  if (buttons.length === 0) {
    return null;
  }

  const options = buttons.map((button) => {
    const stockValue = button.dataset.stock;
    const hasStock = stockValue !== undefined && stockValue !== '';

    return {
      variantId: button.dataset.variantId,
      size: button.dataset.size || button.textContent.trim(),
      available:
        !button.disabled && button.dataset.available !== 'false',
      ...(hasStock ? { stock: Number(stockValue) } : {}),
    };
  });

  const initialButton = buttons.find(
    (button) =>
      button.getAttribute('aria-pressed') === 'true' ||
      button.classList.contains('is-selected')
  );

  const selector = createSizeSelector(
    options,
    initialButton?.dataset.variantId ?? null
  );

  const variantInput = root.querySelector('[data-variant-input]');
  const selectedSizeOutput = root.querySelector('[data-selected-size]');

  const render = ({ selectedVariantId, selectedSize }) => {
    buttons.forEach((button) => {
      const isSelected =
        button.dataset.variantId === selectedVariantId;

      button.classList.toggle('is-selected', isSelected);
      button.setAttribute('aria-pressed', String(isSelected));

      const isAvailable =
        selector
          .getOptions()
          .find((option) => option.variantId === button.dataset.variantId)
          ?.available ?? false;

      button.disabled = !isAvailable;
      button.setAttribute('aria-disabled', String(!isAvailable));
    });

    if (variantInput) {
      variantInput.value = selectedVariantId ?? '';
    }

    if (selectedSizeOutput) {
      selectedSizeOutput.textContent = selectedSize ?? 'Не выбран';
    }

    if (selectedVariantId) {
      root.dataset.selectedVariantId = selectedVariantId;
    } else {
      delete root.dataset.selectedVariantId;
    }
  };

  const unsubscribe = selector.subscribe(render);

  const handleClick = (event) => {
    const button = event.target.closest?.('[data-size-option]');

    if (!button || !root.contains(button)) {
      return;
    }

    selector.select(button.dataset.variantId);
  };

  root.addEventListener('click', handleClick);

  render(selector.getState());

  return {
    ...selector,
    destroy() {
      root.removeEventListener('click', handleClick);
      unsubscribe();
    },
  };
};

export const initSizeSelectors = (scope = document) =>
  Array.from(scope.querySelectorAll('[data-size-selector]'))
    .map(initSizeSelector)
    .filter(Boolean);
