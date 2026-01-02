export function initCartButtons() {
	// Находим все кнопки добавления в корзину
	const buttons = document.querySelectorAll('.js-add-to-cart');

	buttons.forEach((btn) => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();

			if (btn.classList.contains('is-in-cart')) {
				btn.classList.remove('is-in-cart');
				btn.textContent = 'В корзину';
			} else {
				btn.classList.add('is-in-cart');

				btn.innerHTML = `
          <svg class="icon btn-icon-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>В корзине</span>
        `;
			}
		});
	});
}
