/**
 * Модуль для управления встроенным окном оплаты (overlay) внутри карточки заказа.
 */
export function initPaymentOverlay() {
	document.addEventListener('click', (e) => {
		const target = e.target;

		// --- ЛОГИКА ОТКРЫТИЯ ---
		const openBtn = target.closest('.js-show-payment');
		if (openBtn) {
			e.preventDefault();

			// Ищем родительскую карточку
			const card = openBtn.closest('.order-card__section');
			if (!card) {
				return;
			}

			// Ищем оверлей именно внутри этой карточки
			const overlay = card.querySelector('.js-payment-overlay');
			if (overlay) {
				overlay.classList.add('is-visible');
			}
			return;
		}

		// --- ЛОГИКА ЗАКРЫТИЯ (Кнопка крестик) ---
		const closeBtn = target.closest('.js-close-payment');
		if (closeBtn) {
			e.preventDefault();

			const overlay = closeBtn.closest('.js-payment-overlay');
			if (overlay) {
				overlay.classList.remove('is-visible');
			}
			return;
		}

		// --- ЛОГИКА ЗАКРЫТИЯ (Клик вне области контента, опционально) ---
		// Если нужно закрывать при клике на белое пространство вокруг (если оверлей не во весь блок)
		// Но так как у вас оверлей перекрывает всё (width: 100%), это не обязательно.
	});
}
