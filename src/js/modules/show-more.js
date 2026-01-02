export function showMore(listSelector, btnSelector) {
	const lists = document.querySelectorAll(listSelector);

	lists.forEach((list) => {
		// Ищем кнопку рядом со списком
		const btn = list.parentElement.querySelector(btnSelector);
		if (!btn) {
			return;
		}

		const items = Array.from(list.children);
		const limit = parseInt(list.dataset.itemsToShow, 10) || 5;

		// Настройки текстов
		const textShow = btn.dataset.textShow || btn.textContent || 'Показать еще';
		const textHide = btn.dataset.textHide || 'Свернуть';

		// Настройка поведения: удалять кнопку или оставлять?
		// Читаем из HTML атрибута data-hide-button="true"
		const shouldHideButton = btn.dataset.hideButton === 'true';

		// 1. Если элементов мало, кнопка не нужна сразу
		if (items.length <= limit) {
			btn.style.display = 'none';
			return;
		}

		// Состояние: развернуто или нет
		let isExpanded = false;

		// Функция отрисовки
		const render = () => {
			// Если режим "удалить кнопку" и мы развернули — кнопка исчезает
			if (shouldHideButton && isExpanded) {
				btn.style.display = 'none';
			} else {
				// Иначе меняем текст
				btn.textContent = isExpanded ? textHide : textShow;
			}

			// Показываем/скрываем элементы
			items.slice(limit).forEach((item) => {
				// Если развернуто — показываем (hidden = false), иначе скрываем
				item.hidden = !isExpanded;
			});
		};

		// Инициализация (скрываем лишнее при старте)
		render();

		// Клик
		btn.addEventListener('click', () => {
			isExpanded = !isExpanded;
			render();
		});
	});
}
