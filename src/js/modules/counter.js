export function initCounters(selector = '.counter') {
	document.querySelectorAll(selector).forEach((counter) => {
		const minus = counter.querySelector('.counter__minus');
		const plus = counter.querySelector('.counter__plus');
		const number = counter.querySelector('.counter__number');
		const input = counter.querySelector('input[name="count"]');

		if (!minus || !plus || !number) {
			return;
		}

		const min = Number(counter.dataset.min ?? 0);
		const max = Number(counter.dataset.max ?? Infinity);

		const updateValue = (value) => {
			const newValue = Math.max(min, Math.min(value, max));
			number.textContent = newValue;
			if (input) {
				input.value = newValue;
			}

			counter.dispatchEvent(
				new CustomEvent('counter:change', {
					detail: { value: newValue },
					bubbles: true,
				})
			);
		};

		plus.addEventListener('click', (e) => {
			e.preventDefault();

			updateValue(Number(number.textContent) + 1);
		});

		minus.addEventListener('click', (e) => {
			e.preventDefault();

			updateValue(Number(number.textContent) - 1);
		});

		updateValue(Number(number.textContent) || min);
	});
}
