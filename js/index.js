'use strict';

const smoothScroll = (link, anchor) => {
	const href = anchor ? anchor : link.getAttribute('href').substring(1);
	const scrollTarget = document.getElementById(href);
	const elementPosition = scrollTarget ? scrollTarget.getBoundingClientRect().top : '';

	window.scrollBy({
		top: elementPosition,
		behavior: 'smooth'
	});
};

document.body.addEventListener('click', e => {
	if (e.target.matches('a[href^="#"')) {
		e.preventDefault();
		smoothScroll(e.target);
	}
});

//gallerySelect

const element = document.querySelector('.js-gallerySelect');
const choices = new Choices(element, {
	searchEnabled: false,
	itemSelectText: '',
	shouldSort: false,
});

//projectTooltips

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
		tooltip.style.left = (-1 * box.left + 20) + 'px';
	}
};

tooltipMarkers.forEach(elem => {
	elem.addEventListener('focus', checkPosition);
});

document.addEventListener('DOMContentLoaded', () => {
	const tooltips = document.querySelectorAll('.js-projectsTooltip');
	tooltips.forEach(elem => checkPosition('', elem));
});


//contactsMap

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

//gallerySlider

const gallerySlider = new Swiper('.js-gallerySlider', {
	slidesPerView: 1,
  	spaceBetween: 20,
	direction: 'horizontal',

	navigation: {
		nextEl: '.js-galleryNext',
		prevEl: '.js-galleryPrev'
	},
	pagination: {
		el: '.js-galleryPagination',
		type: 'fraction'
	}
});

//eventsSlider

const eventsSlider = new Swiper('.js-eventsSlider', {
	loop: true,
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

//projectsSlider

const projectsSlider = new Swiper('.js-projectsSlider', {
	loop: true,
	slidesPerView: 1,
  	spaceBetween: 50,
	direction: 'horizontal',

	navigation: {
		nextEl: '.js-projectsNext',
		prevEl: '.js-projectsPrev'
	}
});

//publicationsCategories

const categories = document.querySelector('.js-categories');
const publicationsCategoriesBtn = document.querySelector('.js-categoriesBtn');

const showHideAllCategories = () => {
	const categoriesInput = categories.querySelectorAll('.categories__input');

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

publicationsCategoriesBtn.addEventListener('click', toggleCategories);
categories.addEventListener('click', hideCategory);

//headerBurgerMenu

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

//headerShowHideSearch

const expandSearch = document.querySelector('.js-expandSearchBtn');
const searchForm = document.querySelector('.js-searchForm');

const toggleSearch = () => {
	if (searchForm.classList.contains('js-openMenu')) {
		searchForm.classList.add('js-transitionMenu');
		searchForm.classList.remove('js-openMenu');
		expandSearch.classList.add('js-changeBtn');
		expandSearch.classList.remove('header__serch-button_active');
	} else {
		searchForm.classList.add('js-transitionMenu');
		searchForm.classList.add('js-openMenu');
		expandSearch.classList.add('js-changeBtn');
	}
};

const removeSearchBtnTransform = () => {
	expandSearch.classList.remove('js-changeBtn');
	if (searchForm.classList.contains('js-openMenu')) {
		expandSearch.classList.add('header__serch-button_active');
	}
};

expandSearch.addEventListener('click', toggleSearch);
expandSearch.addEventListener('transitionend', removeSearchBtnTransform);
searchForm.addEventListener('transitionend', removeMenuTransition);

//Accordion

const URLMEMBERS = 'https://ru.wikipedia.org/w/api.php?format=json&action=query&origin=*&generator=categorymembers&gcmsort=timestamp&gcmdir=older&gcmlimit=20&gcmtitle=Категория:Художники_';
const URLARTIST = 'https://ru.wikipedia.org/w/api.php?format=json&action=query&origin=*&prop=extracts|pageimages|pageprops&piprop=original&exintro&explaintext&redirects=1&&titles=';
const URLWIKIDATA = 'https://www.wikidata.org/w/api.php?action=wbgetclaims&origin=*&format=json&entity=';
const PROPBIRTH = '&property=P569';
const PROPDEATH = '&property=P570';

const sectionCatalogue = document.querySelector('.section-catalogue');
const buttonFR = document.querySelector('.js-tabsFR');
const buttonDE = document.querySelector('.js-tabsDE');
const buttonIT = document.querySelector('.js-tabsIT');
const buttonRU = document.querySelector('.js-tabsRU');
const buttonBE = document.querySelector('.js-tabsBE');
const tabsText = document.querySelector('.js-tabsText');
const accordion = document.querySelector('.js-tabsAccordion');
const personInfo = document.querySelector('.js-tabsPersonInfo');

const artistsFR = {country: 'FR'};
const artistsDE = {country: 'DE'};
const artistsRU = {country: 'RU'};
const artistsBE = {country: 'BE'};
const artistsIT = {country: 'IT',
	XV: ['Бенедетто ди Биндо',
		'Бергоньоне, Амброджо',
		'Биссоло, Франческо',
		'Больтраффио, Джованни',
		'Бонсиньори, Франческо',
		'Боттичини, Рафаэлло',
		'Брамантино',
		'Бреа, Людовико',
		'Бьяджо д’Антонио Туччи',
		'Веккьетта',
		'Андреа Верроккьо',
		'Доменико Гирландайо',
		'Беноццо Гоццоли',
		'Граначчи, Франческо',
		'Грегорио ди Чекко',
		'Джованни да Удине',
		'Джованни ди Паоло',
		'Джорджоне',
		'Парентино, Бернардо',
		'Пезеллино',
		'Пьетро Перуджино',
		'Перуцци, Бальдассаре',
		'Пизанелло',
		'Пинтуриккьо'
	]
};
const ages = ['XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI'];
const countries = ['Франции', 'Германии', 'Италии', 'России', 'Бельгии'];



//ДАННЫЕ ДЛЯ ТАБОВ, АККОРДЕОНА
//Запрашиваем данные по категории из Википедии
const getTimesData = (country, age) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', URLMEMBERS + country + `_${age}_века`, true);

		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) return;

			if (xhr.status === 200) {
				resolve(xhr);
			} else {
				reject(`Ошибка ${xhr.status}: ${xhr.statusText}`);
			}
		};

		xhr.send();
	});
};

