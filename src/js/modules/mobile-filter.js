/**
 * Модуль для управления мобильным фильтром (сайдбаром)
 */
export function initMobileFilter() {
	const filter = document.querySelector('.js-mobile-filter');
	// Кнопка открытия (та, что в каталоге)
	const openBtn = document.querySelector('.js-filter-open-btn');
	// Кнопки закрытия (крестик, оверлей, кнопка "Показать")
	const closeBtns = document.querySelectorAll('.js-mobile-filter-close');

	if (!filter || !openBtn) {
		return;
	}

	// Функция открытия
	const openFilter = (e) => {
		e.preventDefault();
		filter.classList.add('is-open');
		document.body.classList.add('is-lock'); // Блокируем скролл страницы
	};

	// Функция закрытия
	const closeFilter = () => {
		filter.classList.remove('is-open');
		document.body.classList.remove('is-lock'); // Разблокируем скролл
	};

	// Вешаем слушатель на кнопку открытия
	openBtn.addEventListener('click', openFilter);

	// Вешаем слушатели на все кнопки закрытия
	closeBtns.forEach((btn) => {
		btn.addEventListener('click', closeFilter);
	});

	// Закрытие по клавише Esc (для удобства)
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && filter.classList.contains('is-open')) {
			closeFilter();
		}
	});
}
