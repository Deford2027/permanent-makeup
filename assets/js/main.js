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
     Контент модалки взят из макета (карточка «Перманентный макияж губ»).
     Для остальных услуг в макете пока нет текстов и цен — заполните поля
     desc / adv / price, и они автоматически появятся в окне. */
  const SERVICES = {
    lips: {
      title: 'Перманентный макияж губ',
      desc: 'это косметологическая процедура, при которой пигмент вводится в поверхностные слои кожи губ для изменения их цвета и контура. Процедура занимает около 2–3 часов, включает анестезию и требует обязательного периода заживления с последующей коррекцией для закрепления результата.',
      adv: [
        ['Коррекция формы и объема:', 'мастер может визуально сделать губы более пухлыми, симметричными, исправить неровный контур или асимметрию без инъекций и операций.'],
        ['Освежение цвета:', 'процедура возвращает губам насыщенный оттенок, если они побледнели с возрастом или потеряли цвет после болезни.'],
        ['Естественный вид:', 'современные техники (особенно акварельная) позволяют добиться эффекта «своих» ухоженных губ без ощущения яркой помады.'],
      ],
      price: '2 500 ₽ – 8 000 ₽',
      images: ['modal-lips-main', 'modal-lips-1', 'modal-lips-2', 'modal-lips-3'],
    },
    microblading: { title: 'Микроблейдинг бровей волосковый', images: ['svc-microblading'] },
    brows: { title: 'Перманентный макияж бровей', images: ['svc-brows'] },
    laser: { title: 'Лазерное удаление татуажа/татуировок', images: ['svc-laser'] },
    lash: { title: 'Перманентный макияж межреснички', images: ['svc-lash'] },
    remover: { title: 'Удаление татуажа ремувером', images: ['svc-remover'] },
    carbon: { title: 'Карбоновый пилинг', images: ['svc-carbon'] },
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

    const gallery = $('.svc__gallery', svcModal);
    gallery.classList.toggle('svc__gallery--single', data.images.length === 1);
    gallery.replaceChildren(...data.images.map((name) => {
      const img = new Image();
      img.src = `assets/img/${name}.webp`;
      img.alt = data.title;
      img.decoding = 'async';
      return img;
    }));

    openModal('modal-service');
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
      const show = cat === 'all' || w.dataset.cat === cat;
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
  const success = $('.form__success');
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
    form.hidden = false;
    success.hidden = true;
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

    form.hidden = true;
    success.hidden = false;
  });

  syncContactField();
})();
