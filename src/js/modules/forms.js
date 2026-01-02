/* eslint-disable no-console */
export function initForms() {
	const forms = document.querySelectorAll('form');

	forms.forEach((form) => {
		// === ХЕЛПЕР: ПОКАЗАТЬ ОШИБКУ ===
		const showError = (input, customMessage = null) => {
			const wrapper = input.closest('.form__field') || input.closest('.form__item');
			if (!wrapper) {
				return;
			}

			const errorEl = wrapper.querySelector('.form__error');
			const errorTextSpan = errorEl?.querySelector('span');

			input.classList.add('_error');

			if (errorEl) {
				// Если передали свой текст (например "Пароли не совпадают"), меняем его
				if (customMessage && errorTextSpan) {
					// Сохраняем оригинальный текст, если его еще нет
					if (!errorTextSpan.dataset.originalText) {
						errorTextSpan.dataset.originalText = errorTextSpan.textContent;
					}
					errorTextSpan.textContent = customMessage;
				}

				errorEl.style.opacity = '1';
				errorEl.style.visibility = 'visible';
			}
		};

		// === ХЕЛПЕР: СКРЫТЬ ОШИБКУ ===
		const hideError = (input) => {
			const wrapper = input.closest('.form__field') || input.closest('.form__item');
			if (!wrapper) {
				return;
			}

			const errorEl = wrapper.querySelector('.form__error');
			const errorTextSpan = errorEl?.querySelector('span');

			input.classList.remove('_error');

			if (errorEl) {
				errorEl.style.opacity = '0';
				errorEl.style.visibility = 'hidden';

				// Возвращаем оригинальный текст через 300мс (после анимации)
				if (errorTextSpan && errorTextSpan.dataset.originalText) {
					setTimeout(() => {
						errorTextSpan.textContent = errorTextSpan.dataset.originalText;
					}, 300);
				}
			}
		};

		// === 2. СЛУШАТЕЛИ ВВОДА (мгновенное скрытие ошибок) ===
		const inputs = form.querySelectorAll('input, textarea');
		inputs.forEach((input) => {
			const eventType = input.type === 'checkbox' || input.type === 'file' ? 'change' : 'input';
			input.addEventListener(eventType, () => {
				if (input.classList.contains('_error')) {
					hideError(input);
				}
			});
		});

		// === 3. ОТПРАВКА ФОРМЫ (SUBMIT) ===
		form.addEventListener('submit', (e) => {
			e.preventDefault();
			let isValid = true;

			// 3.1. Сбрасываем все ошибки перед новой проверкой
			inputs.forEach((input) => hideError(input));

			// 3.2. Проверка обязательных полей (_req)
			const requiredFields = form.querySelectorAll('._req');
			requiredFields.forEach((field) => {
				if (!field.value.trim()) {
					showError(field);
					isValid = false;
				}
			});

			// 3.3. Проверка Email
			const emailField = form.querySelector('input[name="email"]');
			if (emailField && emailField.value.trim()) {
				const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailPattern.test(emailField.value.trim())) {
					showError(emailField, 'Некорректный E-mail');
					isValid = false;
				}
			}

			// 3.4. Проверка Чекбокса (Согласие)
			const agreement = form.querySelector('input[name="agreement"]');
			if (agreement && !agreement.checked) {
				showError(agreement);
				isValid = false;
			}

			// === 3.5. ПРОВЕРКА ПАРОЛЕЙ ===
			const pass = form.querySelector('input[name="password"]');
			const confirm = form.querySelector('input[name="confirm_password"]');

			if (pass && confirm && pass.value && confirm.value) {
				if (pass.value !== confirm.value) {
					showError(confirm, 'Пароли не совпадают');
					pass.classList.add('_error');
					isValid = false;
				}
			}

			// Если есть ошибки — останавливаемся
			if (!isValid) {
				return;
			}

			// === 4. УСПЕШНАЯ ОТПРАВКА ===
			const formData = new FormData(form);
			const dataObject = Object.fromEntries(formData);

			console.group('🚀 Данные формы');
			console.log(dataObject);
			console.groupEnd();

			// Логика обработки UI после отправки
			const modal = form.closest('.modal') || form.closest('[data-modal]');

			if (modal) {
				// --- ВАРИАНТ 1: Форма в модальном окне ---
				const header = modal.querySelector('.modal__header');
				const title = modal.querySelector('.modal__title');
				const thanks = modal.querySelector('.modal__thanks');

				if (header) {
					header.style.display = 'none';
				}
				if (title) {
					title.style.display = 'none';
				}
				form.style.display = 'none';

				if (thanks) {
					thanks.style.display = 'block';
				}

				setTimeout(() => {
					if (header) {
						header.style.display = '';
					}
					form.style.display = '';
					if (thanks) {
						thanks.style.display = 'none';
					}

					modal.classList.remove('is-open');
					document.documentElement.classList.remove('is-lock');
					form.reset();
				}, 2000);
			} else {
				// --- ВАРИАНТ 2: Форма в личном кабинете (статичная) ---

				// Ищем сообщение об успехе сразу после формы
				const successMessage = form.nextElementSibling;

				if (successMessage && successMessage.classList.contains('js-alert-success')) {
					successMessage.classList.remove('hidden');

					// Скрываем сообщение через 3 секунды
					setTimeout(() => {
						successMessage.classList.add('hidden');
					}, 3000);
				} else {
					// Фолбэк, если сообщения в верстке нет
					alert('Данные сохранены!');
				}

				// Очищаем форму ТОЛЬКО если это смена пароля
				if (form.id === 'change-pass') {
					form.reset();
				}
			}
		});
	});
}
