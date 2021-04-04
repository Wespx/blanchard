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

	const closeStyleList = e => {
		const target = e.target;
		const item = target.closest('.menu-style__item');

		if (!item) {
			prevActive().classList.remove('menu-style__item_active');
			document.removeEventListener('click', closeStyleList);
		}
	};

	const expandStyleList = e => {
		const target = e.target;
		const item = target.closest('.menu-style__item');

		if (item) {
			if (target.closest('.menu-style__style-list-container')) return;

			if (prevActive() && prevActive() !== item) prevActive().classList.remove('menu-style__item_active');

			item.classList.toggle('menu-style__item_active');

			document.addEventListener('click', closeStyleList);
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

const galleryModal = () => {
	const html = document.documentElement;
	const gallery = document.getElementById('gallery');
	const modal = document.getElementById('modal');
	const modalOverlay = document.getElementById('modal-overlay');
	const galleryModalWindow = document.getElementById('gallery-modal');
	let scrollPos;

	const focusElements = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
    'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])',
	'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

	const artists = ['Казимир Малевич', 'Жан-Оноре Фрагонар', 'Поль Сезанн', 'Иван Крамской', 'Константин Маковский',
					'Генрих Семирадский', 'Сандро Боттичелли', 'Карл Брюллов', 'Клод Лоррен', 'Ян ван Хёйсум',
					'Питер Брейгель', 'Питер Пауль Рубенс', 'Клод Жозеф Верне'];

	const insertModalMarkup = (imgSrc, imgAlt, artist, picture) => {
		const malevichText = `Картина из второй серии крестьянского цикла работ Казимира Малевича.
			Художник принялся за её создание в 1930-1931 годах,
			после того, как первый цикл был утерян после Берлинской и Варшавской выставок в 1927 году.`;
		const text = artist === 'Казимир Малевич' ? malevichText : 'Описание временно отсутствует';

		galleryModalWindow.innerHTML = `
				<img src="${imgSrc}" alt="${imgAlt}" class="gallery__modal-img">
				<div class="gallery__modal-description">
					<h2 class="gallery__modal-artist-name">${artist}</h2>
					<h3 class="gallery__modal-picture-name">"${picture}"</h3>
					<div class="gallery__modal-years">1931-1932</div>
					<p class="gallery__modal-text">${text}</p>
				</div>
				<button class="gallery__modal-close-btn"></button>`;
	};

	const focusControl = e => {
		e.preventDefault();
		const nodes = galleryModalWindow.querySelectorAll(focusElements);
		const currNode = nodes[0];

		if (currNode && document.activeElement !== currNode) currNode.focus();
		if (!currNode) document.activeElement.blur();
	}

	const toggleScrollBlock = () => {
		if (html.classList.contains('js-scrollBlock')) {
			html.classList.remove('js-scrollBlock')
			window.scrollTo(0, scrollPos);
			html.style.top = '';
			return;
		}

		scrollPos = window.pageYOffset;
		html.style.top = -scrollPos + 'px';
		html.classList.add('js-scrollBlock');
	};

	const closeModal = e => {
		const target = e.target;

		if (!target.closest('.gallery__modal-content')
			|| target.classList.contains('gallery__modal-close-btn')
			|| e.code === 'Escape') {

			const activeSlide = gallery.querySelector('.gallery-slider__slide_active');
			activeSlide.classList.remove('gallery-slider__slide_active');
			modal.classList.toggle('js-modal_active');
			modal.setAttribute('aria-hidden', 'true');
			galleryModalWindow.classList.toggle('gallery__modal-content_active');
			modalOverlay.classList.toggle('js-modal-overlay_active');
			toggleScrollBlock();
			modal.removeEventListener('click', closeModal);
			window.removeEventListener('keydown', handleModalKeydown);
		}
	};

	const handleModalKeydown = e => {
		if (e.code === 'Escape') {
			e.preventDefault();
			closeModal(e);
		}

		if (e.code === 'Tab') {
			focusControl(e);
		}
	};

	const activateModal = e => {
		if (e.target.closest('.gallery-slider__slide')) {
			e.target.classList.add('gallery-slider__slide_active');
			const img = e.target.querySelector('.gallery-slider__img');
			const imgSrc = img.src;
			const imgAlt = img.alt;
			const artist = imgAlt.split(' ')[1];
			const artistShortName = artist.slice(artist.lastIndexOf('.') + 1);
			const artistName = artists.filter(item => item.includes(artistShortName.slice(0, artistShortName.length / 2 * -1)))[0];
			const pictureName = imgAlt.slice((imgAlt.indexOf('\'') + 1), imgAlt.lastIndexOf('\''));

			insertModalMarkup(imgSrc, imgAlt, artistName, pictureName);
			modal.classList.toggle('js-modal_active');
			modal.setAttribute('aria-hidden', 'false');
			galleryModalWindow.classList.toggle('gallery__modal-content_active');
			modalOverlay.classList.toggle('js-modal-overlay_active');
			toggleScrollBlock();
			modal.addEventListener('click', closeModal);
			window.addEventListener('keydown', handleModalKeydown);
		}
	};

	gallery.addEventListener('click', activateModal);
	gallery.addEventListener('keydown', e => {
		if (e.code === 'Space' || e.code === 'Enter' && e.target.closest('.gallery-slider__slide')) {
			activateModal(e);
		}
	});
};

galleryModal();

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

const formHandler = () => {
	const form = document.getElementById('feedback-form');
	const title = document.querySelector('.feedback-form__title');

	const submitHandler = () => {
		const formData = new FormData(form);
		const xhr = new XMLHttpRequest();

		xhr.onreadystatechange = () => {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					title.textContent = 'Спасибо, мы скоро с с Вами свяжемся!';
					title.classList.add('feedback-form__title_success');

					setTimeout(() => {
						title.textContent = 'Заказать обратный звонок';
						title.classList.remove('feedback-form__title_success');
					}, 1000);
				} else {
					title.textContent = 'Произошла ошибка';
					title.classList.add('feedback-form__title_error');

					setTimeout(() => {
						title.textContent = 'Заказать обратный звонок';
						title.classList.remove('feedback-form__title_error');
					}, 1000);
				}
			}
		}

		xhr.open('POST', 'mail.php', true);
		xhr.send(formData);

		form.reset();
	};

	form.addEventListener('submit', event => {
		const phone = document.getElementById('phone');
		const userName = document.getElementById('name');
		userName.value = userName.value.trim();
		event.preventDefault();

		if (phone.value.length !== 18) {
			const label = document.querySelector('[for="phone"]');

			label.classList.add('feedback-form__label_visible');
			phone.style.outline = '3px solid red';
			setTimeout(() => {
				phone.style.outline = '';
				label.classList.remove('feedback-form__label_visible')
			}, 1000);

			return;
		}

		if (userName.value.length < 1) {
			const label = document.querySelector('[for="name"]');

			label.classList.add('feedback-form__label_visible');
			userName.style.outline = '3px solid red';
			setTimeout(() => {
				userName.style.outline = '';
				label.classList.remove('feedback-form__label_visible');
			}, 1000);

			return;
		}

		submitHandler();
	});
};

formHandler();
