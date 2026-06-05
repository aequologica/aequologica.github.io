const RATIO_MIN = 0.03;
const RATIO_MAX = 1.20;

const PALETTE = d3.interpolateRgbBasis(['#f3e8f7','#ddb8ea','#c285d8','#a354c2','#7b2d8b','#581f65','#361240']);
const normalize = r => (r - RATIO_MIN) / (RATIO_MAX - RATIO_MIN);
const color = r => PALETTE(Math.max(0, Math.min(1, normalize(r))));

const W = 900, H = 480;
const projection = d3.geoNaturalEarth1().scale(152).translate([W/2, H/2 + 10]);
const path = d3.geoPath(projection);
const svg = d3.select('#map');
const g = svg.append('g');
const tt = document.getElementById('tooltip');

const FLAG = 14;

// ── Dim-state indicator (fixed in SVG space, unaffected by zoom) ──────────────
const dimBadge     = svg.append('g').attr('cursor','pointer').style('display','none');
const dimBadgeRect = dimBadge.append('rect')
  .attr('y', 7).attr('height', 20).attr('rx', 10)
  .attr('fill', '#6b6b6b').attr('opacity', .82);
const dimBadgeFlag = dimBadge.append('image')
  .attr('y', 9).attr('width', 16).attr('height', 16);
const dimBadgeText = dimBadge.append('text')
  .attr('y', 21).attr('text-anchor', 'start')
  .attr('font-size', '10px')
  .attr('font-family', '-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif')
  .attr('fill', '#fff');
dimBadge.on('click', () => clearDim());

const CENTROID_OVERRIDE = {
  250: [2.5, 46.5],
  840: [-98, 38],
  826: [-2, 54],
};

const dotCentroid = d => {
  const ov = CENTROID_OVERRIDE[+d.id];
  return ov ? projection(ov) : path.centroid(d);
};

svg.on('click', () => { clearDim(); });

svg.call(d3.zoom()
  .scaleExtent([1, 12])
  .on('zoom', e => {
    g.attr('transform', e.transform);
    const s = FLAG / e.transform.k;
    g.selectAll('.flag-qualified')
      .attr('width', s)
      .attr('height', s)
      .attr('x', function() { return +this.getAttribute('data-cx') - s/2; })
      .attr('y', function() { return +this.getAttribute('data-cy') - s/2; });
  }));

g.append('path').datum({type:'Sphere'})
  .attr('d', path).attr('fill','#d8d0e8').attr('stroke','#b4a8cc').attr('stroke-width',.5);

g.append('path').datum(d3.geoGraticule()())
  .attr('d', path).attr('fill','none').attr('stroke','#ccc4dc').attr('stroke-width',.25);

// ── Flag CDN helper ───────────────────────────────────────────────────────────
const FLAG_CDN = code => `https://cdn.jsdelivr.net/npm/circle-flags@2/flags/${code}.svg`;

// ── Qualified-nation lookups ──────────────────────────────────────────────────
const QUALIFIED_NAMES = {
  12:'Algeria', 32:'Argentina', 36:'Australia', 40:'Austria',
  56:'Belgium', 70:'Bosnia and Herzegovina', 76:'Brazil', 124:'Canada',
  132:'Cape Verde', 170:'Colombia', 191:'Croatia', 203:'Czech Republic',
  180:'DR Congo', 218:'Ecuador', 250:'France', 276:'Germany',
  288:'Ghana', 332:'Haiti', 364:'Iran', 368:'Iraq', 384:'Ivory Coast',
  392:'Japan', 400:'Jordan', 484:'Mexico', 504:'Morocco', 528:'Netherlands',
  554:'New Zealand', 578:'Norway', 591:'Panama', 600:'Paraguay',
  620:'Portugal', 634:'Qatar', 682:'Saudi Arabia', 686:'Senegal',
  710:'South Africa', 410:'South Korea', 724:'Spain', 752:'Sweden',
  756:'Switzerland', 788:'Tunisia', 792:'Turkey',
  826:'England / Scotland', 840:'United States', 858:'Uruguay', 860:'Uzbekistan',
  531:'Curaçao'
};

const QUALIFIED_BY_NAME = Object.fromEntries(
  Object.entries(QUALIFIED_NAMES).map(([id, name]) => [name, +id])
);

