export default function initTogglePassword({
	selector = '.form__field',
	iconSelector = '.form__icon-abs', // Уточнил селектор
	openIcon = 'images/sprite.symbol.svg#eye',
	closeIcon = 'images/sprite.symbol.svg#eye-off',
} = {}) {
	const fields = document.querySelectorAll(selector);

	fields.forEach((field) => {
		// Ищем только внутри конкретного поля
		const input = field.querySelector('input[type="password"], input[data-password-toggle]');
		const icon = field.querySelector(iconSelector);

		if (!input || !icon) {
			return;
		}

		icon.addEventListener('click', (e) => {
			e.preventDefault(); // Предотвращаем случайное выделение
			const useTag = icon.querySelector('use');
			const isPassword = input.type === 'password';

			// Переключаем тип
			input.type = isPassword ? 'text' : 'password';

			// Меняем иконку (поддержка и старых, и новых браузеров)
			const newIcon = isPassword ? openIcon : closeIcon;
			if (useTag) {
				if (useTag.hasAttribute('xlink:href')) {
					useTag.setAttribute('xlink:href', newIcon);
				} else {
					useTag.setAttribute('href', newIcon);
				}
			}
		});
	});
}
