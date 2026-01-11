export function initCheckout() {
	/* ===============================
		1. ХЕЛПЕРЫ
	================================ */
	const formatPrice = (num) => `${num.toLocaleString('ru-RU')} ₽`;
	const parsePrice = (str) => parseInt(str.replace(/\D/g, ''), 10) || 0;

	/* ===============================
		2. DOM
	================================ */
	const cartBlock = document.querySelector('.checkout__block:first-child');
	const goodsTotalEl = document.querySelector('.checkout-summary__item:first-child .checkout-summary__value');
	const grandTotalEl = document.querySelector('.checkout-summary__total-price');

	/* ===============================
		3. ПЕРЕСЧЁТ КОРЗИНЫ
	================================ */
	const updateCartTotals = () => {
		let goodsSum = 0;

		document.querySelectorAll('.checkout-product').forEach((product) => {
			const price = parsePrice(product.querySelector('.checkout-product__price-unit')?.textContent || '');

			const count = parseInt(product.querySelector('.counter__number')?.textContent || '0', 10);

			const itemTotal = price * count;
			goodsSum += itemTotal;

			const totalEl = product.querySelector('.checkout-product__total');
			if (totalEl) {
				totalEl.textContent = formatPrice(itemTotal);
			}
		});

		// доставка
		let deliveryCost = 0;
		const activeDelivery = document.querySelector('input[name="delivery"]:checked');
		if (activeDelivery) {
			const priceText = activeDelivery.nextElementSibling?.querySelector('.radio-checkbox__text span:last-child b')?.textContent || '';

			if (priceText.toLowerCase() !== 'бесплатно') {
				deliveryCost = parsePrice(priceText);
			}
		}

		if (goodsTotalEl) {
			goodsTotalEl.textContent = formatPrice(goodsSum);
		}
		if (grandTotalEl) {
			grandTotalEl.textContent = formatPrice(goodsSum + deliveryCost);
		}
	};

	/* ===============================
		4. СОБЫТИЯ КОРЗИНЫ
	================================ */
	if (cartBlock) {
		// Удаление / очистка
		cartBlock.addEventListener('click', (e) => {
			const product = e.target.closest('.checkout-product');

			if (e.target.closest('.checkout-product__remove')) {
				if (confirm('Удалить товар?')) {
					product?.remove();
					updateCartTotals();
				}
			}

			if (e.target.closest('.section-header__link')) {
				if (confirm('Очистить корзину?')) {
					cartBlock.querySelector('.checkout-list').innerHTML = '';
					updateCartTotals();
				}
			}
		});

		// ⬅️ ЕДИНСТВЕННОЕ место реакции на изменение счётчика
		cartBlock.addEventListener('counter:change', () => {
			updateCartTotals();
		});
	}

	/* ===============================
		5. ДОСТАВКА
	================================ */
	const deliveryBlock = document.querySelector('.js-change-city')?.closest('.checkout__block');

	if (deliveryBlock) {
		const sidebarDeliveryName = document.querySelector('.checkout-summary__params .checkout-summary__row:first-child .checkout-summary__param-value');
		const sidebarDeliveryCost = document.querySelector('.checkout-summary__item:nth-child(2) .checkout-summary__value');

		deliveryBlock.querySelectorAll('input[name="delivery"]').forEach((radio) => {
			radio.addEventListener('change', () => {
				const label = radio.nextElementSibling;
				const name = label.querySelector('.radio-checkbox__text span:first-child')?.textContent || '';
				const price = label.querySelector('.radio-checkbox__text span:last-child b')?.textContent || '';

				if (sidebarDeliveryName) {
					sidebarDeliveryName.textContent = name;
				}
				if (sidebarDeliveryCost) {
					sidebarDeliveryCost.textContent = price;
				}

				updateCartTotals();
			});
		});
	}

	/* ===============================
		6. ОПЛАТА
	================================ */
	const paymentBlock = document.querySelector('.js-change-pay')?.closest('.checkout__block');

	if (paymentBlock) {
		const sidebarPaymentName = document.querySelector('.checkout-summary__params .checkout-summary__row:last-child .checkout-summary__param-value');

		paymentBlock.querySelectorAll('input[name="payment"]').forEach((radio) => {
			radio.addEventListener('change', () => {
				const name = radio.nextElementSibling?.querySelector('.radio-checkbox__text span span')?.textContent || '';

				if (sidebarPaymentName) {
					sidebarPaymentName.textContent = name;
				}
			});
		});
	}

	/* ===============================
		7. ИНИЦИАЛИЗАЦИЯ
	================================ */
	updateCartTotals();
}
