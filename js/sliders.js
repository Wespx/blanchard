'use strict';

const sliders = () => {
	const gallerySlider = new Swiper('.js-gallerySlider', {
		direction: 'horizontal',
		slidesPerColumnFill: 'row',

		navigation: {
			nextEl: '.js-galleryNext',
			prevEl: '.js-galleryPrev'
		},

		pagination: {
			el: '.js-galleryPagination',
			type: 'fraction'
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
				slidesPerColumn: 1,
				slidesPerGroup: 1,
				spaceBetween: 20
			},
			768: {
				slidesPerView: 2,
				slidesPerColumn: 2,
				slidesPerGroup: 2,
				spaceBetween: 34
			},
			1700: {
				slidesPerView: 3,
				slidesPerColumn: 2,
				slidesPerGroup: 2,
				spaceBetween: 50
			}
		},

		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд'
		}
	});

	const projectsSlider = new Swiper('.js-projectsSlider', {
		loop: true,
		direction: 'horizontal',

		navigation: {
			nextEl: '.js-projectsNext',
			prevEl: '.js-projectsPrev'
		},

		breakpoints: {
			320: {
				slidesPerView: 1,
				spaceBetween: 20
			},
			768: {
				slidesPerView: 2,
				spaceBetween: 34
			},
			1024: {
				slidesPerView: 2,
				spaceBetween: 50
			},
			1700: {
				slidesPerView: 3,
				spaceBetween: 50
			}
		},

		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд'
		}
	});

	//breakpoints for eventsSlider and publicationsSlider

	const breakpoint768 = window.matchMedia('(min-width: 768px)');
	const breakpoint1024 = window.matchMedia('(min-width: 1024px');
	const breakpoint320 = window.matchMedia('(max-width: 767px)');

	//eventsSlider

	const eventsButton = document.querySelector('.js-eventsBtn');
	let eventsSlider;

	const activateEventsSlider = () => {
		eventsSlider = new Swiper('.js-eventsSlider', {
			slidesPerView: 1,
			spaceBetween: 20,
			direction: 'horizontal',

			pagination: {
				el: '.js-eventsPagination',
				type: 'bullets',
				bulletActiveClass: 'section-events__bullet_active',
				bulletClass: 'section-events__bullet',
				bulletElement: 'button',
				clickable: true
			},
			a11y: {
				paginationBulletMessage: 'Перейти к событию номер {{index}}'
			}
		});
	};

	const activateEventsList = () => {
		const numFirstItems = breakpoint1024.matches ? 2 : 1;
		const eventListItems = document.querySelectorAll(`.js-eventsSliderSlide`);
		eventListItems.forEach((elem, i) => {
			if (i <= numFirstItems) {
				elem.classList.remove ('js-dnone');
			} else {
				elem.classList.add('js-dnone');
			}
		});
		eventsButton.classList.remove('js-dnone');
	};

	const expandEventsList = () => {
		const eventListItems = document.querySelectorAll('.js-eventsSliderSlide');
		eventListItems.forEach(elem => {
			elem.classList.remove('js-dnone');
			eventsButton.classList.add('js-dnone');
		});
	};

	const destroyEventsSlider = () => {
		if (eventsSlider) {
			eventsSlider.destroy();
		}
	};

	const createEventsSlider = () => {
		if (breakpoint320.matches) {
			activateEventsSlider();
			expandEventsList();
		}
	};

	const setEventsListBreakpointState = () => {
		destroyEventsSlider();
		activateEventsList();
	};

	const eventsSliderInit = () => {
		if (breakpoint320.matches) {
			activateEventsSlider();
		} else {
			activateEventsList();
		}
	};

	eventsSliderInit();

	breakpoint320.addEventListener('change', createEventsSlider);
	breakpoint768.addEventListener('change', setEventsListBreakpointState);
	breakpoint1024.addEventListener('change', setEventsListBreakpointState);
	eventsButton.addEventListener('click', expandEventsList);

	//publicationsSlider

	let publicationsSlider;

	const activatePublicationsSlider = () => {
		publicationsSlider = new Swiper('.js-publicationsSlider', {
			direction: 'horizontal',

			navigation: {
				nextEl: '.js-publicationsNext',
				prevEl: '.js-publicationsPrev'
			},

			pagination: {
				el: '.js-publicationsPagination',
				type: 'fraction'
			},

			breakpoints: {
				768: {
					slidesPerView: 2,
					spaceBetween: 34
				},
				1024: {
					slidesPerView: 2,
					spaceBetween: 38
				},
				1700: {
					slidesPerView: 3,
					spaceBetween: 50
				}
			},

			a11y: {
				prevSlideMessage: 'Предыдущий слайд',
				nextSlideMessage: 'Следующий слайд'
			}
		});
	};

	const destroyPublicationsSlider = e => {
		if (e.matches && publicationsSlider) {
			publicationsSlider.destroy();
		}
	};

	const createPublicationsSlider = e => {
		if (e.matches) {
			activatePublicationsSlider();
		}
	};

	const publicationsSliderInit = () => {
		if (!breakpoint320.matches) {
			activatePublicationsSlider();
		} else {
			return;
		}
	};

	publicationsSliderInit();

	breakpoint768.addEventListener('change', createPublicationsSlider);
	breakpoint320.addEventListener('change', destroyPublicationsSlider);
};

sliders();
