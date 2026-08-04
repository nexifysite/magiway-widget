/* ═══════════════════════════════════════════════════════════════════
   MAGIWAY — Service Worker
   ───────────────────────────────────────────────────────────────────
   O caso de uso é o estacionamento do aeroporto: quem entrega o carro
   abre a Agenda do Dia no celular, e é exatamente ali que o sinal cai.
   Sem isto, a tela nem carrega.

   Estratégia por tipo de pedido:
     • o app (index.html) → REDE PRIMEIRO, cache como reserva.
       O index é servido com "no-store" pelo Netlify, então a versão nova
       chega sempre que houver rede; o cache só entra quando não houver.
     • ícones e manifesto → CACHE PRIMEIRO (não mudam).
     • Supabase, Google Sheets, APIs de IA → NUNCA passam por aqui.
       Dado de operação não pode ser servido velho sem a pessoa saber.
   ═══════════════════════════════════════════════════════════════════ */
const VERSAO = 'magiway-v1';
const ESSENCIAIS = ['/', '/index.html', '/manifest.webmanifest',
                    '/icon-192.png', '/icon-512.png', '/icon-maskable.png'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(VERSAO)
      .then((c) => c.addAll(ESSENCIAIS).catch((err) => console.warn('[sw] pré-cache parcial', err)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((ks) => Promise.all(ks.filter((k) => k !== VERSAO).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Só mexemos no que é da própria origem e é GET. Todo o resto passa direto. */
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  let url;
  try { url = new URL(req.url); } catch (_) { return; }
  if (url.origin !== self.location.origin) return;   // Supabase, Sheets, IA, fontes

  const ehApp = req.mode === 'navigate' || url.pathname === '/' || url.pathname.endsWith('/index.html');

  if (ehApp) {
    // rede primeiro: a versão publicada ganha sempre que houver sinal
    e.respondWith(
      fetch(req)
        .then((res) => {
          const copia = res.clone();
          caches.open(VERSAO).then((c) => c.put('/index.html', copia)).catch(() => {});
          return res;
        })
        .catch(() => caches.match('/index.html').then((r) => r || caches.match('/')))
    );
    return;
  }

  // ícones e manifesto: cache primeiro
  e.respondWith(
    caches.match(req).then((cacheado) => cacheado || fetch(req).then((res) => {
      if (res && res.status === 200) {
        const copia = res.clone();
        caches.open(VERSAO).then((c) => c.put(req, copia)).catch(() => {});
      }
      return res;
    }).catch(() => cacheado))
  );
});
