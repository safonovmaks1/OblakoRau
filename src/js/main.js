import aboutToggle from './modules/about-toggle.js';
import { initAccordion } from './modules/accordion.js';
import { adaptiveMenu } from './modules/adaptive-menu.js';
import { initCartButtons } from './modules/cart.js';
import { initCheckout } from './modules/checkout.js';
import { initCounters } from './modules/counter.js';
import { initForms } from './modules/forms.js';
import { initMap } from './modules/map.js';
import { initMobileFilter } from './modules/mobile-filter.js';
import { createMobileMenu } from './modules/mobile-menu.js';
import { mobileSearch } from './modules/mobile-search.js';
import { initModals } from './modules/modals.js';
import initTogglePassword from './modules/password-toggle.js';
import { initPaymentOverlay } from './modules/payment.js';
import { initRatings } from './modules/rating.js';
import { scrollUp } from './modules/scroll-up.js';
import { createSearch } from './modules/search.js';
import { showMore } from './modules/show-more.js';
import { initSizeSelector } from './modules/size-options.js';
import { initSliders } from './modules/sliders.js';
import initSort from './modules/sort.js';
import initTextExpand from './modules/text-expand.js';
import validationPhone from './modules/validation-phone.js';

document.addEventListener('DOMContentLoaded', () => {
	createMobileMenu({
		menuSelector: '#mainMenu',
		burgerSelector: '#burgerBtn',
	});

	createSearch();
	mobileSearch();
	adaptiveMenu();
	showMore('.catalog-main__item-list', '.catalog-main__button-load-more');
	aboutToggle('.js-about-info');
	scrollUp('#scroll-up');
	initModals();
	initSliders();
	initForms();
	initRatings();
	initAccordion();
	initMap();
	initCounters();
	initSizeSelector();
	initTogglePassword();
	validationPhone();
	initPaymentOverlay();
	initSort();
	initCheckout();
	initTextExpand();
	initCartButtons();
	initMobileFilter();
});
