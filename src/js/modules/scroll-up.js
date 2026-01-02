/* eslint-disable no-console */
// Scroll - UP
export function scrollUp(scrollUpTrigger) {
	const scrollUp = document.querySelector(scrollUpTrigger);

	if (scrollUp) {
		const threshold = 350;

		window.addEventListener('scroll', () => {
			scrollUp.classList.toggle('show-scroll', window.scrollY >= threshold);
		});

		scrollUp.addEventListener('click', (e) => {
			e.preventDefault();
			window.scrollTo({
				top: 0,
				behavior: 'smooth',
			});

			if (window.location.hash) {
				history.replaceState(null, '', ' ');
			}
		});
	} else {
		console.error(`Элемент с trigger "${scrollUpTrigger}" не найден.`);
	}
}
