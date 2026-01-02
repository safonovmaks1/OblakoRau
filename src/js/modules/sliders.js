import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { EffectFade, Navigation, Pagination, Thumbs } from 'swiper/modules';

export function initSliders() {
	const sliderRoots = document.querySelectorAll('.js-slider-root');

	sliderRoots.forEach((root) => {
		const container = root.querySelector('.js-swiper-container');
		const prevBtn = root.querySelector('.js-slider-prev');
		const nextBtn = root.querySelector('.js-slider-next');

		const paginationEl = root.querySelector('.swiper-pagination');
		// Ищем контейнер для миниатюр
		const thumbsContainer = root.querySelector('.js-swiper-thumbs');

		if (!container) {
			return;
		}

		const type = root.dataset.sliderType;
		let swiperOptions = {};
		let thumbsSwiper = null;

		// --- ЛОГИКА ДЛЯ КАРТОЧКИ ТОВАРА ---
		if (type === 'product') {
			if (thumbsContainer) {
				thumbsSwiper = new Swiper(thumbsContainer, {
					spaceBetween: 10,
					slidesPerView: 'auto',
					freeMode: true,
					watchSlidesProgress: true,
					centerInsufficientSlides: true,
				});
			}

			swiperOptions = {
				modules: [Navigation, Thumbs, EffectFade, Pagination],
				slidesPerView: 1,
				spaceBetween: 0,
				effect: 'fade',
				fadeEffect: { crossFade: true },
				loop: true,
				navigation: { nextEl: nextBtn, prevEl: prevBtn },
				thumbs: { swiper: thumbsSwiper },
				pagination: {
					el: paginationEl,
					type: 'bullets',
					clickable: true,
				},
			};
		}
		// --- ЛОГИКА ДЛЯ ПОПАПА (ФОТОГАЛЕРЕЯ) ---
		else if (type === 'product-popup') {
			if (thumbsContainer) {
				thumbsSwiper = new Swiper(thumbsContainer, {
					spaceBetween: 10,
					slidesPerView: 'auto',
					freeMode: true,
					watchSlidesProgress: true,
					centerInsufficientSlides: true,
				});
			}
			swiperOptions = {
				modules: [Navigation, Pagination, Thumbs],
				slidesPerView: 1,
				spaceBetween: 16,
				navigation: { nextEl: nextBtn, prevEl: prevBtn },
				thumbs: {
					swiper: thumbsSwiper,
				},
				pagination: {
					el: paginationEl,
					type: 'fraction',
				},
			};
		}
		// --- СПИСКИ ТОВАРОВ (Viewed, Reviews) ---
		else if (type === 'viewed') {
			swiperOptions = {
				modules: [Navigation, Pagination],
				slidesPerView: 5,
				spaceBetween: 10,
				loop: true,
				breakpoints: {
					320: { slidesPerView: 1 },
					576: { slidesPerView: 2 },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 4 },
					1280: { slidesPerView: 5 },
				},
				navigation: { nextEl: nextBtn, prevEl: prevBtn },
				pagination: {
					el: paginationEl,
					type: 'bullets',
					clickable: true,
				},
			};
		}
		// --- МИНИ СЛАЙДЕРЫ ---
		else if (type === 'mini') {
			swiperOptions = {
				modules: [Navigation, Pagination],
				slidesPerView: 5,
				spaceBetween: 10,
				breakpoints: {
					320: { slidesPerView: 1 },
					768: { slidesPerView: 2 },
					1024: { slidesPerView: 2 },
					1280: { slidesPerView: 3 },
				},
				navigation: { nextEl: nextBtn, prevEl: prevBtn },
				pagination: {
					el: paginationEl,
					clickable: true,
				},
			};
		}
		// --- ДЕФОЛТ ---
		else {
			swiperOptions = {
				modules: [Navigation, Pagination],
				slidesPerView: 3,
				spaceBetween: 20,
				breakpoints: {
					320: { slidesPerView: 1, spaceBetween: 16 },
					768: { slidesPerView: 2 },
					1000: { slidesPerView: 3, spaceBetween: 20 },
					1700: { slidesPerView: 3, spaceBetween: 24 },
				},
				navigation: { nextEl: nextBtn, prevEl: prevBtn },
				pagination: {
					el: paginationEl,
					clickable: true,
				},
			};
		}

		new Swiper(container, swiperOptions);
	});
}