//Наполняем объект страны
const handleTimesData = (data, age, artistsObj) => {
	if (data.query.pages) {
		const artistsArr = [];

		for (const obj in data.query.pages) {
			if (data.query.pages[obj].ns === 0) {
				artistsArr.push(data.query.pages[obj].title);
			}
		}

		if (!(age === 'XV' && artistsObj === artistsIT)) artistsObj[age] = artistsArr.sort();
	}
};

//Обработка ошибки (напр. отсутсвуют данные в ответе Википедии)
const handleTimesDataError = (age, artistsObj) => {
	artistsObj[age] = 'Нет данных';
};

//Создание контейнеров для списков художников (по кол-ву веков в массиве ages)
const createAccordionTab = artists => {
	ages.forEach((age, i) => {
		const year = i * 100 + 1400;
		const lastYear = i < ages.length - 1 ? `по <time datetime="${year + 99}">${year + 99}</time> гг.` : '';
		const activeBtn = sectionCatalogue.querySelector('.locale-list__button_active');
		const dnone = activeBtn.classList.contains(`js-tabs${artists.country}`) ? '' : 'js-dnone';
		const firstList = !(age === 'XV' && artists === artistsIT ) ? '' : 'person-list_active'; //для соответствия макету
		const firstActiveButton = !(age === 'XV' && artists === artistsIT ) ? '' : 'times-accordion__button_active';

		accordion.insertAdjacentHTML('beforeend',
			`<li class="times-accordion__item ${dnone} js-item${artists.country}">
				<p class="times-accordion__text">
				С <time datetime="${year}">${year}</time>
				${lastYear}
				</p>

				<button class="times-accordion__button ${firstActiveButton}"></button>
				<ul class="times-accordion__list person-list ${firstList} js-tabs${artists.country} js-tabs${age}"></ul>
			</li>`
		);
	});
};