const ISO2 = {
  12:'dz', 32:'ar', 36:'au', 40:'at', 56:'be', 70:'ba', 76:'br',
  124:'ca', 132:'cv', 170:'co', 191:'hr', 203:'cz', 180:'cd',
  218:'ec', 250:'fr', 276:'de', 288:'gh', 332:'ht', 364:'ir',
  368:'iq', 384:'ci', 392:'jp', 400:'jo', 484:'mx', 504:'ma',
  528:'nl', 554:'nz', 578:'no', 591:'pa', 600:'py', 620:'pt',
  634:'qa', 682:'sa', 686:'sn', 710:'za', 410:'kr', 724:'es',
  752:'se', 756:'ch', 788:'tn', 792:'tr', 826:'gb', 840:'us',
  858:'uy', 860:'uz',
  // birth countries not in qualified list
  120:'cm', 178:'cg', 208:'dk', 324:'gn', 372:'ie',
  380:'it', 398:'kz', 404:'ke', 566:'ng', 688:'rs', 705:'si',
  729:'sd', 834:'tz', 854:'bf', 818:'eg', 894:'zm',
  531:'cw'
};

// Small island nations — placed manually (unreliable centroid in 110m topojson)
const STANDALONE_FLAGS = [
  { id: 132, lon: -23.6, lat: 15.1 },  // Cape Verde
  { id: 531, lon: -69.0, lat: 12.2 },  // Curaçao
];
const STANDALONE_IDS = new Set(STANDALONE_FLAGS.map(f => f.id));

// ── Tooltip helpers ───────────────────────────────────────────────────────────
const positionTip = (event, height) => {
  let x = event.clientX + 16, y = event.clientY + 16;
  if (x + 270 > window.innerWidth)  x = event.clientX - 274;
  if (y + height > window.innerHeight) y = event.clientY - (height + 4);
  tt.style.left = x + 'px';
  tt.style.top  = y + 'px';
  tt.style.display = 'block';
};

const hideTip = () => { tt.style.display = 'none'; };

const showQualifiedTip = (event, name, code) => {
  const fi = code ? `<img class="tt-flag" src="${FLAG_CDN(code)}">` : '';
  tt.innerHTML = `<div class="tt-name">${fi}${name}</div>`;
  positionTip(event, 48);
};

// ── Dim helpers (click destination highlight) ─────────────────────────────────
let dimActive = false;
let dimDestIds = new Set();

const applyDim = (sourceId, destIds, country) => {
  dimActive = true;
  dimDestIds = destIds;
  g.selectAll('.flag-qualified').attr('opacity', function() {
    const id = +this.getAttribute('data-id');
    return id === sourceId || destIds.has(id) ? 1 : 0.15;
  });
  const fc = ISO2[sourceId];
  const badgeW = Math.round(country.length * 5.8 + 46); // 8 + flag16 + 6 + text + 10 + 6
  const bx = 895 - badgeW;
  dimBadgeRect.attr('x', bx).attr('width', badgeW);
  dimBadgeFlag.attr('href', fc ? FLAG_CDN(fc) : '').attr('x', bx + 8);
  dimBadgeText.attr('x', bx + 30).text(country);
  dimBadge.style('display', null);
};
const clearDim = () => {
  dimActive = false;
  dimDestIds = new Set();
  g.selectAll('.flag-qualified').attr('opacity', null);
  dimBadge.style('display', 'none');
};

// ── Flag join helpers ─────────────────────────────────────────────────────────
const placeFlag = (sel) => {
  sel.attr('class','flag-qualified')
    .attr('width', FLAG).attr('height', FLAG)
    .on('mouseleave', hideTip);
};

