/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
export function initCheckout() {
	/* =========================================
     1. ХЕЛПЕРЫ (Форматирование цен)
     ========================================= */
	const formatPrice = (num) => {
		return num.toLocaleString('ru-RU') + ' ₽';
	};

	const parsePrice = (str) => {
		return parseInt(str.replace(/\D/g, '')) || 0;
	};

	/* =========================================
     2. КОРЗИНА (Удаление, Счетчики, Итого)
     ========================================= */
	const cartBlock = document.querySelector('.checkout__block:first-child'); // Первый блок - товары
	const goodsTotalEl = document.querySelector('.checkout-summary__item:first-child .checkout-summary__value'); // Сайдбар: Товаров на
	const grandTotalEl = document.querySelector('.checkout-summary__total-price'); // Сайдбар: Итого
	const deliveryValueEl = document.querySelector('.checkout-summary__item:nth-child(2) .checkout-summary__value'); // Сайдбар: Доставка

	// Функция пересчета всей корзины и итогов
	const updateCartTotals = () => {
		let goodsSum = 0;

		// 1. Считаем сумму товаров
		const products = document.querySelectorAll('.checkout-product');
		products.forEach((product) => {
			// Ищем цену за штуку (парсим текст "42 000 ₽/шт")
			const priceUnitText = product.querySelector('.checkout-product__price-unit').textContent;
			const price = parsePrice(priceUnitText);

			// Ищем количество
			const countEl = product.querySelector('.counter__number');
			const count = parseInt(countEl.textContent);

			// Считаем сумму позиции
			const itemTotal = price * count;
			goodsSum += itemTotal;

			// Обновляем "Итого" внутри карточки товара
			const itemTotalEl = product.querySelector('.checkout-product__total');
			itemTotalEl.textContent = formatPrice(itemTotal);
		});

		// 2. Получаем стоимость доставки
		let deliveryCost = 0;
		const activeDelivery = document.querySelector('input[name="delivery"]:checked');
		if (activeDelivery) {
			// Ищем цену в HTML (парсим "800 ₽" или "бесплатно")
			const label = activeDelivery.nextElementSibling;
			const priceText = label.querySelector('.radio-checkbox__text span:last-child b').textContent;
			if (priceText.toLowerCase() !== 'бесплатно') {
				deliveryCost = parsePrice(priceText);
			}
		}

		// 3. Обновляем сайдбар
		if (goodsTotalEl) {
			goodsTotalEl.textContent = formatPrice(goodsSum);
		}

		// Обновляем общую сумму
		if (grandTotalEl) {
			grandTotalEl.textContent = formatPrice(goodsSum + deliveryCost);
		}

		// Если товаров нет, перезагружаем или показываем пустой экран
		if (products.length === 0) {
			// cartBlock.innerHTML = '<p>Корзина пуста</p>'; // Можно так
			// grandTotalEl.textContent = '0 ₽';
		}
	};

	// Обработчики событий корзины (делегирование)
	if (cartBlock) {
		cartBlock.addEventListener('click', (e) => {
			const target = e.target;
			const product = target.closest('.checkout-product');

			// Удаление товара
			if (target.closest('.checkout-product__remove')) {
				if (confirm('Удалить товар?')) {
					product.remove();
					updateCartTotals();
				}
			}

			// Очистить всё
			if (target.closest('.section-header__link')) {
				const list = cartBlock.querySelector('.checkout-list');
				if (list && confirm('Очистить корзину?')) {
					list.innerHTML = '';
					updateCartTotals();
				}
			}

			// Счетчик: Плюс
			if (target.closest('.counter__plus')) {
				const counter = target.closest('.counter');
				const numEl = counter.querySelector('.counter__number');
				const input = counter.querySelector('input'); // Скрытый инпут
				let val = parseInt(numEl.textContent);
				val++;
				numEl.textContent = val;
				if (input) {
					input.value = val;
				}
				updateCartTotals();
			}

			// Счетчик: Минус
			if (target.closest('.counter__minus')) {
				const counter = target.closest('.counter');
				const numEl = counter.querySelector('.counter__number');
				const input = counter.querySelector('input');
				let val = parseInt(numEl.textContent);
				if (val > 1) {
					val--;
					numEl.textContent = val;
					if (input) {
						input.value = val;
					}
					updateCartTotals();
				}
			}
		});
	}

	/* =========================================
     3. БЛОК ДОСТАВКИ (Города, Поиск, Переключение)
     ========================================= */
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
				// titles[0].classList.remove('hidden');
				// titles[1].classList.add('hidden');

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

	/* =========================================
     4. БЛОК ОПЛАТЫ
     ========================================= */
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

	/* =========================================
     5. ОТПРАВКА ФОРМЫ (Mock Запрос)
     ========================================= */
	const form = document.getElementById('checkout');
	if (form) {
		form.addEventListener('submit', (e) => {
			e.preventDefault();

			const btn = form.querySelector('button[type="submit"]');
			const originalText = btn.textContent;

			// Простая валидация
			let hasError = false;
			form.querySelectorAll('._req').forEach((input) => {
				if (input.value.trim() === '') {
					input.classList.add('_error');
					hasError = true;
				} else {
					input.classList.remove('_error');
				}
			});

			if (hasError) {
				alert('Пожалуйста, заполните обязательные поля');
				return;
			}

			// Имитация отправки
			btn.textContent = 'Оформление...';
			btn.disabled = true;

			// Собираем данные
			const formData = new FormData(form);
			const data = {};
			formData.forEach((value, key) => (data[key] = value));

			console.log('Отправка данных:', data);

			setTimeout(() => {
				alert('Заказ успешно оформлен!');
				btn.textContent = originalText;
				btn.disabled = false;
				form.reset();
				// window.location.href = '/success.html';
			}, 1500);
		});
	}

	// Инициализация подсчета при загрузке
	updateCartTotals();
}
