import { mockData } from '../mockData.js';

export function mobileSearch() {
	// Селекторы
	const trigger = document.querySelector('.search-btn');

	// --- НОВЫЕ СЕЛЕКТОРЫ ---
	const wrapper = document.getElementById('mobileSearchWrapper'); // Обертка
	const backdrop = document.getElementById('mobileSearchBackdrop'); // Темный фон

	const closeBtn = document.getElementById('mobileSearchClose');
	const input = document.getElementById('mobileSearchInput');
	const resultsList = document.getElementById('msResultsList');
	const footer = document.getElementById('msResultsFooter');

	// Dropdown
	const scopeBlock = document.getElementById('mobileSearchScope');
	const scopeCurrent = scopeBlock ? scopeBlock.querySelector('.ms-scope-current') : null;
	const scopeText = scopeBlock ? scopeBlock.querySelector('.ms-scope-text') : null;
	const scopeOptions = scopeBlock ? scopeBlock.querySelectorAll('.ms-scope-dropdown li') : [];

	if (!trigger || !wrapper) {
		return;
	}

	// --- ОТКРЫТИЕ ---
	const open = (e) => {
		if (window.innerWidth < 992) {
			e.preventDefault();
			wrapper.classList.add('open'); // Вешаем класс на обертку
			document.body.style.overflow = 'hidden'; // Блокируем скролл сайта
			setTimeout(() => input.focus(), 100);
		}
	};

	// --- ЗАКРЫТИЕ ---
	const close = () => {
		wrapper.classList.remove('open');
		document.body.style.overflow = '';

		// Очистка при закрытии
		setTimeout(() => {
			input.value = '';
			resultsList.innerHTML = '';
			footer.style.display = 'none';
			if (scopeBlock) {
				scopeBlock.classList.remove('active');
			}
		}, 300);
	};

	// --- ПОИСК (Без изменений) ---
	const renderResults = (query) => {
		const filtered = mockData.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

		if (filtered.length === 0) {
			resultsList.innerHTML = '';
			footer.style.display = 'none';
			return;
		}

		let html = '';
		filtered.forEach((item) => {
			const regex = new RegExp(`(${query})`, 'gi');
			const highlighted = item.title.replace(regex, '<b>$1</b>');
			html += `
                <a href="#" class="ms-search-item">
                    <img src="${item.img}" class="ms-item-img" alt="">
                    <div class="ms-item-info">
                        <span class="ms-item-title">${highlighted}</span>
                        <span class="ms-item-price">${item.price}</span>
                    </div>
                </a>
            `;
		});
		resultsList.innerHTML = html;
		footer.style.display = 'block';
	};

	// --- СОБЫТИЯ ---

	// 1. Открытие
	trigger.addEventListener('click', open);

	// 2. Закрытие (Крестик + Клик по темному фону)
	closeBtn.addEventListener('click', close);
	if (backdrop) {
		backdrop.addEventListener('click', close); // <--- ВОТ ЭТО ГЛАВНОЕ
	}

	// 3. Закрытие по ESC
	document.addEventListener('keydown', (e) => {
		if (e.key === 'Escape' && wrapper.classList.contains('open')) {
			close();
		}
	});

	// 4. Ввод
	input.addEventListener('input', (e) => {
		const val = e.target.value.trim();
		if (val.length > 0) {
			renderResults(val);
		} else {
			resultsList.innerHTML = '';
			footer.style.display = 'none';
		}
	});

	// 5. Логика Dropdown
	const toggleScope = () => {
		if (scopeBlock) {
			scopeBlock.classList.toggle('active');
		}
	};
	const setScope = (option) => {
		const value = option.dataset.value;
		if (value === 'catalog') {
			scopeText.textContent = 'Каталог';
		} else if (value === 'all') {
			scopeText.textContent = 'Везде';
		}
		scopeOptions.forEach((opt) => opt.classList.remove('selected'));
		option.classList.add('selected');
		if (scopeBlock) {
			scopeBlock.classList.remove('active');
		}
	};

	if (scopeCurrent) {
		scopeCurrent.addEventListener('click', (e) => {
			e.stopPropagation();
			toggleScope();
		});
	}
	scopeOptions.forEach((opt) => {
		opt.addEventListener('click', (e) => {
			e.stopPropagation();
			setScope(opt);
		});
	});

	// Закрытие dropdown при клике мимо (внутри панели)
	document.addEventListener('click', (e) => {
		if (scopeBlock && !scopeBlock.contains(e.target)) {
			scopeBlock.classList.remove('active');
		}
	});
}
