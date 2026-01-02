export function initSizeSelector(selector = '.size-options') {
	const containers = document.querySelectorAll(selector);

	containers.forEach((container) => {
		// Используем data-атрибут или класс для поиска текста, куда писать размер
		// Например: <span class="size-options__current"></span>
		const displaySpan = container.querySelector('.size-options__current') || container.querySelector('span');
		const buttons = container.querySelectorAll('.size-button');

		// Ищем скрытый инпут внутри этой же формы/блока
		const hiddenInput = container.closest('form')?.querySelector('input[name="size"]');

		if (!buttons.length) {
			return;
		}

		buttons.forEach((button) => {
			button.addEventListener('click', (e) => {
				e.preventDefault(); // Чтобы не кликало, если это button внутри формы

				// 1. Визуальное обновление
				if (displaySpan) {
					// Берем чистый текст размера (без лишних пробелов)
					displaySpan.textContent = `- ${button.textContent.trim()}`;
				}

				// 2. Классы
				buttons.forEach((btn) => btn.classList.remove('active'));
				button.classList.add('active');

				// 3. Обновление данных для формы
				if (hiddenInput) {
					// Если у кнопки есть data-value, берем его, иначе текст
					hiddenInput.value = button.dataset.value || button.textContent.trim();
				}
			});
		});
	});
}
