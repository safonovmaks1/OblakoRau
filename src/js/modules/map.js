/* global ymaps */
export function initMap() {
	const mapElement = document.getElementById('map');

	// 1. Проверка: есть ли контейнер на странице
	if (!mapElement) {
		return;
	}

	// 2. Проверка: загрузился ли сам скрипт Яндекса
	if (typeof ymaps === 'undefined') {
		// Если скрипт еще не прогрузился, пробуем снова через 100мс
		setTimeout(initMap, 100);
		return;
	}

	// 3. ВАЖНО: Ждем инициализации модулей карты (v2.1)
	ymaps.ready(() => {
		// --- ВАШ КОД НАЧИНАЕТСЯ ЗДЕСЬ ---
		const coords = [55.76497, 37.59254]; // Москва

		// Инициализация карты
		const myMap = new ymaps.Map('map', {
			center: coords,
			zoom: 17,
			controls: [], // Убираем стандартные контролы
		});

		myMap.behaviors.disable(['scrollZoom', 'ruler']);

		// Метка
		const myPlacemark = new ymaps.Placemark(coords, { hintContent: '<strong>Садовая-Кудринская, д. 25</strong>' }, { preset: 'islands#redGovernmentIcon' });
		myMap.geoObjects.add(myPlacemark);

		// === КАСТОМНЫЕ КОНТРОЛЫ ===

		// 1. Создаем контейнер зума
		const zoomContainer = document.createElement('div');
		zoomContainer.className = 'map-zoom';

		const zoomInBtn = document.createElement('button');
		zoomInBtn.className = 'map-btn map-zoom__in';
		zoomInBtn.type = 'button';
		zoomInBtn.textContent = '+';
		zoomInBtn.onclick = () => myMap.setZoom(myMap.getZoom() + 1, { checkZoomRange: true });

		const separator = document.createElement('span');
		separator.className = 'map-separator';

		const zoomOutBtn = document.createElement('button');
		zoomOutBtn.className = 'map-btn map-zoom__out';
		zoomOutBtn.type = 'button';
		zoomOutBtn.textContent = '−';
		zoomOutBtn.onclick = () => myMap.setZoom(myMap.getZoom() - 1, { checkZoomRange: true });

		zoomContainer.append(zoomOutBtn, separator, zoomInBtn);

		// 2. Создаем переключатель слоев
		const layerContainer = document.createElement('div');
		layerContainer.className = 'map-layer';

		const layerBtn = document.createElement('button');
		layerBtn.className = 'map-layer__toggle';
		layerBtn.type = 'button';
		layerBtn.innerHTML = '<span>Гибрид</span> <span class="map-arrow">▾</span>';

		const optionsList = document.createElement('ul');
		optionsList.className = 'map-layer__list';

		const layers = [
			{ name: 'Схема', type: 'yandex#map' },
			{ name: 'Спутник', type: 'yandex#satellite' },
			{ name: 'Гибрид', type: 'yandex#hybrid' },
		];

		layers.forEach((layer) => {
			const item = document.createElement('li');
			item.className = 'map-layer__item';
			item.textContent = layer.name;

			item.onclick = () => {
				myMap.setType(layer.type);
				layerBtn.querySelector('span').textContent = layer.name;
				layerContainer.classList.remove('is-open');
			};
			optionsList.appendChild(item);
		});

		layerBtn.onclick = () => {
			layerContainer.classList.toggle('is-open');
		};

		layerContainer.append(layerBtn, optionsList);

		// Добавляем элементы в DOM карты
		// В v2.1 лучше добавлять в контейнер карты, но не напрямую в childNodes ymaps,
		// а просто поверх, так как у нас position: relative
		mapElement.style.position = 'relative';
		mapElement.append(zoomContainer, layerContainer);

		// --- КОНЕЦ ВАШЕГО КОДА ---
	});
}
