/* =========================================================================
   Magiway — comportamento da landing.
   Tudo que é conteúdo variável (contato, links, endpoint do formulário) mora
   no objeto SITE abaixo: é o único ponto que precisa ser editado para publicar.
   ========================================================================= */
(function () {
  'use strict';

  /* ------------------------------------------------------------- CONFIG */

  var SITE = {
    // >>> SUBSTITUIR PELOS DADOS REAIS DA EMPRESA <<<
    phone: '+1 (000) 000-0000',
    whatsapp: '10000000000',            // só dígitos, com código do país
    whatsappText: 'Falar no WhatsApp',
    email: 'contato@magiwayrentalcar.com',
    address: 'Orlando, Flórida — Estados Unidos',
    hours: 'Todos os dias — inclusive durante a sua viagem',
    instagram: 'https://www.instagram.com/',
    facebook: 'https://www.facebook.com/',

    // Endpoint que recebe o lead (Formspree, n8n, webhook do CRM...).
    // Enquanto estiver vazio, o formulário abre o WhatsApp já preenchido.
    formEndpoint: ''
  };

  SITE.whatsappUrl = 'https://wa.me/' + SITE.whatsapp;
  SITE.emailUrl = 'mailto:' + SITE.email;

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -------------------------------------------------- dados da empresa */

  $$('[data-site]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site')];
    if (v) el.textContent = v;
  });
  $$('[data-site-href]').forEach(function (el) {
    var v = SITE[el.getAttribute('data-site-href')];
    if (v) el.setAttribute('href', v);
  });
  $('#waFloat').href = SITE.whatsappUrl;
  $('#year').textContent = new Date().getFullYear();

  /* ------------------------------------------------------------ nav */

  var nav = $('#nav');
  var burger = $('#burger');
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#navLinks a').forEach(function (a) {
    a.addEventListener('click', function () {
      nav.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  var bar = $('#scrollbar');
  function onScroll() {
    var y = window.scrollY || document.documentElement.scrollTop;
    nav.classList.toggle('is-stuck', y > 20);
    var max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* -------------------------------------------------------- revelações */

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
  $$('[data-reveal]').forEach(function (el) { io.observe(el); });

  /* ------------------------------------------------------- contadores */

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var dec = parseInt(el.getAttribute('data-decimal') || '0', 10);
    var value = dec ? target / Math.pow(10, dec) : target;
    if (reduced) {
      el.textContent = dec ? value.toFixed(dec).replace('.', ',') : value.toLocaleString('pt-BR');
      return;
    }
    var t0 = performance.now(), dur = 1500;
    (function tick(t) {
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      var v = value * eased;
      el.textContent = dec ? v.toFixed(dec).replace('.', ',') : Math.round(v).toLocaleString('pt-BR');
      if (k < 1) requestAnimationFrame(tick);
    })(t0);
  }
  var ioCount = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      runCounter(e.target);
      ioCount.unobserve(e.target);
    });
  }, { threshold: 0.6 });
  $$('[data-count]').forEach(function (el) { ioCount.observe(el); });

  /* ------------------------------------------- linha do tempo do processo */

  var stepsFill = $('#stepsFill');
  if (stepsFill) {
    var ioSteps = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        stepsFill.style.width = '100%';
        ioSteps.unobserve(e.target);
      });
    }, { threshold: 0.35 });
    ioSteps.observe($('#steps'));
  }

  /* ---------------------------------------------------------- marquee */

  var words = ['Aeroporto MCO', 'Atendimento em português', 'Frota revisada', 'Cadeirinha inclusa',
               'Sem taxa escondida', 'Suporte na viagem', 'Entrega no hotel', 'Famílias brasileiras'];
  var mq = $('#marquee');
  if (mq) {
    var html = words.map(function (w) { return '<span>' + w + '</span>'; }).join('');
    mq.innerHTML = html + html; // duas cópias: o keyframe translada 50%
  }

  /* ------------------------------------------------------------- frota */

  var FLEET = [
    {
      key: 'sedan', spec: 'sedan', color: '#15171b',
      badge: 'Casal ou família pequena',
      name: 'Sedan',
      note: 'Econômico no combustível e fácil de estacionar nos parques. A escolha certa para quem viaja em até quatro pessoas sem excesso de bagagem.',
      colorName: 'Preto Ônix',
      specs: [['Passageiros', 'Até 5'], ['Malas grandes', '2 a 3'], ['Câmbio', 'Automático'], ['Cor', 'Preto Ônix']]
    },
    {
      key: 'suv', spec: 'suv', color: '#17224a',
      badge: 'Conforto e porta-malas',
      name: 'SUV',
      note: 'Posição de dirigir alta, porta-malas generoso e muito espaço nas pernas. Boa para famílias de quatro a cinco pessoas com bagagem completa.',
      colorName: 'Azul Meia-Noite',
      specs: [['Passageiros', 'Até 5'], ['Malas grandes', '3 a 4'], ['Câmbio', 'Automático'], ['Cor', 'Azul Meia-Noite']]
    },
    {
      key: 'minivan', spec: 'minivan', color: '#3a1421',
      badge: 'A preferida das famílias',
      name: 'Minivan Chrysler Pacifica Limited',
      note: 'Portas deslizantes elétricas, poltronas capitão e o sistema Stow ’n Go. É a que mais sai na Magiway — e a que você conhece por dentro logo abaixo.',
      colorName: 'Bordô Profundo',
      specs: [['Passageiros', 'Até 7'], ['Malas grandes', '4 a 5'], ['Câmbio', 'Automático'], ['Cor', 'Bordô Profundo']]
    },
    {
      key: 'fullsuv', spec: 'fullsuv', color: '#262a30',
      badge: 'Famílias grandes',
      name: 'SUV grande — Ford Expedition Limited',
      note: 'Três fileiras de verdade, porta-malas que engole o outlet inteiro e presença de sobra na estrada. Para grupos de sete a oito pessoas.',
      colorName: 'Grafite Escuro',
      specs: [['Passageiros', 'Até 8'], ['Malas grandes', '5 a 6'], ['Câmbio', 'Automático'], ['Cor', 'Grafite Escuro']]
    }
  ];

  var track = $('#fleetTrack');
  var dotsBox = $('#fleetDots');
  var viewers = [];

  FLEET.forEach(function (car, i) {
    var slide = document.createElement('div');
    slide.className = 'fleet__slide';
    slide.setAttribute('role', 'tabpanel');
    slide.innerHTML =
      '<div class="fleet__stage"><canvas aria-label="' + car.name + '" role="img"></canvas></div>' +
      '<div class="fleet__info">' +
        '<p class="chapter">' + car.badge + '</p>' +
        '<h3>' + car.name + '</h3>' +
        '<p>' + car.note + '</p>' +
        '<dl class="fleet__specs">' +
          car.specs.map(function (s) {
            var val = s[0] === 'Cor'
              ? '<span class="fleet__swatch"><i style="background:' + car.color + '"></i>' + s[1] + '</span>'
              : s[1];
            return '<div><dt>' + s[0] + '</dt><dd>' + val + '</dd></div>';
          }).join('') +
        '</dl>' +
      '</div>';
    track.appendChild(slide);

    viewers.push(Car3D.create($('canvas', slide), car.spec, { color: car.color, yaw: 3.9 }));

    var dot = document.createElement('button');
    dot.className = 'fleet__dot' + (i === 0 ? ' is-active' : '');
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-label', car.name);
    dot.addEventListener('click', function () { goTo(i); });
    dotsBox.appendChild(dot);
  });

  var current = 0;
  function goTo(i) {
    current = (i + FLEET.length) % FLEET.length;
    track.style.transform = 'translateX(' + (-current * 100) + '%)';
    $$('.fleet__dot', dotsBox).forEach(function (d, k) { d.classList.toggle('is-active', k === current); });
    // Só o carro visível anima: quatro renders simultâneos não valem a bateria.
    viewers.forEach(function (v, k) { if (k === current) v.start(); else v.stop(); });
  }
  $('#fleetPrev').addEventListener('click', function () { goTo(current - 1); });
  $('#fleetNext').addEventListener('click', function () { goTo(current + 1); });

  var ioFleet = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) viewers[current].start();
      else viewers.forEach(function (v) { v.stop(); });
    });
  }, { threshold: 0.2 });
  ioFleet.observe($('.fleet__viewport'));

  /* --------------------------------------------------------- hero 3D */

  var hero = Car3D.create($('#heroCar'), 'minivan', { color: '#16224e', yaw: 4.1, spin: 0.0013 });
  var ioHero = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) hero.start(); else hero.stop(); });
  }, { threshold: 0.1 });
  ioHero.observe($('#heroCar'));

  /* ------------------------------------------------------- 360 + cores */

  var COLORS = [
    { hex: '#3a1421', name: 'Bordô Profundo' },
    { hex: '#16224e', name: 'Azul Meia-Noite' },
    { hex: '#14161a', name: 'Preto Ônix' },
    { hex: '#2b3036', name: 'Grafite Escuro' }
  ];

  var exp = Car3D.create($('#exp360'), 'minivan', {
    color: COLORS[0].hex, yaw: 3.9, spin: 0.0016, interactive: true
  });
  var swatches = $('#swatches');
  COLORS.forEach(function (c, i) {
    var b = document.createElement('button');
    b.className = 'swatch' + (i === 0 ? ' is-active' : '');
    b.style.background = c.hex;
    b.title = c.name;
    b.setAttribute('aria-label', 'Cor ' + c.name);
    b.addEventListener('click', function () {
      exp.setColor(c.hex);
      $('#colorName').textContent = c.name;
      $$('.swatch', swatches).forEach(function (s) { s.classList.remove('is-active'); });
      b.classList.add('is-active');
    });
    swatches.appendChild(b);
  });

  var hint = $('#expHint');
  $('#exp360').addEventListener('pointerdown', function () { hint.classList.add('is-hidden'); });

  var ioExp = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting && $('#paneExterior').hidden === false) exp.start();
      else exp.stop();
    });
  }, { threshold: 0.15 });
  ioExp.observe($('#exp360'));

  /* --------------------------------------------- entrar / sair do carro */

  var paneExt = $('#paneExterior');
  var paneInt = $('#paneInterior');
  var enterBtn = $('#enterCar');
  var inside = false;

  enterBtn.addEventListener('click', function () {
    inside = !inside;
    paneExt.hidden = inside;
    paneInt.hidden = !inside;
    enterBtn.innerHTML = inside
      ? '<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M14 17l-5-5 5-5M9 12h12"/></svg> Voltar para fora'
      : '<svg class="btn__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"/></svg> Entrar no carro';
    if (inside) { exp.stop(); } else { exp.start(); exp.resize(); }
  });

  /* ----------------------------------------- interior: pontos e panorama */

  // x/y em % da cena panorâmica (4800 x 900) · zoom = viewBox do detalhe.
  var HOTSPOTS = [
    { x: 16.67, y: 6.7, zone: 0, zoom: '380 0 840 560', title: 'Teto solar panorâmico',
      text: 'A cabine inteira recebe luz natural sem esquentar. Nas viagens longas entre os parques, faz diferença para quem viaja atrás.',
      facts: ['Cobertura sobre as duas primeiras fileiras', 'Cortina elétrica de blackout', 'Vidro com proteção solar'] },
    { x: 8.9, y: 44.4, zone: 0, zoom: '105 270 450 300', title: 'Painel digital',
      text: 'Toda a informação de viagem em um quadro só: velocidade, autonomia, consumo e as orientações da navegação, sem tirar os olhos da estrada.',
      facts: ['Cluster digital de alta resolução', 'Navegação espelhada no painel', 'Alertas de faixa e ponto cego'] },
    { x: 8.92, y: 63.8, zone: 0, zoom: '130 370 600 400', title: 'Volante multifuncional',
      text: 'Controles de áudio, telefone e piloto automático adaptativo ao alcance do polegar — e revestimento que não esquenta no sol da Flórida.',
      facts: ['Piloto automático adaptativo', 'Controles de áudio e chamadas', 'Ajuste de altura e profundidade'] },
    { x: 18.96, y: 51.7, zone: 0, zoom: '640 285 540 360', title: 'Central multimídia',
      text: 'Tela sensível ao toque com Apple CarPlay e Android Auto sem fio. Coloque o roteiro do dia antes de sair do estacionamento.',
      facts: ['CarPlay e Android Auto sem fio', 'Câmera de ré com linhas dinâmicas', 'Áudio premium com várias posições'] },
    { x: 18.96, y: 69.8, zone: 0, zoom: '670 468 480 320', title: 'Climatização tri-zona',
      text: 'Três zonas independentes: motorista, passageiro e segunda fileira. Ninguém precisa negociar a temperatura no meio da viagem.',
      facts: ['Controle independente por zona', 'Saídas dedicadas para as fileiras traseiras', 'Filtro de ar da cabine'] },
    { x: 19.17, y: 84.4, zone: 0, zoom: '590 540 660 440', title: 'Console e câmbio rotativo',
      text: 'Câmbio em botão giratório libera o console para o que a família realmente usa: porta-copos fundos, carregadores e espaço passante.',
      facts: ['Câmbio rotativo', 'Portas USB para as duas primeiras fileiras', 'Porta-objetos passante embaixo do console'] },
    { x: 39.58, y: 30.6, zone: 1, zoom: '1630 95 540 360', title: 'Portas deslizantes elétricas',
      text: 'Abrem e fecham no botão ou na chave. Em estacionamento apertado de parque, ninguém bate a porta no carro do lado.',
      facts: ['Acionamento elétrico dos dois lados', 'Cortina solar integrada no vidro', 'Abertura pela chave ou pelo painel'] },
    { x: 49.5, y: 47.8, zone: 1, zoom: '2230 190 720 480', title: 'Poltronas capitão e Stow ’n Go',
      text: 'Duas poltronas individuais na segunda fileira, com passagem central para a terceira. Os assentos somem no piso quando você precisa de espaço de carga.',
      facts: ['Poltronas individuais reclináveis', 'Passagem central para a 3ª fileira', 'Assentos recolhíveis no piso (Stow ’n Go)'] },
    { x: 77.92, y: 46.7, zone: 2, zoom: '3340 180 800 533', title: 'Terceira fileira',
      text: 'Três lugares utilizáveis de verdade, com saída de ar e espaço para adolescentes — não só para criança pequena.',
      facts: ['3 lugares com cinto de três pontos', 'Encostos rebatíveis em 60/40', 'Saídas de ar e porta-copos próprios'] },
    { x: 92.5, y: 71.1, zone: 2, zoom: '4140 420 660 440', title: 'Porta-malas',
      text: 'Com a terceira fileira em uso ainda sobram malas grandes no poço de carga. Rebatendo os bancos, cabe a viagem inteira de compras.',
      facts: ['Poço de carga profundo atrás da 3ª fileira', 'Piso plano com os bancos rebatidos', 'Tampa traseira elétrica'] }
  ];

  var hotBox = $('#hotspots');
  HOTSPOTS.forEach(function (h, i) {
    var b = document.createElement('button');
    b.className = 'hotspot';
    b.style.left = h.x + '%';
    b.style.top = h.y + '%';
    b.setAttribute('aria-label', 'Ampliar: ' + h.title);
    b.innerHTML = '<i></i><span class="hotspot__tip">' + h.title + '</span>';
    b.addEventListener('click', function (e) {
      e.stopPropagation();
      openLightbox(i);
    });
    hotBox.appendChild(b);
  });

  // panorama: 3 telas, arrastável
  var scene = $('#interiorScene');
  var vp = $('#interiorViewport');
  var zone = 0;

  function setZone(z) {
    zone = Math.max(0, Math.min(2, z));
    scene.style.transform = 'translateX(' + (-zone * (100 / 3)) + '%)';
    $$('.zone-btn').forEach(function (b) {
      b.classList.toggle('is-active', parseInt(b.getAttribute('data-zone'), 10) === zone);
    });
  }
  $$('.zone-btn').forEach(function (b) {
    b.addEventListener('click', function () { setZone(parseInt(b.getAttribute('data-zone'), 10)); });
  });
  setZone(0);

  (function bindPan() {
    var startX = 0, startZone = 0, dragging = false, moved = 0;
    vp.addEventListener('pointerdown', function (e) {
      if (e.target.closest('.hotspot')) return;
      dragging = true; moved = 0;
      startX = e.clientX; startZone = zone;
      scene.classList.add('is-dragging');
      vp.classList.add('is-grabbing');
      vp.setPointerCapture(e.pointerId);
    });
    vp.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      var dx = e.clientX - startX;
      moved = Math.abs(dx);
      var pct = (dx / vp.clientWidth) * (100 / 3);
      scene.style.transform = 'translateX(' + (-startZone * (100 / 3) + pct) + '%)';
    });
    function end(e) {
      if (!dragging) return;
      dragging = false;
      scene.classList.remove('is-dragging');
      vp.classList.remove('is-grabbing');
      try { vp.releasePointerCapture(e.pointerId); } catch (err) {}
      var dx = e.clientX - startX;
      if (Math.abs(dx) > vp.clientWidth * 0.16) setZone(startZone + (dx < 0 ? 1 : -1));
      else setZone(startZone);
    }
    vp.addEventListener('pointerup', end);
    vp.addEventListener('pointercancel', end);
  })();

  /* -------------------------------------------------- lightbox de detalhe */

  var lb = $('#lightbox');
  var lbMedia = $('#lbMedia');
  var lbIndex = 0;
  var lastFocus = null;

  function openLightbox(i) {
    lbIndex = (i + HOTSPOTS.length) % HOTSPOTS.length;
    var h = HOTSPOTS[lbIndex];

    // A "foto ampliada" é o mesmo desenho vetorial com o viewBox recortado
    // no detalhe — dá zoom sem perder nitidez. Se houver foto real, ela entra
    // no lugar via h.photo.
    $$('svg, img', lbMedia).forEach(function (n) { n.remove(); });
    if (h.photo) {
      var img = new Image();
      img.src = h.photo;
      img.alt = h.title;
      lbMedia.appendChild(img);
    } else {
      var clone = $('#cabinSvg').cloneNode(true);
      clone.removeAttribute('id');
      clone.setAttribute('viewBox', h.zoom);
      clone.setAttribute('aria-label', h.title);
      lbMedia.appendChild(clone);
    }

    $('#lbTitle').textContent = h.title;
    $('#lbText').textContent = h.text;
    $('#lbFacts').innerHTML = h.facts.map(function (f) {
      return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg><span>' + f + '</span></li>';
    }).join('');
    $('#lbCount').textContent = (lbIndex + 1) + ' de ' + HOTSPOTS.length;

    lastFocus = document.activeElement;
    lb.classList.add('is-open');
    document.body.style.overflow = 'hidden';
    $('#lbClose').focus();
  }

  function closeLightbox() {
    lb.classList.remove('is-open');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  $('#lbClose').addEventListener('click', closeLightbox);
  $('#lbPrev').addEventListener('click', function () { openLightbox(lbIndex - 1); });
  $('#lbNext').addEventListener('click', function () { openLightbox(lbIndex + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (!lb.classList.contains('is-open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') openLightbox(lbIndex - 1);
    if (e.key === 'ArrowRight') openLightbox(lbIndex + 1);
  });

  /* -------------------------------------------------------- formulário */

  var form = $('#leadForm');
  var okBox = $('#formOk');

  // rastreio de campanha para o tráfego pago
  (function fillTracking() {
    var qs = new URLSearchParams(location.search);
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid']
      .forEach(function (k) {
        var input = form.elements[k];
        if (input) input.value = qs.get(k) || '';
      });
    if (form.elements.pagina_origem) form.elements.pagina_origem.value = location.href;
  })();

  function setError(input, on) {
    var field = input.closest('.field');
    if (field) field.classList.toggle('has-error', on);
    return !on;
  }

  function validate() {
    var ok = true;
    ok = setError(form.nome, !form.nome.value.trim()) && ok;
    ok = setError(form.whatsapp, form.whatsapp.value.replace(/\D/g, '').length < 10) && ok;
    ok = setError(form.email, !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.value.trim())) && ok;
    ok = setError(form.retirada, !form.retirada.value) && ok;
    var badReturn = !form.devolucao.value || (form.retirada.value && form.devolucao.value < form.retirada.value);
    ok = setError(form.devolucao, badReturn) && ok;
    if (!form.consentimento.checked) ok = false;
    return ok;
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (!validate()) {
      var bad = $('.field.has-error input, .field.has-error select', form);
      if (bad) bad.focus();
      else if (!form.consentimento.checked) form.consentimento.focus();
      return;
    }

    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = v; });

    if (SITE.formEndpoint) {
      var btn = $('button[type="submit"]', form);
      btn.disabled = true;
      fetch(SITE.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (r) {
        if (!r.ok) throw new Error('falha no envio');
        form.reset();
        okBox.textContent = 'Recebemos o seu pedido. Em breve um consultor entra em contato pelo WhatsApp informado.';
        okBox.classList.add('is-visible');
      }).catch(function () {
        okBox.textContent = 'Não conseguimos enviar agora. Chame a gente no WhatsApp que resolvemos na hora.';
        okBox.classList.add('is-visible');
      }).then(function () { btn.disabled = false; });
      return;
    }

    // Sem endpoint configurado: o lead vai para o WhatsApp já redigido.
    var msg = [
      'Olá! Quero uma cotação na Magiway.',
      'Nome: ' + data.nome,
      'WhatsApp: ' + data.whatsapp,
      'E-mail: ' + data.email,
      'Retirada: ' + data.retirada,
      'Devolução: ' + data.devolucao,
      'Pessoas: ' + data.pessoas,
      'Veículo: ' + data.veiculo,
      data.mensagem ? 'Detalhes: ' + data.mensagem : ''
    ].filter(Boolean).join('\n');

    window.open(SITE.whatsappUrl + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    okBox.textContent = 'Abrimos o WhatsApp com a sua solicitação pronta. É só enviar a mensagem.';
    okBox.classList.add('is-visible');
  });

  /* ------------------------------------------------------------ resize */

  var rt;
  window.addEventListener('resize', function () {
    clearTimeout(rt);
    rt = setTimeout(function () {
      hero.resize();
      exp.resize();
      viewers.forEach(function (v) { v.resize(); });
    }, 180);
  });

  goTo(0);
})();
