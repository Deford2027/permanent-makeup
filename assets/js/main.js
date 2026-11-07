(() => {
  'use strict';

  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  /* ---------------- Mobile menu ---------------- */
  const burger = $('.header__burger');
  const menu = $('#mobile-menu');
  const toggleMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    menu.hidden = !open;
  };
  burger.addEventListener('click', () => toggleMenu(menu.hidden));
  menu.addEventListener('click', (e) => { if (e.target.closest('a, button')) toggleMenu(false); });

  /* ---------------- Services data ----------------
     Тексты и цены для модального окна услуги.
     «Губы» — из макета; остальные услуги — черновые тексты. Цены утверждены заказчиком. */
  const SERVICES = {
    lips: {
      title: 'Перманентный макияж губ',
      desc: 'это косметологическая процедура, при которой пигмент вводится в поверхностные слои кожи губ для изменения их цвета и контура. Процедура занимает около 2–3 часов, включает анестезию и требует обязательного периода заживления с последующей коррекцией для закрепления результата.',
      adv: [
        ['Коррекция формы и объема:', 'мастер может визуально сделать губы более пухлыми, симметричными, исправить неровный контур или асимметрию без инъекций и операций.'],
        ['Освежение цвета:', 'процедура возвращает губам насыщенный оттенок, если они побледнели с возрастом или потеряли цвет после болезни.'],
        ['Естественный вид:', 'современные техники (особенно акварельная) позволяют добиться эффекта «своих» ухоженных губ без ощущения яркой помады.'],
      ],
      price: '8 000 ₽',
      images: ['works/brows-17.webp', 'works/lips-09.webp?v=2', 'works/lips-13.webp', 'works/lips-04.webp', 'works/lips-06.webp'],
    },
    microblading: {
      title: 'Микроблейдинг бровей волосковый',
      desc: 'это ручная техника татуажа, при которой мастер специальным манипулом прорисовывает тончайшие штрихи, имитирующие натуральные волоски. Процедура занимает около 1,5–2 часов, проходит с анестезией и требует периода заживления с последующей коррекцией через 4–6 недель.',
      adv: [
        ['Максимальная естественность:', 'каждый волосок прорисовывается вручную по направлению роста, поэтому брови выглядят так, будто они густые от природы.'],
        ['Коррекция формы:', 'мастер заполняет пробелы, шрамы и редкие участки, выравнивает асимметрию и делает брови аккуратными.'],
        ['Экономия времени:', 'не нужно каждое утро рисовать брови карандашом или тенями — они ухожены в любой ситуации, даже после бассейна.'],
      ],
      price: '9 000 ₽',
      images: ['works/microblading-37.webp', 'works/microblading-28.webp', 'works/microblading-20.webp', 'works/microblading-11.webp', 'works/microblading-31.webp'],
    },
    brows: {
      title: 'Перманентный макияж бровей',
      desc: 'это аппаратная процедура, при которой пигмент вводится в поверхностные слои кожи для создания мягкого напыления или эффекта пудровых бровей. Процедура занимает около 1,5–2 часов, включает анестезию и требует периода заживления с последующей коррекцией для закрепления результата.',
      adv: [
        ['Идеальная форма:', 'мастер подбирает форму под черты лица, корректирует асимметрию и визуально делает взгляд открытым и выразительным.'],
        ['Стойкий результат:', 'пудровые брови держатся от 1 до 3 лет и мягко светлеют без резких переходов и нежелательных оттенков.'],
        ['Подходит всем:', 'техника хорошо ложится на жирную и чувствительную кожу, где волосковые штрихи со временем могут расплываться.'],
      ],
      price: '8 000 ₽',
      images: ['works/brows-13.webp', 'works/brows-07.webp', 'works/brows-12.webp', 'works/brows-14.webp', 'works/brows-02.webp'],
    },
    laser: {
      title: 'Лазерное удаление татуажа/татуировок',
      desc: 'это процедура, при которой лазерный луч дробит частицы пигмента в коже на мельчайшие фрагменты, а организм постепенно выводит их естественным путём. Сеанс длится от 10 до 30 минут, а для полного осветления обычно требуется несколько процедур с интервалом 4–8 недель.',
      adv: [
        ['Безопасность для кожи:', 'лазер воздействует только на пигмент и не повреждает окружающие ткани, поэтому риск появления рубцов минимален.'],
        ['Удаление любых цветов:', 'процедура справляется со старым татуажем, неудачным цветом и синими, серыми или красными оттенками.'],
        ['Подготовка к новому:', 'лазер осветляет неудачную работу, после чего можно сделать новый перманент с правильной формой и цветом.'],
      ],
      price: '2 000 ₽',
      images: ['works/laser-08.webp', 'works/laser-03.webp', 'works/laser-01.webp', 'works/laser-05.webp', 'works/laser-10.webp'],
    },
    lash: {
      title: 'Перманентный макияж межреснички',
      desc: 'это процедура, при которой пигмент вводится в межресничное пространство по линии роста ресниц, создавая эффект густых и выразительных ресниц. Процедура занимает около 1–1,5 часов, проходит с анестезией и требует короткого периода заживления с последующей коррекцией.',
      adv: [
        ['Выразительный взгляд:', 'ресницы визуально становятся гуще и темнее, а глаза выглядят ярче без туши и подводки даже утром после сна.'],
        ['Деликатный результат:', 'межресничка заполняет только пространство между ресницами и не выглядит как яркая стрелка или макияж.'],
        ['Комфорт в жизни:', 'макияж не растекается в жару, в бассейне и на тренировке, а подходит и тем, кто носит контактные линзы.'],
      ],
      price: '6 000 ₽',
      images: ['works/lash-04.webp', 'works/lash-03.webp', 'works/lash-08.webp', 'works/lash-07.webp', 'works/lash-05.webp'],
    },
    remover: {
      title: 'Удаление татуажа ремувером',
      desc: 'это процедура, при которой в кожу вводится специальный состав — ремувер, который связывает пигмент и выводит его на поверхность вместе с корочкой. Процедура занимает около 30–60 минут и требует периода заживления; для полного удаления может понадобиться несколько сеансов.',
      adv: [
        ['Точечное удаление:', 'ремувер позволяет убрать пигмент выборочно — например, исправить хвостик брови или неудачный участок контура.'],
        ['Любые пигменты:', 'метод подходит для светлых, телесных и красных оттенков, с которыми лазер справляется хуже всего.'],
        ['Бережность к волоскам:', 'процедура не повреждает волосяные луковицы, поэтому собственные брови продолжают расти как раньше.'],
      ],
      price: '2 000 ₽',
      images: ['svc-remover.webp'],
    },
    carbon: {
      title: 'Карбоновый пилинг',
      desc: 'это аппаратная процедура, при которой на кожу наносят углеродную маску, а затем лазер нагревает и испаряет её вместе с ороговевшими клетками и загрязнениями пор. Процедура занимает около 40–60 минут, проходит без боли и не требует периода восстановления после сеанса.',
      adv: [
        ['Чистая кожа:', 'пилинг глубоко очищает и сужает поры, уменьшает количество чёрных точек и воспалений, выравнивает рельеф.'],
        ['Сияние и тонус:', 'процедура запускает выработку коллагена, кожа становится более упругой, свежей и ровной по тону.'],
        ['Без реабилитации:', 'после сеанса нет покраснений и шелушения, поэтому можно сразу вернуться к работе и обычным делам.'],
      ],
      price: '2 500 ₽',
      images: ['works/carbon-01.webp', 'works/carbon-02.webp'],
    },
  };

  /* ---------------- Modals ---------------- */
  let lastFocus = null;
  let openModalEl = null;

  const openModal = (id) => {
    if (openModalEl) closeModal(false);
    const modal = document.getElementById(id);
    if (!modal) return;
    lastFocus = lastFocus || document.activeElement;
    modal.hidden = false;
    openModalEl = modal;
    document.body.classList.add('is-locked');
    const dialog = $('.modal__dialog', modal);
    requestAnimationFrame(() => dialog.focus({ preventScroll: true }));
  };

  const closeModal = (restoreFocus = true) => {
    if (!openModalEl) return;
    openModalEl.hidden = true;
    openModalEl = null;
    document.body.classList.remove('is-locked');
    if (restoreFocus && lastFocus) { lastFocus.focus({ preventScroll: true }); lastFocus = null; }
  };

  document.addEventListener('click', (e) => {
    const opener = e.target.closest('[data-open]');
    if (opener) { e.preventDefault(); if (opener.dataset.open === 'form') resetForm(); openModal('modal-' + opener.dataset.open); return; }

    const svc = e.target.closest('[data-service-open], .service');
    if (svc) { openService(svc.dataset.serviceOpen || svc.dataset.service); return; }

    if (e.target.closest('[data-close]')) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (!openModalEl) return;
    if (e.key === 'Escape') { closeModal(); return; }
    if (e.key === 'Tab') {
      const items = $$('a[href], button, input, [tabindex]:not([tabindex="-1"])', openModalEl).filter((el) => el.offsetParent !== null);
      if (!items.length) return;
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  const svcModal = $('#modal-service');
  function openService(key) {
    const data = SERVICES[key];
    if (!data) return;
    $('#svc-title', svcModal).textContent = data.title;

    const desc = $('.svc__desc', svcModal);
    desc.textContent = data.desc || '';
    desc.hidden = !data.desc;

    const advWrap = $('.svc__adv-wrap', svcModal);
    const adv = $('.svc__adv', svcModal);
    adv.replaceChildren(...(data.adv || []).map(([b, t]) => {
      const p = document.createElement('p');
      const strong = document.createElement('b');
      strong.textContent = b + ' ';
      p.append(strong, t);
      return p;
    }));
    advWrap.hidden = !(data.adv && data.adv.length);

    const priceWrap = $('.svc__price-wrap', svcModal);
    $('.svc__price', svcModal).textContent = data.price || '';
    priceWrap.hidden = !data.price;

    renderGallery($('.svc__gallery', svcModal), data);

    openModal('modal-service');
  }

  /* Галерея в окне услуги: большое фото целиком + миниатюры */
  function renderGallery(gallery, data) {
    const src = (name) => `assets/img/${name}`;
    const main = new Image();
    main.className = 'svc__main';
    main.src = src(data.images[0]);
    main.alt = data.title;
    main.decoding = 'async';
    gallery.classList.toggle('svc__gallery--single', data.images.length === 1);
    const thumbs = data.images.length > 1 ? data.images.map((name, i) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'svc__thumb' + (i === 0 ? ' is-active' : '');
      btn.setAttribute('aria-label', `Фото ${i + 1}`);
      const img = new Image();
      img.src = src(name);
      img.alt = '';
      btn.append(img);
      btn.addEventListener('click', () => {
        main.src = src(name);
        $$('.svc__thumb', gallery).forEach((t) => t.classList.toggle('is-active', t === btn));
      });
      return btn;
    }) : [];
    const nodes = [main];
    if (thumbs.length) {
      const strip = document.createElement('div');
      strip.className = 'svc__thumbs';
      strip.append(...thumbs);
      nodes.push(strip);
    }
    gallery.replaceChildren(...nodes);
  }

  /* ---------------- Portfolio: filter + slider ---------------- */
  const works = $('#works');
  const empty = $('.works__empty');
  const prev = $('[data-slide="-1"]');
  const next = $('[data-slide="1"]');

  const updateNav = () => {
    const max = works.scrollWidth - works.clientWidth - 2;
    prev.disabled = works.scrollLeft <= 2;
    next.disabled = works.scrollLeft >= max;
  };

  const applyFilter = (cat) => {
    let visible = 0;
    $$('.work', works).forEach((w) => {
      const show = cat === 'all' || w.dataset.cat.split(' ').includes(cat);
      w.hidden = !show;
      if (show) visible++;
    });
    works.hidden = visible === 0;
    empty.hidden = visible !== 0;
    works.scrollLeft = 0;
    updateNav();
  };

  $$('.chip').forEach((chip) => {
    chip.setAttribute('aria-pressed', String(chip.classList.contains('is-active')));
    chip.addEventListener('click', () => {
      $$('.chip').forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-pressed', String(c === chip)); });
      applyFilter(chip.dataset.filter);
    });
  });

  [prev, next].forEach((btn) => btn.addEventListener('click', () => {
    const item = $('.work:not([hidden])', works);
    const step = item ? item.getBoundingClientRect().width + parseFloat(getComputedStyle(works).columnGap || 0) : works.clientWidth;
    works.scrollBy({ left: step * Number(btn.dataset.slide), behavior: 'smooth' });
  }));
  works.addEventListener('scroll', updateNav, { passive: true });
  window.addEventListener('resize', updateNav);
  applyFilter($('.chip.is-active').dataset.filter);

  /* ---------------- Form modal slideshow: смена фото каждые 3 секунды ---------------- */
  $$('[data-slides]').forEach((box) => {
    const slides = $$('.slide', box);
    const dots = $$('.slides__dot', box);
    const modal = box.closest('.modal');
    let index = 0;
    let timer = null;
    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((el, k) => el.classList.toggle('is-active', k === index));
      dots.forEach((el, k) => el.classList.toggle('is-active', k === index));
      // подгрузить следующее фото заранее
      const next = slides[(index + 1) % slides.length];
      if (next.loading === 'lazy') next.loading = 'eager';
    };
    const start = () => { stop(); timer = setInterval(() => show(index + 1), 3000); };
    const stop = () => { if (timer) clearInterval(timer); timer = null; };
    dots.forEach((dot, k) => dot.addEventListener('click', () => { show(k); start(); }));
    // запускать только пока окно открыто
    new MutationObserver(() => {
      if (modal.hidden) { stop(); } else { slides.forEach((el) => { el.loading = 'eager'; }); show(0); start(); }
    }).observe(modal, { attributes: true, attributeFilter: ['hidden'] });
  });

  /* ---------------- Video reviews: play inside the card ---------------- */
  $$('.video[data-video]').forEach((card) => {
    card.addEventListener('click', () => {
      if (card.classList.contains('is-playing')) return;
      // остановить остальные видео
      $$('.video.is-playing video').forEach((v) => v.pause());
      const video = document.createElement('video');
      video.src = card.dataset.video;
      video.controls = true;
      video.playsInline = true;
      video.preload = 'auto';
      video.poster = $('img', card).src;
      video.addEventListener('play', () => {
        $$('.video.is-playing video').forEach((v) => { if (v !== video) v.pause(); });
      });
      card.classList.add('is-playing');
      card.removeAttribute('aria-label');
      card.append(video);
      video.play().catch(() => {});
    });
  });

  /* ---------------- Reviews: show all ---------------- */
  const reviewsGrid = $('#reviews-grid');
  const reviewsBtn = $('#reviews-toggle');
  reviewsBtn.addEventListener('click', () => {
    const open = !reviewsGrid.classList.contains('is-open');
    reviewsGrid.classList.toggle('is-open', open);
    reviewsBtn.setAttribute('aria-expanded', String(open));
    $('span', reviewsBtn).textContent = open ? 'Скрыть отзывы' : 'Показать все отзывы';
    $('.btn__circle img', reviewsBtn).style.transform = open ? 'rotate(-90deg)' : '';
    if (!open) reviewsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  /* ---------------- Lead form ---------------- */
  const form = $('#lead-form');
  const errorBox = $('.form__error', form);
  const contactInput = form.elements.contact;
  const PLACEHOLDERS = { telegram: '@username', whatsapp: '+7 (___) ___-__-__', phone: '+7 (___) ___-__-__' };

  const syncContactField = () => {
    const method = form.elements.method.value;
    contactInput.placeholder = PLACEHOLDERS[method];
    contactInput.type = method === 'telegram' ? 'text' : 'tel';
    contactInput.autocomplete = method === 'telegram' ? 'off' : 'tel';
  };
  $$('input[name="method"]', form).forEach((r) => r.addEventListener('change', syncContactField));

  function resetForm() {
    form.reset();
    errorBox.hidden = true;
    $$('.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));
    syncContactField();
  }

  form.addEventListener('input', (e) => e.target.classList.remove('is-invalid'));

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { name, contact, agree, method } = form.elements;
    const errors = [];
    $$('.is-invalid', form).forEach((el) => el.classList.remove('is-invalid'));

    if (name.value.trim().length < 2) { errors.push('укажите имя'); name.classList.add('is-invalid'); }
    const value = contact.value.trim();
    const ok = method.value === 'telegram'
      ? /^@?[a-zA-Z0-9_]{4,32}$/.test(value) || value.replace(/\D/g, '').length >= 10
      : value.replace(/\D/g, '').length >= 10;
    if (!ok) { errors.push(method.value === 'telegram' ? 'укажите @username или телефон' : 'укажите номер телефона'); contact.classList.add('is-invalid'); }
    if (!agree.checked) { errors.push('подтвердите согласие'); agree.classList.add('is-invalid'); }

    if (errors.length) {
      errorBox.textContent = 'Пожалуйста, ' + errors.join(', ') + '.';
      errorBox.hidden = false;
      return;
    }
    errorBox.hidden = true;

    const payload = { name: name.value.trim(), method: method.value, contact: value, page: location.href };
    // TODO: подключить отправку заявки (Telegram-бот / CRM / почта).
    document.dispatchEvent(new CustomEvent('lead:submit', { detail: payload }));

    // после отправки — отдельная страница «Спасибо»
    window.location.href = 'thanks.html';
  });

  syncContactField();
})();
