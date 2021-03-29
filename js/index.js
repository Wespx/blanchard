'use strict';

const headerBurgerSearch = () => {
	const burgerBtn = document.querySelector('.js-burger');
	const burgerMenu = document.querySelector('.js-burgerMenu');
	const burgerClose = document.querySelector('.js-burgerClose');

	const openMenu = () => {
		burgerMenu.classList.add('js-transitionMenu');
		burgerMenu.classList.add('js-openMenu');
		document.body.style.overflow = 'hidden';
	};

	const closeMenu = event => {
		const target = event.target;
		if (target === burgerMenu || target === burgerClose || target.closest('.navlist__link')) {
			burgerMenu.classList.add('js-transitionMenu');
			burgerMenu.classList.remove('js-openMenu');
			document.body.style.overflow = '';
		}
	};

	const removeMenuTransition = () => {
		burgerMenu.classList.remove('js-transitionMenu');
	};

	burgerBtn.addEventListener('click', openMenu);
	burgerMenu.addEventListener('transitionend', removeMenuTransition);
	burgerMenu.addEventListener('click', closeMenu);

	const expandSearch = document.querySelector('.js-expandSearchBtn');
	const searchForm = document.querySelector('.js-searchForm');

	const toggleSearch = () => {
		if (searchForm.classList.contains('js-openMenu')) {
			searchForm.classList.add('js-transitionMenu');
			searchForm.classList.remove('js-openMenu');
			expandSearch.classList.add('js-changeBtn');
			expandSearch.classList.remove('header__search-button_active');
		} else {
			searchForm.classList.add('js-transitionMenu');
			searchForm.classList.add('js-openMenu');
			expandSearch.classList.add('js-changeBtn');
		}
	};

	const removeSearchBtnTransform = () => {
		expandSearch.classList.remove('js-changeBtn');
		if (searchForm.classList.contains('js-openMenu')) {
			expandSearch.classList.add('header__search-button_active');
		}
	};

	expandSearch.addEventListener('click', toggleSearch);
	expandSearch.addEventListener('transitionend', removeSearchBtnTransform);
	searchForm.addEventListener('transitionend', removeMenuTransition);
};

headerBurgerSearch();

const headerStyleMenus = () => {
	const menuStyle = document.querySelector('.menu-style');
	const prevActive = () => document.querySelector('.menu-style__item_active');

	const expandStyleList = e => {
		const target = e.target;
		const item = target.closest('.menu-style__item');

		if (item) {
			if (prevActive() && prevActive() !== item) prevActive().classList.remove('menu-style__item_active');

			item.classList.toggle('menu-style__item_active');
		}
	};

	menuStyle.addEventListener('click', expandStyleList);
};

headerStyleMenus();

const gallerySelect = () => {
	const element = document.querySelector('.js-gallerySelect');
	const choices = new Choices(element, {
		searchEnabled: false,
		itemSelectText: '',
		shouldSort: false,
	});
};

gallerySelect();

const adaptivePublicationsCategories = () => {
	const breakpointMobile = window.matchMedia('(max-width: 767px)');
	const breakpointDesktop = window.matchMedia('(min-width: 768px)');
	const categories = document.querySelector('.js-categories');
	const publicationsCategoriesBtn = document.querySelector('.js-categoriesBtn');

	const showHideAllCategories = () => {
		const categoriesInput = categories.querySelectorAll('.categories__input');

		if (breakpointMobile.matches) {
			if (publicationsCategoriesBtn.classList.contains('categories__expand-btn_active')) {
				categoriesInput.forEach(elem => {
					const label = elem.closest('.categories__label');
					label.classList.remove('js-dnone');
				});
			} else {
				categoriesInput.forEach(elem => {
					const label = elem.closest('.categories__label');
					if (elem.checked) {
						label.classList.remove('js-dnone');
					} else {
						label.classList.add('js-dnone');
					}
				});
			}
		}

		if (breakpointDesktop.matches) {
			categoriesInput.forEach(elem => {
				const label = elem.closest('.categories__label');
				label.classList.remove('js-dnone');
			});
		}
	};

	const hideCategory = event => {
		if (!publicationsCategoriesBtn.classList.contains('categories__expand-btn_active')) {
			const target = event.target;
			const label = target.closest('.categories__label');
			if (label) {
				label.classList.add('js-dnone');
			}
		}
	};

	const toggleCategories = () => {
		publicationsCategoriesBtn.classList.toggle('categories__expand-btn_active');
		showHideAllCategories();
	};

	const setCategoriesState = () => {
		if (breakpointMobile.matches) {
			publicationsCategoriesBtn.addEventListener('click', toggleCategories);
			categories.addEventListener('click', hideCategory);
			showHideAllCategories();
		}

		if (breakpointDesktop.matches) {
			publicationsCategoriesBtn.removeEventListener('click', toggleCategories);
			categories.removeEventListener('click', hideCategory);
			showHideAllCategories();
		}
	};

	setCategoriesState();

	breakpointMobile.addEventListener('change', setCategoriesState);
	breakpointDesktop.addEventListener('change', setCategoriesState);
};

