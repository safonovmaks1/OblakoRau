import '@a1rth/css-normalize';
import '../../styles/ui-kit.scss';

const root = document.querySelector('.ui-kit');

if (root) {
	const quantityOutput = root.querySelector('[data-quantity]');
	const totalOutput = root.querySelector('[data-total]');
	const toast = root.querySelector('[data-toast-message]');
	const modal = root.querySelector('[data-modal]');

	const unitPrice = 18900;
	let quantity = 1;
	let toastTimeout;

	const formatPrice = (value) => `${new Intl.NumberFormat('ru-RU').format(value)} ₽`;

	function updateQuantity() {
		quantityOutput.textContent = quantity;
		totalOutput.textContent = formatPrice(unitPrice * quantity);
	}

	function showToast(message = 'Изменения применены') {
		toast.textContent = message;
		toast.classList.add('is-visible');

		window.clearTimeout(toastTimeout);

		toastTimeout = window.setTimeout(() => {
			toast.classList.remove('is-visible');
		}, 2500);
	}

	function openModal() {
		modal.setAttribute('aria-hidden', 'false');
		document.body.style.overflow = 'hidden';

		modal.querySelector('[data-modal-close]')?.focus();
	}

	function closeModal() {
		modal.setAttribute('aria-hidden', 'true');
		document.body.style.overflow = '';
	}

	root.addEventListener('click', (event) => {
		const favoriteButton = event.target.closest('[data-favorite]');

		if (favoriteButton) {
			const isActive = favoriteButton.getAttribute('aria-pressed') === 'true';

			favoriteButton.setAttribute('aria-pressed', String(!isActive));
			favoriteButton.textContent = isActive ? '♡' : '♥';

			showToast(isActive ? 'Удалено из избранного' : 'Добавлено в избранное');
		}

		if (event.target.closest('[data-quantity-minus]')) {
			quantity = Math.max(1, quantity - 1);
			updateQuantity();
		}

		if (event.target.closest('[data-quantity-plus]')) {
			quantity = Math.min(99, quantity + 1);
			updateQuantity();
		}

		if (event.target.closest('[data-toast]')) {
			showToast('Это демонстрационное уведомление');
		}

		if (event.target.closest('[data-modal-open]')) {
			openModal();
		}

		if (event.target.closest('[data-modal-close]')) {
			closeModal();
		}
	});

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
			closeModal();
		}
	});

	updateQuantity();
}
