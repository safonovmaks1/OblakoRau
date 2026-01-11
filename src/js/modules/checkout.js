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
		const changeBtn = deliveryBlock.querySelector('.js-change-city');
		const titles = deliveryBlock.querySelectorAll('.checkout__title'); // [0] - Обычно, [1] - В городе...
		const subtitle = deliveryBlock.querySelector('.checkout__subtitle'); // Другой город
		const searchBlock = document.getElementById('city-search');
		const searchInput = searchBlock?.querySelector('input');
		const searchResultList = searchBlock?.querySelector('.search-result ul');

		const deliveryCards = deliveryBlock.querySelector('.checkout-card');
		const addressForm = deliveryBlock.querySelector('.form__body.mt-2');
		const infoSummary = deliveryBlock.querySelector('.checkout-info');

		// Сайдбар параметры
		const sidebarDeliveryName = document.querySelector('.checkout-summary__params .checkout-summary__row:first-child .checkout-summary__param-value');
		const sidebarDeliveryCost = document.querySelector('.checkout-summary__item:nth-child(2) .checkout-summary__value');

		// База городов (Мок)
		const cities = ['Москва', 'Санкт-Петербург', 'Екатеринбург', 'Казань', 'Новосибирск', 'Сочи'];

		// 1. Кнопка "Изменить"
		changeBtn.addEventListener('click', () => {
			const isEditMode = changeBtn.textContent.trim().toLowerCase() !== 'изменить';

			if (!isEditMode) {
				// ВКЛЮЧАЕМ РЕДАКТИРОВАНИЕ
				changeBtn.textContent = 'Готово';

				// Меняем заголовки
				titles[0].classList.add('hidden');
				titles[1].classList.remove('hidden'); // "Способ доставки в городе..."

				// Показываем кнопку "Другой город"
				subtitle.classList.remove('hidden');

				// Показываем карточки и форму
				deliveryCards.classList.remove('hidden');
				addressForm.classList.remove('hidden');

				// Скрываем сводку
				infoSummary.classList.add('hidden');
			} else {
				// ВЫКЛЮЧАЕМ РЕДАКТИРОВАНИЕ (СОХРАНИТЬ)
				changeBtn.textContent = 'Изменить';

				// Возвращаем заголовки (или оставляем как есть, по логике UX)
				titles[0].classList.remove('hidden');
				titles[1].classList.add('hidden');

				subtitle.classList.add('hidden');
				searchBlock.classList.add('hidden');
				deliveryCards.classList.add('hidden');
				addressForm.classList.add('hidden');
				infoSummary.classList.remove('hidden');
			}
		});

		// 2. Кнопка "Другой город"
		subtitle.addEventListener('click', () => {
			searchBlock.classList.toggle('hidden');
		});

		// 3. Поиск города
		if (searchInput) {
			searchInput.addEventListener('input', (e) => {
				const val = e.target.value.toLowerCase();
				const filtered = cities.filter((city) => city.toLowerCase().includes(val));

				searchResultList.innerHTML = '';
				filtered.forEach((city) => {
					const li = document.createElement('li');
					li.textContent = city;
					searchResultList.appendChild(li);
				});
			});

			// Клик по городу
			searchResultList.addEventListener('click', (e) => {
				if (e.target.tagName === 'LI') {
					const city = e.target.textContent;

					// Обновляем заголовок
					titles[1].textContent = `Способ доставки в городе ${city}`;

					// Обновляем сводку (город)
					const summaryCity = infoSummary.querySelector('.checkout-info__item:first-child .checkout-info__value');
					if (summaryCity) {
						summaryCity.textContent = city;
					}

					// Скрываем поиск
					searchBlock.classList.add('hidden');
					searchInput.value = '';
				}
			});
		}

		// 4. Выбор радио-кнопки доставки
		const deliveryRadios = deliveryBlock.querySelectorAll('input[name="delivery"]');
		deliveryRadios.forEach((radio) => {
			radio.addEventListener('change', () => {
				// Получаем данные из label
				const label = radio.nextElementSibling;
				const nameText = label.querySelector('.radio-checkbox__text span:first-child').textContent;
				const priceText = label.querySelector('.radio-checkbox__text span:last-child b').textContent;

				// Обновляем сводку внутри блока
				const summaryName = infoSummary.querySelector('.checkout-info__name');
				const summaryPrice = infoSummary.querySelector('.checkout-info__item:last-child .checkout-info__value');

				if (summaryName) {
					summaryName.textContent = nameText;
				}
				if (summaryPrice) {
					summaryPrice.textContent = priceText;
				}

				// Обновляем САЙДБАР
				if (sidebarDeliveryName) {
					sidebarDeliveryName.textContent = nameText;
				}
				if (sidebarDeliveryCost) {
					sidebarDeliveryCost.textContent = priceText;
					if (priceText.toLowerCase() === 'бесплатно') {
						sidebarDeliveryCost.classList.add('checkout-summary__value--green');
					} else {
						sidebarDeliveryCost.classList.remove('checkout-summary__value--green');
					}
				}

				// Пересчитываем ИТОГО
				updateCartTotals();
			});
		});
	}

	/* ===============================
		6. ОПЛАТА
	================================ */
	const paymentBlock = document.querySelector('.js-change-pay')?.closest('.checkout__block');

	if (paymentBlock) {
		const changeBtn = paymentBlock.querySelector('.js-change-pay');
		const paymentCards = paymentBlock.querySelector('.checkout-card');
		const infoSummary = paymentBlock.querySelector('.checkout-info');
		const sidebarPaymentName = document.querySelector('.checkout-summary__params .checkout-summary__row:last-child .checkout-summary__param-value');

		changeBtn.addEventListener('click', () => {
			const isEditMode = changeBtn.textContent.trim().toLowerCase() !== 'изменить';

			if (!isEditMode) {
				// Редактирование
				changeBtn.textContent = 'Готово';
				paymentCards.classList.remove('hidden');
				infoSummary.classList.add('hidden');
			} else {
				// Просмотр
				changeBtn.textContent = 'Изменить';
				paymentCards.classList.add('hidden');
				infoSummary.classList.remove('hidden');
			}
		});

		// Выбор радио-кнопки оплаты
		const payRadios = paymentBlock.querySelectorAll('input[name="payment"]');
		payRadios.forEach((radio) => {
			radio.addEventListener('change', () => {
				const label = radio.nextElementSibling;
				const nameText = label.querySelector('.radio-checkbox__text span span').textContent;

				// Обновляем сводку внутри блока
				const summaryName = infoSummary.querySelector('.checkout-info__name');
				if (summaryName) {
					summaryName.textContent = nameText;
				}

				// Обновляем САЙДБАР
				if (sidebarPaymentName) {
					sidebarPaymentName.textContent = nameText;
				}
			});
		});
	}

	/* ===============================
		7. ИНИЦИАЛИЗАЦИЯ
	================================ */
	updateCartTotals();
}
