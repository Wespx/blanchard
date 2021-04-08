'use strict';

const smoothScroll = () => {
	const scrollAnimation = (hash, time) => {
		const coordsElem = document.querySelector(hash).getBoundingClientRect().top;

		if (navigator.vendor !== 'Apple Computer, Inc.') {
			window.scrollBy({
				top: coordsElem,
				behavior: 'smooth'
			});
		} else {
			const scroll = pageYOffset; //'Расстояние от текущего пложения окна до края документа: '
			const coordsElemTop = coordsElem + scroll; //'Расстояние от элемента до края документа: '
			const distance = coordsElemTop - scroll; //'Дистанция до элемента от текущего положения экрана: '
			const move = distance / time; // 'Шаг скролла: '
			let progress = scroll + move; // 'Прогресс скролла: '

			const step = () => {
				window.scrollTo(0, progress);
				progress = progress + move;

				if (progress < coordsElemTop) {
					requestAnimationFrame(step);
				} else {
					window.location.hash = hash;
				}
			};

			requestAnimationFrame(step);
		}
	};

	document.body.addEventListener('click', e => {
		if (e.target.matches('a[href^="#"')) {
			const hash = e.target.href.replace(/[^#]*(.*)/, '$1');
			if (hash === '#') return;
			e.preventDefault();
			scrollAnimation(hash, 25);
		}

		if (e.target.classList.contains('person-list__btn') && document.documentElement.clientWidth < 1024) {
			scrollAnimation('#person-article', 25);
		}
	});
};

smoothScroll();
