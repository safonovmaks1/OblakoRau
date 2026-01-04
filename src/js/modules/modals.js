const modals = new Map();

function createModal(root) {
	let isOpen = false;
	const overlay = root.querySelector('[data-modal-overlay]');
	const closeBtn = root.querySelector('[data-modal-close]');

	function open() {
		root.classList.add('is-open');
		document.documentElement.classList.add('is-lock');
		isOpen = true;
	}

	function close() {
		root.classList.remove('is-open');

		// Проверяем, есть ли другие открытые модалки, прежде чем разблокировать скролл
		// Это защита от мигания скролла при переключении окон
		let hasOtherOpen = false;
		modals.forEach((m) => {
			if (m.isOpen && m !== instance) {
				hasOtherOpen = true;
			}
		});

		if (!hasOtherOpen) {
			document.documentElement.classList.remove('is-lock');
		}

		isOpen = false;
	}

	// Закрытие по overlay
	if (overlay) {
		overlay.addEventListener('click', close);
	}

	// Закрытие по кнопке
	if (closeBtn) {
		closeBtn.addEventListener('click', close);
	}

	// Закрытие по Esc
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && isOpen) {
			close();
		}
	});

	// Создаем объект инстанса, чтобы можно было ссылаться на него внутри close()
	const instance = {
		open,
		close,
		get isOpen() {
			return isOpen;
		}, // Геттер для проверки состояния снаружи
	};

	return instance;
}

export function initModals() {
	// Инициализация модалок...
	document.querySelectorAll('[data-modal]').forEach((el) => {
		modals.set('#' + el.id, createModal(el));
	});

	// Обработчики кнопок
	document.querySelectorAll('[data-modal-open]').forEach((btn) => {
		const target = btn.getAttribute('data-modal-open');
		const modal = modals.get(target);

		if (!modal) {
			return;
		}

		if (btn.dataset.modalTrigger === 'hover') {
			btn.addEventListener('mouseenter', modal.open);
			btn.addEventListener('mouseleave', modal.close);
		} else {
			btn.addEventListener('click', (e) => {
				// === ИСПРАВЛЕНИЕ ЗДЕСЬ ===
				// Проверяем: есть ли у кнопки атрибут data-mobile-only?
				// Если ЕСТЬ, то применяем ограничение по ширине экрана.
				// Если НЕТ, то пропускаем проверку и открываем модалку всегда.

				if (btn.hasAttribute('data-mobile-only')) {
					if (!window.matchMedia('(max-width: 48rem)').matches) {
						return; // Если это десктоп, ничего не делаем
					}
				}
				// ==========================

				if (e.currentTarget.tagName === 'A') {
					e.preventDefault();
				}

				// 1. Закрываем другие
				modals.forEach((mInstance, mId) => {
					if (mId !== target && mInstance.isOpen) {
						mInstance.close();
					}
				});

				// 2. Открываем
				modal.open();
			});
		}
	});
}
