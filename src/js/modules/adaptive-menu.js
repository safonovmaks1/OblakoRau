export function adaptiveMenu(userOptions = {}) {
	const defaults = {
		menuSelector: '.js-menu-list',
		moreBtnSelector: '.js-more-btn',
		dropdownSelector: '.js-more-dropdown',
		containerSelector: '#navContainer',
		buffer: 10,
	};

	const s = { ...defaults, ...userOptions };

	const navContainer = document.querySelector(s.containerSelector);
	const menuList = document.querySelector(s.menuSelector);
	const moreBtn = document.querySelector(s.moreBtnSelector);
	const dropdownList = document.querySelector(s.dropdownSelector);

	if (!navContainer || !menuList || !moreBtn || !dropdownList) {
		return;
	}

	const adapt = () => {
		// ===========================================
		// 1. СБРОС: Возвращаем все элементы в главное меню
		// ===========================================
		const hiddenItems = Array.from(dropdownList.children);

		hiddenItems.forEach((item) => {
			// ПРОВЕРКА: Если мы ранее удалили класс position-static, возвращаем его
			if (item.dataset.wasStatic === 'true') {
				item.classList.add('position-static');
				// Чистим атрибут, так как элемент вернулся домой
				delete item.dataset.wasStatic;
			}

			menuList.insertBefore(item, moreBtn);
		});

		// ===========================================
		// 2. ИЗМЕРЕНИЯ
		// ===========================================
		moreBtn.style.display = 'none';
		const containerWidth = navContainer.clientWidth - s.buffer;

		moreBtn.style.display = 'flex';
		const moreBtnWidth = moreBtn.offsetWidth;
		moreBtn.style.display = 'none';

		const style = window.getComputedStyle(menuList);
		const gap = parseFloat(style.gap) || 0;

		// ===========================================
		// 3. РАСЧЕТ И ПЕРЕНОС
		// ===========================================
		const items = Array.from(menuList.children).filter((item) => item !== moreBtn);

		let usedWidth = 0;
		let hasOverflow = false;

		items.forEach((item, index) => {
			const itemWidth = item.offsetWidth;
			const currentGap = index > 0 ? gap : 0;

			if (usedWidth + currentGap + itemWidth + moreBtnWidth + gap > containerWidth) {
				// --- МЕСТА НЕТ -> ПЕРЕНОСИМ ---

				// ЛОГИКА УДАЛЕНИЯ КЛАССА:
				// Если у элемента есть position-static, мы его убираем,
				// но ставим метку, что он был, чтобы потом вернуть.
				if (item.classList.contains('position-static')) {
					item.classList.remove('position-static');
					item.dataset.wasStatic = 'true'; // Ставим метку "тут был статик"
				}

				dropdownList.appendChild(item);
				hasOverflow = true;
			} else {
				// МЕСТА ХВАТАЕТ
				usedWidth += itemWidth + currentGap;
			}
		});

		if (hasOverflow) {
			moreBtn.style.display = 'flex';
		}
	};

	const init = () => {
		adapt();
		window.addEventListener('resize', adapt);
		window.addEventListener('load', adapt);
		document.fonts.ready.then(adapt);
	};

	init();
}