adaptivePublicationsCategories();

const adaptiveTooltips = () => {
	const tooltipMarkers = document.querySelectorAll('.js-projectsTooltipMarker');

	const checkPosition = (e, elem) => {
		let tooltip;

		if (elem) {
			tooltip = elem;
		} else {
			tooltip = e.target.parentNode.querySelector('.js-projectsTooltip');
		}

		const box = tooltip.getBoundingClientRect();
		const screenWidth = document.documentElement.clientWidth;

		if (screenWidth > 1365) {
			tooltip.style.left = '';
			return;
		}

		if (box.right > screenWidth) {
			tooltip.style.left = '';
			tooltip.style.left = (screenWidth - box.right - 15) + 'px';
		}

		if (box.left < 0) {
			tooltip.style.left = '';
			tooltip.style.left = (-1 * box.left + 15) + 'px';
		}
	};

	tooltipMarkers.forEach(elem => {
		elem.addEventListener('focus', checkPosition);
	});

	document.addEventListener('DOMContentLoaded', () => {
		const tooltips = document.querySelectorAll('.js-projectsTooltip');
		tooltips.forEach(elem => checkPosition('', elem));
	});
};

adaptiveTooltips();

const renderMap = () => {
	const init = () => {
		const myMap = new ymaps.Map('map', {
			center: [55.75846306898368,37.601079499999905],
			zoom: 13
		});

		const myPlacemark = new ymaps.Placemark([55.75846306898368,37.601079499999905], {}, {
			iconLayout: 'default#image',
			iconImageHref: 'img/map-marker.svg',
			iconImageSize: [20, 20]
		});

		myMap.geoObjects.add(myPlacemark);
	};

	ymaps.ready(init);
};

renderMap();

const maskPhone = (masked = '+7 (___) ___-__-__') => {
	const elem = document.getElementById('phone');

	const mask = event => {
		const keyCode = event.keyCode;
		const template = masked;
		const target = event.target;
		const phoneCode = /^\+7/;

		const def = template.replace(/\D/g, '');
		const val = target.value.replace(/\D/g, '');
		let i = 0;
		let newValue = template.replace(/[_\d]/g, a => (i < val.length ? val.charAt(i++) || def.charAt(i) : a));
		i = newValue.indexOf('_');

		if (i !== -1) {
			newValue = newValue.slice(0, i);
		}

		if (!phoneCode.test(newValue)) {
			newValue = newValue.replace(newValue.slice(0, 2), '+7');
		}

		let reg = template.substr(0, target.value.length).replace(/_+/g, a => '\\d{1,' + a.length + '}').replace(/[+()]/g, '\\$&');
		reg = new RegExp('^' + reg + '$');

		if (!reg.test(target.value) || target.value.length < 5 || keyCode > 47 && keyCode < 58) {
			target.value = newValue;
		}

		if (event.type === 'blur' && target.value.length < 5) {
			target.value = '';
		}
	};

	elem.addEventListener("input", mask);
	elem.addEventListener("focus", mask);
	elem.addEventListener("blur", mask);

	elem.setAttribute('autocomplete', 'off');
};

maskPhone();

const formValidation = () => {
	const form = document.querySelector('.feedback-form');

	form.addEventListener('submit', event => {
		const phone = document.getElementById('phone');
		const userName = document.getElementById('name');
		userName.value = userName.value.trim();

		if (phone.value.length !== 18) {
			event.preventDefault();
			const label = document.querySelector('[for="phone"]');

			label.classList.add('feedback-form__label_visible');
			phone.style.outline = '3px solid red';
			setTimeout(() => {
				phone.style.outline = '';
				label.classList.remove('feedback-form__label_visible')
			}, 1000);
		}

		if (userName.value.length < 1) {
			event.preventDefault();
			const label = document.querySelector('[for="name"]');

			label.classList.add('feedback-form__label_visible');
			userName.style.outline = '3px solid red';
			setTimeout(() => {
				userName.style.outline = '';
				label.classList.remove('feedback-form__label_visible');
			}, 1000);
		}
	});
};

formValidation();
