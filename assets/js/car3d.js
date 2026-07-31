/*!
 * car3d.js — renderizador 3D leve (canvas 2D, sem dependências) para veículos
 * estilizados. Usado na frota e na experiência 360º da landing da Magiway.
 *
 * A geometria nasce de um perfil lateral (silhueta) que é "loftado" ao longo da
 * largura, com tumblehome, arcos de roda e materiais por aresta. O resultado é
 * um render de estúdio: escuro, sóbrio, com specular controlado.
 */
(function (root) {
  'use strict';

  /* ------------------------------------------------------------------ cor */

  function hex2rgb(h) {
    h = h.replace('#', '');
    if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
    return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  }
  function mix(a, b, t) {
    return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
  }
  function css(c) {
    return 'rgb(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ')';
  }
  function clampc(c) {
    return [Math.max(0, Math.min(255, c[0])), Math.max(0, Math.min(255, c[1])), Math.max(0, Math.min(255, c[2]))];
  }

  /* --------------------------------------------------------------- vetores */

  function norm(v) {
    var l = Math.hypot(v[0], v[1], v[2]) || 1;
    return [v[0] / l, v[1] / l, v[2] / l];
  }
  function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }

  // Normal de polígono pelo método de Newell (funciona com faces não planas).
  function newell(pts) {
    var n = [0, 0, 0], i, a, b;
    for (i = 0; i < pts.length; i++) {
      a = pts[i]; b = pts[(i + 1) % pts.length];
      n[0] += (a[1] - b[1]) * (a[2] + b[2]);
      n[1] += (a[2] - b[2]) * (a[0] + b[0]);
      n[2] += (a[0] - b[0]) * (a[1] + b[1]);
    }
    return norm(n);
  }

  /* ------------------------------------------------------------ materiais */

  var MAT = {
    body:   { spec: 0.62, pow: 46, amb: 0.14, fres: 0.34, sky: 0.13 },
    glass:  { spec: 1.00, pow: 96, amb: 0.05, fres: 0.80, sky: 0.20, col: [15, 19, 28] },
    tire:   { spec: 0.16, pow: 14, amb: 0.11, fres: 0.16, sky: 0.05, col: [18, 19, 22] },
    rim:    { spec: 0.88, pow: 34, amb: 0.18, fres: 0.34, sky: 0.16, col: [138, 147, 160] },
    hub:    { spec: 0.55, pow: 28, amb: 0.13, fres: 0.25, sky: 0.10, col: [58, 63, 71] },
    chrome: { spec: 1.00, pow: 64, amb: 0.20, fres: 0.62, sky: 0.24, col: [174, 184, 199] },
    grille: { spec: 0.38, pow: 26, amb: 0.10, fres: 0.26, sky: 0.07, col: [25, 27, 32] },
    trim:   { spec: 0.24, pow: 18, amb: 0.10, fres: 0.22, sky: 0.06, col: [31, 33, 38] },
    lampF:  { spec: 0.95, pow: 52, amb: 0.46, fres: 0.45, sky: 0.10, col: [216, 226, 244] },
    lampR:  { spec: 0.95, pow: 52, amb: 0.44, fres: 0.40, sky: 0.08, col: [186, 28, 54] }
  };

  var LIGHT = norm([-0.42, 0.74, 0.55]);
  var FILL = norm([0.62, 0.18, -0.30]);
  var HALF = norm([LIGHT[0], LIGHT[1], LIGHT[2] + 1]);
  var SKY = [104, 128, 188];

  function shade(n, mat, base) {
    if (n[2] < 0) n = [-n[0], -n[1], -n[2]];
    var d = Math.max(0, dot(n, LIGHT));
    var f = Math.max(0, dot(n, FILL)) * 0.30;
    var lum = mat.amb + 0.86 * Math.pow(d, 0.8) + f;
    var c = [base[0] * lum, base[1] * lum, base[2] * lum];
    c = mix(c, SKY, Math.max(0, n[1]) * mat.sky);
    var s = Math.pow(Math.max(0, dot(n, HALF)), mat.pow) * mat.spec;
    c = [c[0] + 255 * s, c[1] + 255 * s, c[2] + 255 * s];
    var fres = Math.pow(1 - Math.min(1, Math.max(0, n[2])), 3);
    c = mix(c, [156, 176, 220], fres * mat.fres * 0.5);
    return clampc(c);
  }

  /* --------------------------------------------------------------- perfil */

  // Fecha a silhueta: recebe o contorno superior (traseira -> frente) e devolve
  // o polígono completo com a soleira e os arcos de roda recortados.
  function buildProfile(spec) {
    var pts = spec.upper.map(function (p) {
      return { x: p[0], y: p[1], m: p[2] || 'body' };
    });
    var sill = spec.sill;
    var wheels = spec.wheels.slice().sort(function (a, b) { return b.x - a.x; });
    var last = pts[pts.length - 1];
    pts[pts.length - 1] = { x: last.x, y: last.y, m: 'trim' };

    wheels.forEach(function (w) {
      var r = w.r + spec.archGap;
      pts.push({ x: w.x + r, y: sill, m: 'trim' });
      var steps = 16, i, a;
      for (i = 0; i <= steps; i++) {
        a = (i / steps) * Math.PI;
        pts.push({ x: w.x + r * Math.cos(a), y: sill + r * Math.sin(a), m: 'trim' });
      }
      pts.push({ x: w.x - r, y: sill, m: 'trim' });
    });
    pts.push({ x: spec.upper[0][0], y: sill, m: 'trim' });
    return pts;
  }

  /* ----------------------------------------------------------------- mesh */

  function widthAt(spec, y) {
    var w = 1;
    if (y > spec.shoulder) {
      var t = (y - spec.shoulder) / Math.max(0.001, spec.H - spec.shoulder);
      w = 1 - spec.tumble * Math.pow(Math.min(1, t), 1.45);
    }
    if (y < spec.hip) {
      var u = (spec.hip - y) / spec.hip;
      w *= 1 - 0.11 * Math.pow(u, 1.3);
    }
    return w;
  }

  function buildMesh(spec, colorHex) {
    var prof = buildProfile(spec);
    var base = hex2rgb(colorHex);
    var L = spec.L, H = spec.H, W = spec.W;
    var cx = L / 2, cy = H * 0.46;
    var faces = [];

    // Fatias não uniformes: mais densas perto das laterais para arredondar bem
    // os ombros do capô e do teto.
    var M = 11, slices = [], j, u;
    for (j = 0; j < M; j++) {
      u = -1 + (2 * j) / (M - 1);
      slices.push(Math.sign(u) * Math.pow(Math.abs(u), 0.70));
    }

    function place(p, s) {
      var hw = (W / 2) * widthAt(spec, p.y);
      var tx = (p.x - cx) / (L / 2);
      var x = cx + (p.x - cx) * (1 - 0.10 * s * s * tx * tx);
      var y = p.y * (1 - 0.03 * s * s * (p.y / H));
      return [x - cx, y - cy, hw * s];
    }

    var grid = slices.map(function (s) {
      return prof.map(function (p) { return place(p, s); });
    });

    // Casca: tiras entre fatias (teto, capô, para-choques, vidros dianteiro
    // e traseiro herdam o material da aresta do perfil).
    var i, k, quad, m, sMid;
    for (j = 0; j < M - 1; j++) {
      sMid = (Math.abs(slices[j]) + Math.abs(slices[j + 1])) / 2;
      for (i = 0; i < prof.length; i++) {
        k = (i + 1) % prof.length;
        m = prof[i].m;
        // Faróis e lanternas existem só nos cantos: no miolo a mesma aresta
        // vira grade/painel, senão o carro ganha uma barra de luz inteira.
        if ((m === 'lampF' || m === 'lampR') && sMid < 0.54) m = 'body';
        quad = [grid[j][i], grid[j][k], grid[j + 1][k], grid[j + 1][i]];
        faces.push({ p: quad, m: m });
      }
    }

    // Laterais: um polígono por lado, sombreado com gradiente vertical para
    // reproduzir a curvatura da carroceria sem multiplicar as faces. Vidros e
    // colunas viajam como "overlays" da lateral: são coplanares, então
    // precisam ser desenhados logo depois dela, não reordenados pelo pintor.
    [-1, 1].forEach(function (sgn) {
      var overlays = [];
      if (spec.dlo) {
        overlays.push({
          m: 'glass',
          p: spec.dlo.map(function (p) {
            return [p[0] - cx, p[1] - cy, ((W / 2) * widthAt(spec, p[1]) + 0.008) * sgn];
          })
        });
        (spec.pillar || []).forEach(function (pl) {
          overlays.push({
            m: 'body',
            p: pl.map(function (p) {
              return [p[0] - cx, p[1] - cy, ((W / 2) * widthAt(spec, p[1]) + 0.014) * sgn];
            })
          });
        });
      }
      faces.push({ p: grid[sgn < 0 ? 0 : M - 1].slice(), m: 'body', side: sgn, overlays: overlays });
    });

    // Rodas: cilindro + disco de pneu + aro de 5 raios.
    spec.wheels.forEach(function (w) {
      [-1, 1].forEach(function (sgn) {
        var hw = (W / 2) * widthAt(spec, w.r);
        var zo = sgn * (hw * 0.985);
        var zi = sgn * (hw - spec.tireW);
        var N = 18, ring = [], t, ang;
        for (t = 0; t < N; t++) {
          ang = (t / N) * Math.PI * 2;
          ring.push([w.x - cx + w.r * Math.cos(ang), w.r + w.r * Math.sin(ang) - cy]);
        }
        for (t = 0; t < N; t++) {
          var a = ring[t], b = ring[(t + 1) % N];
          faces.push({ p: [[a[0], a[1], zi], [b[0], b[1], zi], [b[0], b[1], zo], [a[0], a[1], zo]], m: 'tire' });
        }
        faces.push({ p: ring.map(function (a) { return [a[0], a[1], zo]; }), m: 'tire', order: 0.004 * sgn });

        var rr = w.r * 0.66, rim = [], hubr = w.r * 0.20;
        for (t = 0; t < N; t++) {
          ang = (t / N) * Math.PI * 2;
          rim.push([w.x - cx + rr * Math.cos(ang), w.r + rr * Math.sin(ang) - cy, zo + sgn * 0.006]);
        }
        faces.push({ p: rim, m: 'hub', order: 0.008 * sgn });
        for (t = 0; t < 5; t++) {
          var a0 = (t / 5) * Math.PI * 2, sw = 0.30;
          var sp = [];
          [a0 - sw, a0 + sw].forEach(function (aa) {
            sp.push([w.x - cx + hubr * Math.cos(aa), w.r + hubr * Math.sin(aa) - cy, zo + sgn * 0.01]);
          });
          [a0 + sw * 0.45, a0 - sw * 0.45].forEach(function (aa) {
            sp.push([w.x - cx + rr * 0.92 * Math.cos(aa), w.r + rr * 0.92 * Math.sin(aa) - cy, zo + sgn * 0.01]);
          });
          faces.push({ p: sp, m: 'rim', order: 0.012 * sgn });
        }
      });
    });

    return { faces: faces, base: base, L: L, H: H, W: W, cy: cy };
  }

  /* ------------------------------------------------------------- renderer */

  function Viewer(canvas, spec, opts) {
    opts = opts || {};
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.spec = spec;
    this.yaw = opts.yaw != null ? opts.yaw : 3.9;
    this.pitch = opts.pitch != null ? opts.pitch : 0.15;
    this.spin = opts.spin != null ? opts.spin : 0.0022;
    this.mesh = buildMesh(spec, opts.color || spec.color);
    this.scale = 1;
    this.running = false;
    this.dragging = false;
    this.vel = 0;
    this.dpr = 1;
    this.reduced = root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.resize();
    if (opts.interactive) this._bindDrag();
  }

  Viewer.prototype.setColor = function (hex) {
    this.mesh = buildMesh(this.spec, hex);
    this.draw();
  };

  Viewer.prototype.resize = function () {
    var c = this.canvas, r = c.getBoundingClientRect();
    this.dpr = Math.min(root.devicePixelRatio || 1, 2);
    var w = Math.max(1, Math.round(r.width)), h = Math.max(1, Math.round(r.height));
    c.width = w * this.dpr;
    c.height = h * this.dpr;
    this.w = w; this.h = h;
    this._fit();
    this.draw();
  };

  // Escala constante: mede a projeção em várias rotações e usa o pior caso,
  // para o carro não "pulsar" enquanto gira.
  Viewer.prototype._fit = function () {
    var self = this, maxW = 0, maxH = 0, i;
    var pts = [];
    this.mesh.faces.forEach(function (f) { f.p.forEach(function (p) { pts.push(p); }); });
    for (i = 0; i < 24; i++) {
      var a = (i / 24) * Math.PI * 2, minx = 1e9, maxx = -1e9, miny = 1e9, maxy = -1e9;
      pts.forEach(function (p) {
        var q = self._cam(p, a, self.pitch);
        var d = self.D - q[2];
        var x = q[0] / d, y = q[1] / d;
        if (x < minx) minx = x; if (x > maxx) maxx = x;
        if (y < miny) miny = y; if (y > maxy) maxy = y;
      });
      maxW = Math.max(maxW, maxx - minx);
      maxH = Math.max(maxH, maxy - miny);
    }
    this.scale = Math.min(this.w / maxW, this.h / maxH) * 0.86;
  };

  Object.defineProperty(Viewer.prototype, 'D', {
    get: function () { return this.spec.L * 3.1; }
  });

  Viewer.prototype._cam = function (p, yaw, pitch) {
    var c = Math.cos(yaw), s = Math.sin(yaw);
    var x = p[0] * c + p[2] * s;
    var z = -p[0] * s + p[2] * c;
    var y = p[1];
    var cp = Math.cos(pitch), sp = Math.sin(pitch);
    return [x, y * cp - z * sp, y * sp + z * cp];
  };

  Viewer.prototype.draw = function () {
    var ctx = this.ctx, self = this;
    var w = this.w, h = this.h, cxs = w / 2, cys = h * 0.56;
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    var D = this.D, sc = this.scale;
    function project(p) {
      var q = self._cam(p, self.yaw, self.pitch);
      var d = D - q[2];
      return [cxs + (q[0] / d) * sc, cys - (q[1] / d) * sc, d, q];
    }

    // Sombra de contato projetada a partir da pegada do veículo.
    var L = this.mesh.L, W = this.mesh.W, cy = this.mesh.cy;
    var foot = [[-L / 2, -cy, -W / 2], [L / 2, -cy, -W / 2], [L / 2, -cy, W / 2], [-L / 2, -cy, W / 2]]
      .map(project);
    var fx = foot.reduce(function (a, p) { return a + p[0]; }, 0) / 4;
    var fy = foot.reduce(function (a, p) { return a + p[1]; }, 0) / 4;
    var rx = Math.max.apply(null, foot.map(function (p) { return Math.abs(p[0] - fx); })) * 1.16;
    var ry = Math.max.apply(null, foot.map(function (p) { return Math.abs(p[1] - fy); })) * 1.5 + h * 0.02;
    ctx.save();
    ctx.translate(fx, fy);
    ctx.scale(1, ry / rx);
    var g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx);
    g.addColorStop(0, 'rgba(2,6,20,0.62)');
    g.addColorStop(0.55, 'rgba(2,6,20,0.30)');
    g.addColorStop(1, 'rgba(2,6,20,0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, rx, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Pintor: do mais distante para o mais próximo.
    var list = this.mesh.faces.map(function (f) {
      var pp = f.p.map(project);
      var depth = 0;
      pp.forEach(function (p) { depth += p[2]; });
      depth = depth / pp.length - (f.order || 0);
      return { f: f, pp: pp, depth: depth };
    });
    list.sort(function (a, b) { return b.depth - a.depth; });

    var baseCol = this.mesh.base;

    function paint(f, pp) {
      var mat = MAT[f.m] || MAT.body;
      var camPts = pp.map(function (p) { return p[3]; });
      var n = newell(camPts);
      var col = mat.col || baseCol;

      ctx.beginPath();
      ctx.moveTo(pp[0][0], pp[0][1]);
      for (var i = 1; i < pp.length; i++) ctx.lineTo(pp[i][0], pp[i][1]);
      ctx.closePath();

      if (f.side && f.m === 'body') {
        // Lateral: gradiente entre a normal inclinada para cima e para baixo.
        var top = norm([n[0], n[1] + 0.85, n[2]]);
        var bot = norm([n[0], n[1] - 1.05, n[2]]);
        var ys = pp.map(function (p) { return p[1]; });
        var y0 = Math.min.apply(null, ys), y1 = Math.max.apply(null, ys);
        var lg = ctx.createLinearGradient(0, y0, 0, y1);
        lg.addColorStop(0, css(shade(top, mat, col)));
        lg.addColorStop(0.52, css(shade(n, mat, col)));
        lg.addColorStop(1, css(shade(bot, mat, col)));
        ctx.fillStyle = lg;
      } else {
        ctx.fillStyle = css(shade(n, mat, col));
      }

      if (f.m === 'glass') { ctx.globalAlpha = 0.94; ctx.fill(); ctx.globalAlpha = 1; }
      else ctx.fill();

      // Costura fina entre painéis: elimina serrilhado entre faces vizinhas.
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 0.7;
      ctx.stroke();
    }

    list.forEach(function (item) {
      paint(item.f, item.pp);
      (item.f.overlays || []).forEach(function (o) {
        paint(o, o.p.map(project));
      });
    });
  };

  Viewer.prototype.start = function () {
    if (this.running) return;
    this.running = true;
    var self = this, last = performance.now();
    (function loop(t) {
      if (!self.running) return;
      var dt = Math.min(48, t - last); last = t;
      if (!self.dragging) {
        if (Math.abs(self.vel) > 0.00002) {
          self.yaw += self.vel * dt;
          self.vel *= Math.pow(0.94, dt / 16);
        } else if (!self.reduced) {
          self.yaw += self.spin * (dt / 16);
        }
      }
      self.draw();
      self.raf = requestAnimationFrame(loop);
    })(last);
  };

  Viewer.prototype.stop = function () {
    this.running = false;
    if (this.raf) cancelAnimationFrame(this.raf);
  };

  Viewer.prototype._bindDrag = function () {
    var self = this, lastX = 0, lastT = 0;
    function down(e) {
      self.dragging = true;
      self.vel = 0;
      lastX = e.clientX;
      lastT = performance.now();
      self.canvas.setPointerCapture(e.pointerId);
      self.canvas.classList.add('is-grabbing');
    }
    function move(e) {
      if (!self.dragging) return;
      var now = performance.now();
      var dx = e.clientX - lastX;
      var d = dx * 0.0075;
      self.yaw += d;
      var dt = Math.max(1, now - lastT);
      self.vel = d / dt;
      lastX = e.clientX; lastT = now;
      if (!self.running) self.draw();
      e.preventDefault();
    }
    function up(e) {
      if (!self.dragging) return;
      self.dragging = false;
      self.canvas.classList.remove('is-grabbing');
      try { self.canvas.releasePointerCapture(e.pointerId); } catch (err) {}
    }
    this.canvas.addEventListener('pointerdown', down);
    this.canvas.addEventListener('pointermove', move);
    this.canvas.addEventListener('pointerup', up);
    this.canvas.addEventListener('pointercancel', up);
    this.canvas.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { self.yaw -= 0.18; self.draw(); e.preventDefault(); }
      if (e.key === 'ArrowRight') { self.yaw += 0.18; self.draw(); e.preventDefault(); }
    });
  };

  /* ------------------------------------------------------------- veículos */

  var SPECS = {
    sedan: {
      name: 'Sedan', L: 4.90, H: 1.45, W: 1.85, sill: 0.24, shoulder: 1.06, hip: 0.42,
      tumble: 0.24, archGap: 0.085, tireW: 0.23,
      wheels: [{ x: 1.06, r: 0.335 }, { x: 3.82, r: 0.335 }],
      upper: [
        [0.05, 0.60], [0.02, 0.86, 'lampR'], [0.11, 1.02], [0.55, 1.12], [1.16, 1.16, 'glass'],
        [1.98, 1.42], [2.58, 1.45], [3.06, 1.42, 'glass'], [3.94, 1.10], [4.26, 1.00],
        [4.72, 0.94, 'lampF'], [4.86, 0.78, 'grille'], [4.90, 0.58], [4.87, 0.42], [4.76, 0.32]
      ],
      dlo: [[1.36, 1.15], [1.99, 1.37], [2.96, 1.37], [3.74, 1.13]],
      pillar: [[[2.36, 1.14], [2.40, 1.375], [2.50, 1.375], [2.47, 1.14]]]
    },
    suv: {
      name: 'SUV', L: 4.83, H: 1.79, W: 1.94, sill: 0.34, shoulder: 1.28, hip: 0.55,
      tumble: 0.19, archGap: 0.09, tireW: 0.25,
      wheels: [{ x: 0.94, r: 0.375 }, { x: 3.74, r: 0.375 }],
      upper: [
        [0.07, 0.70], [0.03, 1.06, 'lampR'], [0.11, 1.32], [0.23, 1.62, 'glass'], [0.62, 1.76],
        [2.55, 1.79], [3.06, 1.76, 'glass'], [3.28, 1.70], [4.06, 1.28], [4.36, 1.22],
        [4.66, 1.17, 'lampF'], [4.80, 1.00, 'grille'], [4.83, 0.78], [4.80, 0.54], [4.70, 0.40]
      ],
      dlo: [[0.96, 1.34], [1.16, 1.60], [3.04, 1.62], [3.36, 1.33]],
      pillar: [[[1.95, 1.34], [1.99, 1.61], [2.10, 1.61], [2.07, 1.34]]]
    },
    minivan: {
      name: 'Minivan', L: 5.18, H: 1.78, W: 1.99, sill: 0.32, shoulder: 1.26, hip: 0.52,
      tumble: 0.17, archGap: 0.09, tireW: 0.24,
      wheels: [{ x: 1.02, r: 0.37 }, { x: 4.05, r: 0.37 }],
      upper: [
        [0.07, 0.62], [0.02, 1.00, 'lampR'], [0.09, 1.32], [0.21, 1.60, 'glass'], [0.58, 1.75],
        [2.70, 1.78], [3.36, 1.73, 'glass'], [3.58, 1.65], [4.38, 1.18], [4.64, 1.11],
        [5.02, 1.04, 'lampF'], [5.14, 0.86, 'grille'], [5.17, 0.62], [5.12, 0.44], [5.00, 0.34]
      ],
      dlo: [[0.96, 1.31], [1.12, 1.58], [3.28, 1.60], [3.56, 1.29]],
      pillar: [
        [[1.72, 1.31], [1.77, 1.585], [1.88, 1.585], [1.84, 1.31]],
        [[2.60, 1.31], [2.64, 1.595], [2.75, 1.595], [2.71, 1.31]]
      ]
    },
    fullsuv: {
      name: 'SUV grande', L: 5.33, H: 1.94, W: 2.03, sill: 0.40, shoulder: 1.44, hip: 0.62,
      tumble: 0.14, archGap: 0.095, tireW: 0.27,
      wheels: [{ x: 1.00, r: 0.40 }, { x: 4.06, r: 0.40 }],
      upper: [
        [0.06, 0.76], [0.02, 1.16, 'lampR'], [0.09, 1.46], [0.15, 1.72, 'glass'], [0.42, 1.90],
        [2.92, 1.94], [3.36, 1.92, 'glass'], [3.54, 1.86], [4.30, 1.40], [4.58, 1.35],
        [4.96, 1.30, 'lampF'], [5.20, 1.08, 'grille'], [5.30, 0.82], [5.28, 0.58], [5.14, 0.44]
      ],
      dlo: [[0.86, 1.49], [1.00, 1.78], [3.28, 1.80], [3.52, 1.45]],
      pillar: [
        [[1.78, 1.49], [1.83, 1.79], [1.95, 1.79], [1.91, 1.48]],
        [[2.72, 1.49], [2.76, 1.795], [2.88, 1.795], [2.84, 1.48]]
      ]
    }
  };

  root.Car3D = {
    Viewer: Viewer,
    SPECS: SPECS,
    create: function (canvas, specName, opts) {
      return new Viewer(canvas, SPECS[specName], opts);
    }
  };
})(window);