//Заполняем контейнер аккордеона списками художников определенного века
const fillAccordionList = (artists, age) => {
	const tabsAccordion = sectionCatalogue.querySelector(`.js-tabs${artists.country}.js-tabs${age}`);

	if (artists[age] !== 'Нет данных') {
		artists[age].forEach(artist => {
			const girlandajo = artist !== 'Доменико Гирландайо' ? '' : 'person-list__btn_active'; //для соответствия макету

			tabsAccordion.insertAdjacentHTML('beforeend',
				`<li class="person-list__item">
					<button type="button" class="person-list__btn ${girlandajo}">${artist}</button>
				</li>`);
		});
	} else {
		tabsAccordion.insertAdjacentHTML('beforeend',
			`<li class="person-list__item person-list__item_nodata">
				Информация отсутствует
			</li>`);
	}
};

//МЕХАНИЗМ ТАБОВ
const changeTab = country => {
	const accordionItems = sectionCatalogue.querySelectorAll(`.times-accordion__item`);

	accordionItems.forEach(item => {
		if (!item.classList.contains('js-dnone')) {
			item.classList.add('js-dnone');
		}

		if (item.classList.contains(`js-item${country}`)) {
			item.classList.remove('js-dnone');
		}
	});
};

const handleTabButtonClick = button => {
	switch (button) {
		case buttonFR:
			changeTab(artistsFR.country);
			break;
		case buttonDE:
			changeTab(artistsDE.country);
			break;
		case buttonIT:
			changeTab(artistsIT.country);
			break;
		case buttonRU:
			changeTab(artistsRU.country);
			break;
		case buttonBE:
			changeTab(artistsBE.country);
			break;
	};

	const prevActiveButton = sectionCatalogue.querySelector('.locale-list__button_active');

	prevActiveButton.classList.remove('locale-list__button_active');
	button.classList.add('locale-list__button_active');
};

//МЕХАНИЗМ АККОРДЕОНА
const handleAccordionClick = item => {
	const prevActiveButton = sectionCatalogue.querySelector('.times-accordion__button_active');
	const prevActiveList = sectionCatalogue.querySelector('.person-list_active');
	const currentActiveButton = item.querySelector('.times-accordion__button');
	const currentActiveList = item.querySelector('.person-list');

	if (prevActiveButton && prevActiveList) {
		prevActiveButton.classList.remove('times-accordion__button_active');
		prevActiveList.classList.remove('person-list_active');
		prevActiveList.style.maxHeight = '';

		if (prevActiveButton === currentActiveButton) return;
	}

	currentActiveButton.classList.add('times-accordion__button_active');
	currentActiveList.style.maxHeight = currentActiveList.scrollHeight + 'px';
	currentActiveList.classList.add('person-list_active');
};

//ДАННЫЕ СТАТЬИ О ХУДОЖНИКЕ
//Загружаем данные с вики, передем объект с данными в handleTimesData
const loadTimesData = () => {
	countries.forEach(country => {
		let artistsObj;

		switch (country) {
			case 'Франции':
				artistsObj = artistsFR;
				break;
			case 'Германии':
				artistsObj = artistsDE;
				break;
			case 'Италии':
				artistsObj = artistsIT;
				break;
			case 'России':
				artistsObj = artistsRU;
				break;
			case 'Бельгии':
				artistsObj = artistsBE;
				break;
		};

		createAccordionTab(artistsObj);

		ages.forEach((age) => {
			getTimesData(country, age)
				.then(request => JSON.parse(request.responseText))
				.then(data => handleTimesData(data, age, artistsObj))
				.then(data => fillAccordionList(artistsObj, age))
				.catch(error => {
					handleTimesDataError(age, artistsObj);
					fillAccordionList(artistsObj, age);
				});
		});
	});
};

//Прелоадер в секцию статьи о художнике
const createPreloader = () => {
	const preloader = document.createElement('div');
	preloader.className = 'person-info__ajax-overlay';
	preloader.innerHTML = `<div class="person-info__ajax-loader"></div>`;

	return preloader;
};

//Получаем данные о художнике с вики
const getPersonData = person => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', URLARTIST + person, true);

		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) return;

			if (xhr.status === 200) {
				resolve(xhr);
			} else {
				reject(`Ошибка ${xhr.status}: ${xhr.statusText}`);
			}
		};

		xhr.send();
	});
};

