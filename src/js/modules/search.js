import { mockData } from '../mockData.js';

export function createSearch(userOptions = {}) {
	const defaults = {
		formSelector: '#searchForm',
		inputSelector: '#searchInput',
		resultsSelector: '#searchResults',
		scopeSelector: '#searchScope', // Весь блок
		scopeCurrentSelector: '.scope-current', // На что кликаем для открытия
		scopeTextSelector: '.scope-text', // Где меняем текст
		scopeOptionSelector: '.scope-dropdown li', // Опции
		activeClass: 'active',
		showClass: 'show',
	};

	const s = { ...defaults, ...userOptions };

	// --- ЭЛЕМЕНТЫ ---
	const form = document.querySelector(s.formSelector);
	if (!form) {
		return;
	}

	const scope = form.querySelector(s.scopeSelector);
	const scopeCurrent = scope ? scope.querySelector(s.scopeCurrentSelector) : null;
	const scopeText = scope ? scope.querySelector(s.scopeTextSelector) : null;
	const scopeOptions = scope ? scope.querySelectorAll(s.scopeOptionSelector) : [];

	const input = form.querySelector(s.inputSelector);
	const results = form.querySelector(s.resultsSelector);

	// --- ЛОГИКА ---

	// 1. Открыть/Закрыть меню
	const toggleScope = () => {
		if (scope) {
			scope.classList.toggle(s.activeClass);
		}
	};

	// 2. Выбор пункта
	const setScope = (option) => {
		if (!scopeText) {
			return;
		}

		// Берем data-value из HTML
		const value = option.dataset.value;

		// Меняем текст в зависимости от ID
		if (value === 'catalog') {
			scopeText.textContent = 'Каталог';
		} else if (value === 'all') {
			scopeText.textContent = 'Везде';
		} else {
			scopeText.textContent = option.textContent.trim();
		}

		// Выделяем выбранный пункт
		scopeOptions.forEach((opt) => opt.classList.remove('selected'));
		option.classList.add('selected');

		// Закрываем меню
		if (scope) {
			scope.classList.remove(s.activeClass);
		}
	};

	// 3. Рендер результатов
	const renderResults = (items, query) => {
		if (items.length === 0) {
			results.innerHTML = '<div style="padding:15px; text-align:center; color:#999; font-size:13px;">Ничего не найдено</div>';
			results.classList.add(s.showClass);
			return;
		}

		let html = '';
		items.forEach((item) => {
			// Подсветка совпадений
			const regex = new RegExp(`(${query})`, 'gi');
			const highlightedTitle = item.title.replace(regex, '<b>$1</b>');

			html += `
                <a href="#" class="search-item">
                    <img src="images/card/${item.img}" class="search-item-img" alt="">
                    <div class="search-item-info">
                        <span class="search-item-title">${highlightedTitle}</span>
                        <span class="search-item-price">${item.price}</span>
                    </div>
                </a>
            `;
		});
		html += `<a href="search.html" class="search-footer">Все результаты</a>`;

		results.innerHTML = html;
		results.classList.add(s.showClass);
	};

	const handleInput = (e) => {
		const query = e.target.value.trim();
		if (query.length === 0) {
			results.classList.remove(s.showClass);
			return;
		}
		const filtered = mockData.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
		renderResults(filtered, query);
	};

	// --- ИНИЦИАЛИЗАЦИЯ ---
	const init = () => {
		// Клик по шапке "Каталог"
		if (scopeCurrent) {
			scopeCurrent.addEventListener('click', (e) => {
				e.stopPropagation(); // Не даем событию уйти выше
				toggleScope();
			});
		}

		// Клик по пунктам списка
		scopeOptions.forEach((opt) => {
			opt.addEventListener('click', (e) => {
				e.stopPropagation(); // Не даем событию уйти выше
				setScope(opt);
			});
		});

		// Ввод в поиск
		input.addEventListener('input', handleInput);
		input.addEventListener('focus', (e) => {
			if (e.target.value.trim().length > 0) {
				handleInput(e);
			}
		});

		// Клик в любом месте страницы (Закрытие)
		document.addEventListener('click', (e) => {
			if (scope && !scope.contains(e.target)) {
				scope.classList.remove(s.activeClass);
			}
			if (form && !form.contains(e.target)) {
				results.classList.remove(s.showClass);
			}
		});
	};

	init();
}
