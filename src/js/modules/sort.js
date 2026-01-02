export default function initSort() {
	const sortGroups = document.querySelectorAll('.js-filter-group');

	if (!sortGroups.length) {
		return;
	}

	// 1. Закрытие при клике вне
	document.addEventListener('click', (e) => {
		if (!e.target.closest('.js-filter-group')) {
			sortGroups.forEach((g) => g.classList.remove('is-active'));
		}
	});

	sortGroups.forEach((group) => {
		const btn = group.querySelector('.js-filter-btn');
		// Ищем элементы списка только если они есть
		const listItems = group.querySelectorAll('.sort-list__item');

		// 2. Клик по кнопке (Тоггл)
		btn.addEventListener('click', (e) => {
			e.stopPropagation();

			// Если мы кликнули по внутренней кнопке, закрываем только другие внутренние (если есть)
			// Если по внешней - поведение стандартное
			const isInner = group.classList.contains('sort-inner-wrapper');

			sortGroups.forEach((g) => {
				// Не закрываем самого себя
				if (g === group) {
					return;
				}

				// Если открываем вложенный, не закрываем родителя!
				if (isInner && g.contains(group)) {
					return;
				}

				g.classList.remove('is-active');
			});

			group.classList.toggle('is-active');
		});

		// 3. Выбор пункта списка (ТОЛЬКО ДЛЯ ВНУТРЕННЕГО БЛОКА)
		// Проверяем, является ли эта группа блоком выбора сортировки
		if (group.classList.contains('sort-inner-wrapper')) {
			listItems.forEach((item) => {
				item.addEventListener('click', (e) => {
					e.stopPropagation(); // Важно, чтобы не закрылся родительский аккордеон

					// Убираем активный класс у пунктов
					listItems.forEach((li) => li.classList.remove('is-active'));
					item.classList.add('is-active');

					// Меняем текст внутри span (безопасно для иконки)
					const textSpan = btn.querySelector('span');
					if (textSpan) {
						textSpan.textContent = item.textContent.trim();
					} else {
						// Фолбэк, если спана нет (как в вашем старом коде)
						if (btn.firstChild) {
							btn.firstChild.textContent = item.textContent.trim() + ' ';
						}
					}

					// Закрываем только этот выпадающий список
					group.classList.remove('is-active');
				});
			});
		}
	});
}
