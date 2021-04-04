'use strict';

const accordionTabs = () => {
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
			const firstItem = !(age === 'XV' && artists === artistsIT ) ? '' : 'times-accordion__item_active';
			const firstList = !(age === 'XV' && artists === artistsIT ) ? '' : 'person-list_active'; //для соответствия макету
			const firstActiveButton = !(age === 'XV' && artists === artistsIT ) ? '' : 'times-accordion__button_active';

			accordion.insertAdjacentHTML('beforeend',
				`<li class="times-accordion__item ${dnone} js-item${artists.country} ${firstItem}" tabindex="0">
					<p class="times-accordion__text">
					С <time datetime="${year}">${year}</time>
					${lastYear}
					</p>

					<button class="times-accordion__button ${firstActiveButton}"></button>
					<div class="times-accordion__list-wrap ${firstList} js-personListWrap">
						<ul class="times-accordion__list person-list js-tabs${artists.country} js-tabs${age}"></ul>
					</div>
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
		const firstAgesItem = sectionCatalogue.querySelector(`.js-item${country}`);
		const firstArtistsItem = firstAgesItem.querySelector('.person-list__btn ');

		accordionItems.forEach(item => {
			if (!item.classList.contains('js-dnone')) {
				item.classList.add('js-dnone');
			}

			if (item.classList.contains(`js-item${country}`)) {
				item.classList.remove('js-dnone');
			}
		});

		if (firstAgesItem) firstAgesItem.click();
		if (firstArtistsItem) handlePersonButton(firstArtistsItem);
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
		const prevActiveItem = sectionCatalogue.querySelector('.times-accordion__item_active');
		const currentActiveButton = item.querySelector('.times-accordion__button');
		const currentActiveList = item.querySelector('.js-personListWrap');

		if (prevActiveButton && prevActiveList) {
			prevActiveButton.classList.remove('times-accordion__button_active');
			prevActiveList.classList.remove('person-list_active');
			prevActiveItem.classList.remove('times-accordion__item_active');
			prevActiveList.style.maxHeight = '';

			if (prevActiveButton === currentActiveButton) return;
		}

		currentActiveButton.classList.add('times-accordion__button_active');
		currentActiveList.style.maxHeight = currentActiveList.scrollHeight + 'px';
		currentActiveList.classList.add('person-list_active');
		item.classList.add('times-accordion__item_active');
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

	const preloadImg = (url, alt) => {
		return new Promise((resolve, reject) => {
			const image = document.createElement('img');
			image.onload = resolve;
			image.onerror = reject;
			image.src = url;
			image.alt = alt;
			image.classList.add('person-info__pic');
		});
	};

	//Отображаем данные о художнике на странице
	const renderPersonInfo = (img, personName, text, birthDate, deathDate) => {
		const options = {month:'long', day:'numeric', year: 'numeric'};
		const birthDateNormal = birthDate && birthDate !== 'Н/Д' ? new Date(birthDate).toLocaleString('ru', options) : 'Нет данных';
		const deathDateNormal = deathDate ? ' - ' + new Date(deathDate).toLocaleString('ru', options) : '';

		personInfo.innerHTML =
			`<h3 class="person-info__heading">
				${personName}
			</h3>

			<div class="person-info__dates">
				<time class="person-info__birthdate" datetime="${birthDate}">${birthDateNormal}</time>
				<time class="person-info__deathdate" datetime="${deathDate}">${deathDateNormal}</time>
			</div>

			<p class="person-info__description">${text}</p>`;

		personInfo.insertAdjacentElement('afterbegin', img);
	};

	//Обработка данных о художнике и передача их в renderPersonInfo
	const handlePersonData = async (data) => {
		const pages = data.query.pages;
		const personName = pages[Object.keys(pages)[0]].title;
		const text = pages[Object.keys(pages)[0]].extract;
		const img = pages[Object.keys(pages)[0]].original;
		const imgSrc = img ? img.source : 'img/no-image-big.png';
		const imgAlt = img ? `Портрет ${personName}` : 'Изображение отсутствует';
		const loadImg = await preloadImg(imgSrc, imgAlt);
		const imgReady = loadImg.target;
		const wikidata = pages[Object.keys(pages)[0]].pageprops;
		const wikidataID = wikidata ? wikidata.wikibase_item : '';

		const birthDate = await getDatesBirthDeath(wikidataID, PROPBIRTH)
			.then(request => JSON.parse(request.responseText))
			.then(data => data.claims.P569[0].mainsnak.datavalue.value.time.slice(1, 11).replaceAll('-00', ''))
			.catch(error => 'Н/Д');

		const deathDate = await getDatesBirthDeath(wikidataID, PROPDEATH)
			.then(request => JSON.parse(request.responseText))
			.then(data => data.claims.P570[0].mainsnak.datavalue.value.time.slice(1, 11).replaceAll('-00', ''))
			.catch(error => '');

		renderPersonInfo(imgReady, personName, text, birthDate, deathDate);
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

		personInfo.append(createPreloader());
		getPersonData(artist)
		.then(request => JSON.parse(request.responseText))
		.then(data => handlePersonData(data))
		.catch(error => handlePersonError(error));
	};

	//ОБРАБОТЧИКИ СОБЫТИЙ
	const handleCatalogueClick = event => {
		const target = event.target;

		if (event.type === 'keydown') {
			if (event.keyCode === 32 || event.keyCode === 13) {
				event.preventDefault();
			} else {
				return;
			}
		}

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
	sectionCatalogue.addEventListener('keydown', handleCatalogueClick);
	window.addEventListener('load', loadTimesData);
};

accordionTabs();
