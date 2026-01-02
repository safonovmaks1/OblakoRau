export default function aboutToggle(selector) {
	const content = document.querySelector(selector);

	// Ищем кнопку рядом (обычно она идет следом за блоком текста)
	// Используем closest, чтобы найти обертку, и ищем кнопку внутри нее
	const wrapper = content?.parentElement;
	const btn = wrapper?.querySelector('.about-main__button');

	if (!content || !btn) {
		return;
	}

	// Берем высоту из CSS (150px) или из настроек
	// parseInt('150px') вернет 150
	const collapsedHeight = parseInt(window.getComputedStyle(content).maxHeight) || 150;

	// 1. УМНАЯ ПРОВЕРКА:
	// Если реальная высота контента меньше или равна свернутой высоте,
	// то кнопка и градиент не нужны.
	if (content.scrollHeight <= collapsedHeight) {
		btn.style.display = 'none';
		content.classList.add('is-open'); // Убираем градиент (через CSS)
		content.style.maxHeight = 'none'; // Убираем ограничение
		return;
	}

	// Тексты кнопок
	const textShow = btn.dataset.showText || 'Показать еще';
	const textHide = btn.dataset.textHide || 'Свернуть';

	// Устанавливаем начальный текст
	btn.textContent = textShow;

	// 2. КЛИК ПО КНОПКЕ
	btn.addEventListener('click', () => {
		// Переключаем класс (он уберет градиент через opacity: 0)
		const isOpen = content.classList.toggle('is-open');

		if (isOpen) {
			// РАЗВОРАЧИВАЕМ:
			// Ставим точную высоту контента в пикселях, чтобы сработал transition
			content.style.maxHeight = `${content.scrollHeight}px`;
			btn.textContent = textHide;
		} else {
			// СВОРАЧИВАЕМ:
			// Возвращаем фиксированную высоту
			content.style.maxHeight = `${collapsedHeight}px`;
			btn.textContent = textShow;
		}
	});
}
