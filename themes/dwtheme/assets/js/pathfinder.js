(function () {
  var root = document.querySelector('.pf');
  if (!root) return;

  /* Filter */
  var chips = Array.prototype.slice.call(root.querySelectorAll('.pf-chip'));
  var cards = Array.prototype.slice.call(root.querySelectorAll('.pf-card'));
  var count = root.querySelector('.pf-count');
  var empty = root.querySelector('.pf-empty');
  var total = cards.length;

  function applyFilter() {
    var active = chips.filter(function (c) { return c.getAttribute('aria-pressed') === 'true'; })
                      .map(function (c) { return c.dataset.tag; });
    var shown = 0;
    cards.forEach(function (card) {
      var tags = (card.dataset.tags || '').split('|');
      var match = active.length === 0 || active.every(function (t) { return tags.indexOf(t) !== -1; });
      card.hidden = !match;
      if (match) shown++;
    });
    if (count) {
      if (active.length === 0) {
        count.textContent = total === 1 ? 'Hier zeigt dir eine Meeresschützer:in ihren Weg'
                                       : 'Hier zeigen dir ' + total + ' Meeresschützer:innen ihren Weg';
      } else {
        count.textContent = shown + ' von ' + total + ' Wegen passen zu deiner Auswahl';
      }
    }
    if (empty) empty.hidden = shown !== 0;
  }
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      chip.setAttribute('aria-pressed', chip.getAttribute('aria-pressed') === 'true' ? 'false' : 'true');
      applyFilter();
    });
  });


  /* Akkordeon. Ohne JS bleiben alle Karten offen. */
  function setOpen(card, open) {
    var btn = card.querySelector('.pf-toggle');
    var panel = card.querySelector('.pf-panel');
    var label = card.querySelector('.pf-more-label');
    if (!btn || !panel) return;
    card.classList.toggle('is-open', open);
    panel.hidden = !open;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (label) label.textContent = open ? label.dataset.open : label.dataset.closed;
  }
  cards.forEach(function (card) {
    setOpen(card, false);
    card.querySelector('.pf-card-head').addEventListener('click', function (e) {
      if (e.target.closest('a')) return;
      setOpen(card, !card.classList.contains('is-open'));
    });
  });

  /* Stationen: Pfeile und Ausblendung, wenn mehr Platz gebraucht wird als da ist */
  var arrowL = '<svg viewBox="0 0 8 12" fill="none"><path d="M7 1L2 6L7 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var arrowR = '<svg viewBox="0 0 8 12" fill="none"><path d="M1 1L6 6L1 11" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var wraps = Array.prototype.slice.call(root.querySelectorAll('.pf-steps-wrap:not(.pf-steps-wrap-static)'));

  function mkBtn(cls, label, svg, scroller, dir) {
    var b = document.createElement('button');
    b.type = 'button';
    b.className = 'pf-steps-btn ' + cls;
    b.setAttribute('aria-label', label);
    b.innerHTML = svg;
    b.addEventListener('click', function () {
      scroller.scrollBy({ left: dir * Math.max(120, scroller.clientWidth * 0.7), behavior: 'smooth' });
    });
    return b;
  }
  wraps.forEach(function (wrap) {
    var sc = wrap.querySelector('.pf-steps');
    if (!sc) return;
    wrap.appendChild(mkBtn('pf-steps-btn-left', 'Frühere Stationen', arrowL, sc, -1));
    wrap.appendChild(mkBtn('pf-steps-btn-right', 'Spätere Stationen', arrowR, sc, 1));
    function refresh() {
      wrap.classList.toggle('can-left', sc.scrollLeft > 4);
      wrap.classList.toggle('can-right', sc.scrollLeft + sc.clientWidth < sc.scrollWidth - 4);
    }
    sc.addEventListener('scroll', refresh, { passive: true });
    wrap._pfRefresh = refresh;
    refresh();
  });
  function refreshAll() { wraps.forEach(function (w) { if (w._pfRefresh) w._pfRefresh(); }); }
  window.addEventListener('resize', refreshAll);
  window.addEventListener('load', refreshAll);

  /* Karte per Link-Anker öffnen (#vorname-nachname) */
  function openFromHash() {
    var id = decodeURIComponent(location.hash.replace(/^#/, ''));
    if (!id) return;
    var el = document.getElementById(id);
    if (el && el.classList.contains('pf-card')) {
      setOpen(el, true);
      el.scrollIntoView({ block: 'start' });
    }
  }
  openFromHash();
  window.addEventListener('hashchange', openFromHash);

  /* Video im Dialog. Ohne JS bleibt der Link auf die Videodatei. */
  var dlg = root.querySelector('.pf-dialog');
  if (dlg && typeof dlg.showModal === 'function') {
    var video = dlg.querySelector('video');
    var cap = dlg.querySelector('.pf-dialog-caption');
    function close() { dlg.close(); }
    root.querySelectorAll('[data-video]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        e.preventDefault();
        video.src = a.dataset.video;
        if (a.dataset.poster) video.poster = a.dataset.poster; else video.removeAttribute('poster');
        cap.textContent = a.dataset.caption || '';
        dlg.showModal();
        video.play().catch(function () {});
      });
    });
    dlg.querySelector('.pf-dialog-close').addEventListener('click', close);
    dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
    dlg.addEventListener('close', function () { video.pause(); video.removeAttribute('src'); video.load(); });
  }
})();
