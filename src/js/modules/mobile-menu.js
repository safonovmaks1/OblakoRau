/* eslint-disable no-console */

export function createMobileMenu(userOptions = {}) {
	// 1. НАСТРОЙКИ (Константы внутри замыкания)
	const defaults = {
		menuSelector: '#mainMenu',
		burgerSelector: '#burgerBtn',
		overlaySelector: '#menuOverlay',
		panelSelector: '.menu__panel',
		backBtnSelector: '.menu__back',
		forwardLinkSelector: '[data-target]',
		closeLinkSelector: 'a:not([data-target])',
		lockClass: 'is-lock',
	};

	const s = { ...defaults, ...userOptions };

	// 2. DOM ЭЛЕМЕНТЫ
	const menu = document.querySelector(s.menuSelector);
	const burger = document.querySelector(s.burgerSelector);
	const overlay = document.querySelector(s.overlaySelector);

	// Если чего-то нет, тихо выходим или кидаем ошибку
	if (!menu || !burger || !overlay) {
		console.warn('MobileMenu: Не найдены обязательные элементы DOM');
		return null; // Возвращаем null, чтобы показать ошибку инициализации
	}

	const panels = Array.from(menu.querySelectorAll(s.panelSelector));

	// 3. СОСТОЯНИЕ (State)
	// Переменная живет внутри функции, снаружи к ней доступа нет (инкапсуляция)
	let history = [0];

	// 4. ВНУТРЕННИЕ ФУНКЦИИ (Helpers)

	const updatePanels = () => {
		const activeIndex = history[history.length - 1];

		panels.forEach((panel, index) => {
			panel.classList.remove('is-active', 'is-left');
			panel.setAttribute('aria-hidden', 'true');

			if (index === activeIndex) {
				panel.classList.add('is-active');
				panel.setAttribute('aria-hidden', 'false');
			} else if (history.includes(index)) {
				panel.classList.add('is-left');
			}
		});
	};

	const goForward = (targetName) => {
		const targetIndex = panels.findIndex((p) => p.dataset.title === targetName);

		if (targetIndex !== -1) {
			history.push(targetIndex);
			updatePanels();
			panels[targetIndex].scrollTop = 0; // Скролл вверх
		} else {
			console.warn(`MobileMenu: Панель "${targetName}" не найдена`);
		}
	};

	const goBack = () => {
		if (history.length > 1) {
			history.pop();
			updatePanels();
		}
	};

	// 5. ПУБЛИЧНЫЕ МЕТОДЫ (API)

	const open = () => {
		menu.classList.add('open');
		overlay.classList.add('active');
		document.body.classList.add(s.lockClass);

		// Сброс при открытии
		history = [0];
		updatePanels();
	};

	const close = () => {
		menu.classList.remove('open');
		overlay.classList.remove('active');
		document.body.classList.remove(s.lockClass);

		// Ждем анимацию CSS перед сбросом
		setTimeout(() => {
			history = [0];
			updatePanels();
		}, 400);
	};

	// 6. ИНИЦИАЛИЗАЦИЯ СОБЫТИЙ

	const initEvents = () => {
		// Открытие/Закрытие
		burger.addEventListener('click', open);
		overlay.addEventListener('click', close);

		// Вперед
		menu.querySelectorAll(s.forwardLinkSelector).forEach((btn) => {
			btn.addEventListener('click', (e) => {
				e.preventDefault();
				goForward(btn.dataset.target);
			});
		});

		// Назад
		menu.querySelectorAll(s.backBtnSelector).forEach((btn) => {
			btn.addEventListener('click', goBack);
		});

		// Закрытие по ссылке
		menu.querySelectorAll(s.closeLinkSelector).forEach((link) => {
			link.addEventListener('click', close);
		});

		// ESC
		document.addEventListener('keydown', (e) => {
			if (e.key === 'Escape' && menu.classList.contains('open')) {
				close();
			}
		});
	};

	// Запускаем слушатели сразу при создании
	initEvents();

	// Первая отрисовка
	updatePanels();

	// Возвращаем объект с методами, которыми можно управлять снаружи
	return {
		open,
		close,
	};
}
