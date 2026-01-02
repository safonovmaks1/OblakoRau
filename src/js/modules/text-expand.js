export default function initTextExpand() {
	const triggers = document.querySelectorAll('.js-expand-btn');

	triggers.forEach((btn) => {
		btn.addEventListener('click', () => {
			// 1. Находим скрытый блок (он должен быть перед кнопкой)
			// Можно использовать previousElementSibling или closest, если верстка сложнее
			const wrapper = btn.previousElementSibling;

			if (!wrapper || !wrapper.classList.contains('js-expand-wrapper')) {
				return;
			}

			const textSpan = btn.querySelector('span');
			const textOpened = btn.dataset.textOpened || 'Свернуть';
			const textClosed = btn.dataset.textClosed || 'Развернуть';

			// 2. Переключаем классы
			wrapper.classList.toggle('is-expanded');
			btn.classList.toggle('is-active');

			// 3. Меняем текст
			if (wrapper.classList.contains('is-expanded')) {
				if (textSpan) {
					textSpan.textContent = textOpened;
				}
			} else {
				if (textSpan) {
					textSpan.textContent = textClosed;
				}
			}
		});
	});
}