// ── Main render ───────────────────────────────────────────────────────────────
Promise.all([
  fetch('wc2026_map_data.json').then(r => r.json()),
  d3.json('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
]).then(([appData, world]) => {
  const DATA = appData.data;
  const POP  = appData.pop;
  const byId = {};
  DATA.forEach(d => {
    d.pop   = POP[d.country] || null;
    d.ratio = d.pop ? d.count / d.pop : null;
    byId[d.id] = d;
  });

  g.selectAll('.country')
    .data(topojson.feature(world, world.objects.countries).features)
    .join('path')
    .attr('class','country')
    .attr('d', path)
    .attr('fill', d => { const r = byId[+d.id]; return r && r.ratio !== null ? color(r.ratio) : '#e8e4e0'; })
    .attr('stroke','#ccc8c0').attr('stroke-width',.3)
    .on('mousemove', (event, d) => {
      if (dimActive) {
        const id = +d.id;
        if (QUALIFIED_NAMES[id] && dimDestIds.has(id)) showQualifiedTip(event, QUALIFIED_NAMES[id], ISO2[id]);
        else hideTip();
        return;
      }
      const rec = byId[+d.id];
      if (!rec) { hideTip(); return; }
      const _r2 = rec.ratio !== null ? rec.ratio.toFixed(2) : '?';
      const ratio = _r2 === '0.00' ? rec.ratio.toPrecision(2) : _r2;
      const popStr = rec.pop ? (rec.pop >= 10 ? Math.round(rec.pop) + 'M' : rec.pop.toFixed(1) + 'M') : '?';
      const fc = ISO2[rec.id];
      const dimmed = fc && !QUALIFIED_NAMES[rec.id] ? ' style="opacity:0.35;filter:grayscale(50%)"' : '';
      const fi = fc ? `<img class="tt-flag"${dimmed} src="${FLAG_CDN(fc)}">` : '';
      let html = `<div class="tt-name">${fi}${rec.country}</div>`;
      html += `<div class="tt-count">${ratio}</div>`;
      html += `<div class="tt-label">joueur${rec.count>1?'s':''} exporté${rec.count>1?'s':''} / million d'hab.</div>`;
      html += `<div class="tt-sub">${rec.count} joueur${rec.count>1?'s':''} · pop. ${popStr}</div>`;
      html += `<div class="tt-nations">Sélections : ${rec.nations.map(([n,c]) => `${n} (${c})`).join(', ')}</div>`;
      rec.top.forEach(p => {
        html += `<div class="tt-player"><span>${p.name}</span><span class="tt-nation">→ ${p.nation}</span></div>`;
      });
      tt.innerHTML = html;
      positionTip(event, 240);
    })
    .on('mouseleave', hideTip)
    .on('click', (event, d) => {
      event.stopPropagation();
      if (dimActive) { clearDim(); return; }
      const rec = byId[+d.id];
      if (!rec) return;
      hideTip();
      const destIds = new Set(
        rec.nations.map(([n]) => QUALIFIED_BY_NAME[n]).filter(id => id !== undefined)
      );
      applyDim(+d.id, destIds, rec.country);
    });

  g.append('path')
    .datum(topojson.mesh(world, world.objects.countries, (a,b) => a!==b))
    .attr('fill','none').attr('stroke','#b8b0a8').attr('stroke-width',.3).attr('d', path);

  g.selectAll('.flag-qualified')
    .data(topojson.feature(world, world.objects.countries).features
      .filter(d => QUALIFIED_NAMES[+d.id] && !STANDALONE_IDS.has(+d.id)))
    .join('image')
    .call(placeFlag)
    .attr('href', d => FLAG_CDN(ISO2[+d.id]))
    .attr('data-cx', d => dotCentroid(d)[0])
    .attr('data-cy', d => dotCentroid(d)[1])
    .attr('x', d => dotCentroid(d)[0] - FLAG/2)
    .attr('y', d => dotCentroid(d)[1] - FLAG/2)
    .attr('data-id', d => +d.id)
    .attr('pointer-events', d => byId[+d.id] ? 'none' : 'all')
    .on('mousemove', (event, d) => showQualifiedTip(event, QUALIFIED_NAMES[+d.id], ISO2[+d.id]));

  STANDALONE_FLAGS.forEach(({ id, lon, lat }) => {
    const [cx, cy] = projection([lon, lat]);
    g.append('image')
      .call(placeFlag)
      .attr('href', FLAG_CDN(ISO2[id]))
      .attr('data-id', id)
      .attr('data-cx', cx).attr('data-cy', cy)
      .attr('x', cx - FLAG/2).attr('y', cy - FLAG/2)
      .attr('pointer-events', 'all')
      .on('mousemove', (event) => showQualifiedTip(event, QUALIFIED_NAMES[id], ISO2[id]));
  });
});

// ── Legend gradient ───────────────────────────────────────────────────────────
const bar = document.getElementById('legend-bar');
const stops = Array.from({length: 60}, (_, i) => {
  const v = RATIO_MIN + (i / 59) * (RATIO_MAX - RATIO_MIN);
  return color(v);
});
bar.style.background = `linear-gradient(to right, ${stops.join(',')})`;
bar.style.borderRadius = '5px';
