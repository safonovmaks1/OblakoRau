export function initAccordion(selector = '.accordion', onlyOneOpen = true) {
	const containers = document.querySelectorAll(selector);

	containers.forEach((container) => {
		const items = container.querySelectorAll('.accordion__item');

		items.forEach((item) => {
			const header = item.querySelector('.accordion__header');

			// Проверка на наличие элементов
			if (!header) {
				return;
			}

			header.addEventListener('click', () => {
				const isOpen = item.classList.contains('is-active');

				// 1. Если включен режим "один открыт" и мы ПЫТАЕМСЯ ОТКРЫТЬ текущий элемент (он закрыт)
				// То мы должны закрыть все остальные активные элементы
				if (onlyOneOpen && !isOpen) {
					items.forEach((otherItem) => {
						if (otherItem !== item && otherItem.classList.contains('is-active')) {
							closeItem(otherItem);
						}
					});
				}

				// 2. Стандартное переключение текущего элемента
				if (isOpen) {
					closeItem(item);
				} else {
					openItem(item);
				}
			});
		});
	});

	// Хелпер открытия
	function openItem(item) {
		const content = item.querySelector('.accordion__content');
		if (!content) {
			return;
		}

		item.classList.add('is-active');
		content.style.maxHeight = content.scrollHeight + 'px';
	}

	// Хелпер закрытия
	function closeItem(item) {
		const content = item.querySelector('.accordion__content');
		if (!content) {
			return;
		}

		item.classList.remove('is-active');
		content.style.maxHeight = null;
	}
}
