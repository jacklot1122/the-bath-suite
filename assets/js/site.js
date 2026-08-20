/* ==========================================================================
   THE BATH SUITE — site behaviour
   Five small jobs: mobile nav, contact details, scroll reveals, gallery
   lightbox, form submission. No dependencies.
   ========================================================================== */
(function () {
  'use strict';

  var CFG = window.BATHSUITE || {};
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* --------------------------------------------------- scrollbar width --- */
  /* Full-bleed sections are sized with 100vw, which counts the scrollbar and
     would otherwise push the page sideways by its width. */
  (function scrollbar() {
    function measure() {
      var w = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--sbw', (w > 0 ? w : 0) + 'px');
    }
    measure();
    window.addEventListener('resize', measure);
    window.addEventListener('load', measure);
  })();

  /* ------------------------------------------------------- mobile nav ---- */
  (function nav() {
    var burger = document.getElementById('burger');
    var panel = document.getElementById('navPanel');
    if (!burger || !panel) return;

    function setOpen(open) {
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      panel.classList.toggle('is-open', open);
      document.body.classList.toggle('is-locked', open);
    }

    burger.addEventListener('click', function () {
      setOpen(burger.getAttribute('aria-expanded') !== 'true');
    });

    panel.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && burger.getAttribute('aria-expanded') === 'true') {
        setOpen(false);
        burger.focus();
      }
    });

    // a resize past the desktop breakpoint should not leave the body locked
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 900) setOpen(false);
    });
  })();

  /* -------------------------------------------- contact details -------- */
  /* Elements marked data-contact="phone|email|areas|hours|address" are filled
     from config.js. Blank values either keep their visible placeholder
     (PREVIEW: true) or hide the whole row (PREVIEW: false).                */
  (function contact() {
    var nodes = document.querySelectorAll('[data-contact]');
    if (!nodes.length) return;

    function asList(v) {
      if (!v) return [];
      return Array.isArray(v) ? v.filter(Boolean) : [String(v)];
    }

    var address = [CFG.addressLine, [CFG.suburb, CFG.postcode].filter(Boolean).join(' ')]
      .filter(Boolean).join(', ');

    Array.prototype.forEach.call(nodes, function (el) {
      var key = el.getAttribute('data-contact');
      var value = key === 'address' ? address : CFG[key];
      var list = asList(value);

      var row = el.closest('[data-optional]') || el;

      if (!list.length) {
        // nothing supplied
        if (CFG.PREVIEW) return; // leave the [PLACEHOLDER] tag visible
        row.hidden = true;
        return;
      }

      // A row may ship hidden in the markup so that an unsupplied detail never
      // shows a placeholder to a real visitor, even with JavaScript off.
      // Supplying a value here brings it back.
      row.hidden = false;

      if (key === 'phone') {
        el.innerHTML = '';
        el.appendChild(link('tel:' + list[0].replace(/[^+\d]/g, ''), list[0]));
      } else if (key === 'email') {
        el.innerHTML = '';
        el.appendChild(link('mailto:' + list[0], list[0]));
      } else if (list.length > 1) {
        el.innerHTML = '';
        list.forEach(function (line, i) {
          if (i) el.appendChild(document.createElement('br'));
          el.appendChild(document.createTextNode(line));
        });
      } else {
        el.textContent = list[0];
      }
    });

    function link(href, text) {
      var a = document.createElement('a');
      a.href = href;
      a.textContent = text;
      a.className = 'inline-link';
      return a;
    }
  })();

  /* ---------------------------------------------------- scroll reveals -- */
  (function reveals() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    if (reduced || !('IntersectionObserver' in window)) return; // stays visible

    // arm only now: until this class lands, .reveal elements are fully visible
    document.documentElement.classList.add('reveals-armed');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(items, function (el, i) {
      // stagger siblings so groups arrive as a sequence, not a block
      var sibs = el.parentElement ? el.parentElement.children : [el];
      var idx = Array.prototype.indexOf.call(sibs, el);
      el.style.setProperty('--d', Math.min(idx, 5) * 0.09 + 's');
      io.observe(el);
    });
  })();

  /* -------------------------------------------------------- lightbox ---- */
  (function lightbox() {
    var shots = Array.prototype.slice.call(document.querySelectorAll('[data-lightbox]'));
    var box = document.getElementById('lightbox');
    if (!shots.length || !box) return;

    var stage = box.querySelector('[data-lb-img]');
    var cap = box.querySelector('[data-lb-cap]');
    var count = box.querySelector('[data-lb-count]');
    var btnClose = box.querySelector('[data-lb-close]');
    var btnPrev = box.querySelector('[data-lb-prev]');
    var btnNext = box.querySelector('[data-lb-next]');
    var index = 0;
    var lastFocus = null;

    var items = shots.map(function (el) {
      var img = el.querySelector('img');
      return {
        el: el,
        src: el.getAttribute('data-full') || (img && img.currentSrc) || (img && img.src),
        alt: (img && img.getAttribute('alt')) || '',
        cap: el.getAttribute('data-caption') || ''
      };
    });

    function show(i) {
      index = (i + items.length) % items.length;
      var it = items[index];
      stage.src = it.src;
      stage.alt = it.alt;
      cap.textContent = it.cap;
      count.textContent = (index + 1) + ' / ' + items.length;
      // warm the neighbours so paging feels instant
      [index + 1, index - 1].forEach(function (n) {
        var nb = items[(n + items.length) % items.length];
        if (nb && nb.src) { var p = new Image(); p.src = nb.src; }
      });
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.classList.add('is-open');
      box.removeAttribute('aria-hidden');
      document.body.classList.add('is-locked');
      btnClose.focus();
    }

    function close() {
      box.classList.remove('is-open');
      box.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-locked');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    shots.forEach(function (el, i) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        open(i);
      });
    });

    btnClose.addEventListener('click', close);
    btnPrev.addEventListener('click', function () { show(index - 1); });
    btnNext.addEventListener('click', function () { show(index + 1); });

    box.addEventListener('click', function (e) {
      if (e.target === box || e.target.closest('[data-lb-stage]') === e.target) close();
    });

    document.addEventListener('keydown', function (e) {
      if (!box.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
      else if (e.key === 'Tab') {
        // keep focus inside the overlay while it is open
        var f = box.querySelectorAll('button');
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // swipe on touch
    var x0 = null;
    box.addEventListener('touchstart', function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 50) show(index + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
  })();

  /* ------------------------------------------------------------ forms --- */
  (function forms() {
    var forms = document.querySelectorAll('form[data-enquiry]');
    if (!forms.length) return;

    var endpoint = CFG.FORM_ENDPOINT || '';
    var configured = endpoint && endpoint.indexOf('YOUR_FORM_ID') === -1;

    Array.prototype.forEach.call(forms, function (form) {
      if (configured) form.setAttribute('action', endpoint);

      var msg = form.querySelector('[data-form-msg]');
      var sent = form.parentElement.querySelector('[data-form-sent]');
      var btn = form.querySelector('[type="submit"]');
      var btnText = btn ? btn.textContent : '';

      function say(text, isError) {
        if (!msg) return;
        msg.textContent = text;
        msg.classList.add('is-shown');
        msg.classList.toggle('is-error', !!isError);
      }

      form.addEventListener('submit', function (e) {
        // a filled honeypot means a bot — drop it without a word
        var hp = form.querySelector('input[name="_gotcha"]');
        if (hp && hp.value) { e.preventDefault(); return; }

        if (!configured) {
          e.preventDefault();
          say(
            'This form is not connected yet. Add the Formspree endpoint in ' +
            'assets/js/config.js (FORM_ENDPOINT) so enquiries reach your inbox.',
            true
          );
          return;
        }

        if (!window.fetch) return; // let the browser post normally

        e.preventDefault();
        if (msg) msg.classList.remove('is-shown');
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        fetch(form.action, {
          method: 'POST',
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        })
          .then(function (res) {
            if (!res.ok) throw new Error('http ' + res.status);
            form.reset();
            if (sent) {
              form.hidden = true;
              sent.classList.add('is-shown');
              sent.setAttribute('tabindex', '-1');
              sent.focus();
            } else {
              say('Thank you — your enquiry has been sent. We will be in touch shortly.');
            }
          })
          .catch(function () {
            say(
              'Sorry — that did not send. Please try again, or contact us directly ' +
              'and we will pick it up straight away.',
              true
            );
          })
          .then(function () {
            if (btn) { btn.disabled = false; btn.textContent = btnText; }
          });
      });
    });
  })();

  /* --------------------------------------- sticky action bar (phones) --- */
  (function actionBar() {
    var bar = document.getElementById('actionBar');
    if (!bar) return;

    // it should appear once the hero is behind you, not over the top of it
    var trigger = document.querySelector('.hero') || document.querySelector('main > *');
    var showAt = 320;

    function measure() {
      if (trigger) showAt = Math.max(240, trigger.offsetHeight * 0.75);
    }

    // With a phone number configured, calling becomes the primary action and
    // the secondary link steps aside so the bar stays at two buttons.
    (function wireCall() {
      var call = bar.querySelector('[data-action="call"]');
      var quote = bar.querySelector('[data-action="quote"]');
      var alt = bar.querySelector('[data-action="alt"]');
      if (!call || !CFG.phone) return;
      call.href = 'tel:' + String(CFG.phone).replace(/[^+\d]/g, '');
      call.hidden = false;
      call.classList.add('is-primary');
      if (quote) quote.classList.remove('is-primary');
      if (alt) alt.hidden = true;
    })();

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        bar.classList.toggle('is-up', window.scrollY > showAt);
        ticking = false;
      });
    }

    measure();
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { measure(); onScroll(); });
  })();

  /* ------------------------------------------- current year in footer --- */
  Array.prototype.forEach.call(document.querySelectorAll('[data-year]'), function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
