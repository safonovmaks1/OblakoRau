export function initCounters(selector = '.counter') {
	const counters = document.querySelectorAll(selector);

	counters.forEach((counter) => {
		const minus = counter.querySelector('.counter__minus');
		const plus = counter.querySelector('.counter__plus');
		const number = counter.querySelector('.counter__number');
		// Если нужно отправлять данные, ищем скрытый инпут внутри
		const input = counter.closest('form')?.querySelector('input[name="count"]') || null;

		if (!minus || !plus || !number) {
			return;
		}

		// Настройка: минимальное значение (1 для карточки, 0 для корзины)
		const min = parseInt(counter.dataset.min) || 0;

		const updateValue = (newValue) => {
			// Обновляем текст
			number.textContent = newValue;

			// Обновляем скрытый инпут (если есть)
			if (input) {
				input.value = newValue;
			}

			// Создаем событие, чтобы другие скрипты узнали об изменении
			counter.dispatchEvent(
				new CustomEvent('counter:change', {
					detail: { value: newValue },
					bubbles: true,
				})
			);
		};

		plus.addEventListener('click', (e) => {
			e.preventDefault(); // Чтобы не сабмитило форму
			let currentValue = parseInt(number.textContent) || min;
			updateValue(currentValue + 1);
		});

		minus.addEventListener('click', (e) => {
			e.preventDefault();
			let currentValue = parseInt(number.textContent) || min;
			if (currentValue > min) {
				updateValue(currentValue - 1);
			}
		});
	});
}
