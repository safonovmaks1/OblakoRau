// rating.js

export function initRatings() {
	const ratings = document.querySelectorAll('.rating');

	ratings.forEach((ratingBlock) => {
		initSingleRating(ratingBlock);
	});
}

function initSingleRating(ratingBlock) {
	const stars = ratingBlock.querySelectorAll('.rating__icon');
	const ratingText = ratingBlock.querySelector('.rating__text');
	const hiddenInput = ratingBlock.querySelector('input[type="hidden"]');

	// Тексты оценок
	const textMap = ['Очень плохо', 'Плохо', 'Нормально', 'Хорошо', 'Отлично'];

	let currentRating = 0;

	// Если в input уже есть значение (например, при редактировании отзыва), считываем его
	if (hiddenInput && hiddenInput.value) {
		currentRating = parseInt(hiddenInput.value, 10) || 0;
	}

	// Функция отрисовки (добавляет/убирает класс active)
	const render = (ratingToHighlight) => {
		stars.forEach((star, index) => {
			// index начинается с 0, поэтому сравниваем index < rating
			if (index < ratingToHighlight) {
				star.classList.add('active');
			} else {
				star.classList.remove('active');
			}
		});

		// Обновляем текст только при наведении или клике
		if (ratingText) {
			ratingText.textContent = ratingToHighlight > 0 ? textMap[ratingToHighlight - 1] : 'Без оценки';
		}
	};

	// 1. Наведение мыши (Hover)
	stars.forEach((star, index) => {
		star.addEventListener('mouseenter', () => {
			// Подсвечиваем звезды до текущей (index + 1)
			render(index + 1);
		});

		// 2. Клик (Фиксация)
		star.addEventListener('click', () => {
			currentRating = index + 1;

			// Записываем ЧИСЛО в input для отправки на сервер
			if (hiddenInput) {
				hiddenInput.value = currentRating;
			}

			// Можно добавить визуальный эффект клика, если нужно
			render(currentRating);
		});
	});

	// 3. Уход мыши с блока рейтинга
	ratingBlock.addEventListener('mouseleave', () => {
		// Возвращаем подсветку к зафиксированному значению
		render(currentRating);
	});

	// Первичная инициализация (если было предустановленное значение)
	render(currentRating);
}