//Получаем данные о дате рождения/смерти художника с медиавики (другое api, поэтому данные иногда отличаются от данных википедии)
const getDatesBirthDeath = (id, prop) => {
	return new Promise((resolve, reject) => {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', URLWIKIDATA + id + prop, true);

		xhr.onreadystatechange = () => {
			if (xhr.readyState !== 4) return;

			if (xhr.status === 200) {
				resolve(xhr);
			} else {
				reject(`Ошибка ${xhr.status}: ${xhr.statusText}`);
			}
		};

		xhr.send();
	});
};

//Отображаем данные о художнике на странице
const renderPersonInfo = (imgSrc, imgAlt, personName, text, birthDate, deathDate) => {
	const options = {month:'long', day:'numeric', year: 'numeric'};
	const birthDateNormal = birthDate && birthDate !== 'Н/Д' ? new Date(birthDate).toLocaleString('ru', options) : 'Нет данных';
    const deathDateNormal = deathDate ? ' - ' + new Date(deathDate).toLocaleString('ru', options) : '';

	personInfo.innerHTML =
		`<img src="${imgSrc}" alt="${imgAlt}" class="person-info__pic">

		<h3 class="person-info__heading">
			${personName}
		</h3>

		<div class="person-info__dates">
			<time class="person-info__birthdate" datetime="${birthDate}">${birthDateNormal}</time>
			<time class="person-info__deathdate" datetime="${deathDate}">${deathDateNormal}</time>
		</div>

		<p class="person-info__description">${text}</p>`;
};

//Обработка данных о художнике и передача их в renderPersonInfo
const handlePersonData = async (data) => {
	const pages = data.query.pages;
	const personName = pages[Object.keys(pages)[0]].title;
	const text = pages[Object.keys(pages)[0]].extract;
	const img = pages[Object.keys(pages)[0]].original;
	const imgSrc = img ? img.source : 'img/no-image-big.png';
	const imgAlt = img ? `Портрет ${personName}` : 'Изображение отсутствует';
	const wikidataID = pages[Object.keys(pages)[0]].pageprops.wikibase_item;

	const birthDate = await getDatesBirthDeath(wikidataID, PROPBIRTH)
		.then(request => JSON.parse(request.responseText))
		.then(data => data.claims.P569[0].mainsnak.datavalue.value.time.slice(1, 11).replaceAll('-00', ''))
		.catch(error => 'Н/Д');

	const deathDate = await getDatesBirthDeath(wikidataID, PROPDEATH)
		.then(request => JSON.parse(request.responseText))
		.then(data => data.claims.P570[0].mainsnak.datavalue.value.time.slice(1, 11).replaceAll('-00', ''))
		.catch(error => '');

	renderPersonInfo(imgSrc, imgAlt, personName, text, birthDate, deathDate);
};

const handlePersonError = error => {
	personInfo.innerHTML = `<p class="times-accordion__error">Не удалось загрузить информацию: ${error}</p>`;
};

//МЕХАНИЗМ КНОПОК ОТОБРАЖЕНИЯ СТАТЬИ
const handlePersonButton = button => {
	const artist = button.textContent.replace(' ', '_');
	const prevActiveButton = sectionCatalogue.querySelector('.person-list__btn_active');

	prevActiveButton.classList.remove('person-list__btn_active');
	button.classList.add('person-list__btn_active');

	if (document.documentElement.clientWidth < 1024) smoothScroll('', 'personArticle');

	personInfo.append(createPreloader());
	getPersonData(artist)
	.then(request => JSON.parse(request.responseText))
	.then(data => handlePersonData(data))
	.catch(error => handlePersonError(error));
};

//ОБРАБОТЧИКИ СОБЫТИЙ
const handleCatalogueClick = event => {
	const target = event.target;

	if (target.closest('.locale-list__button') && !target.closest('.locale-list__button_active')) {
		handleTabButtonClick(target);
	}

	if (target.closest('.times-accordion__item') && !target.closest('.person-list__item')) {
		const parent = target.closest('.times-accordion__item');
		handleAccordionClick(parent);
	}

	if (target.closest('.person-list__btn')) {
		handlePersonButton(target);
	}
};

sectionCatalogue.addEventListener('click', handleCatalogueClick);
window.addEventListener('load', loadTimesData);
