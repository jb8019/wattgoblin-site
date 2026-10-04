(function () {
  const cfg = (window.WATTGOBLIN_CONFIG && window.WATTGOBLIN_CONFIG.mining) || {};
  const workerApi = cfg.workerApi || "https://pool.kryptex.com/qtc/api/v3/miner/workers/krxYR9ZGWQ";
  const balanceApi = cfg.balanceApi || "https://pool.kryptex.com/qtc/api/v1/miner/balance/krxYR9ZGWQ";
  const payoutsApi = cfg.payoutsApi || "https://pool.kryptex.com/qtc/api/v1/miner/payouts/krxYR9ZGWQ";
  const btcAddress = cfg.btcTreasury || "bc1qhvd4zpzpu6hrvkxyl0kh4hndlxwssxq0h5w8f0";
  const btcApi = "https://mempool.space/api/address/" + encodeURIComponent(btcAddress);
  const refreshMs = Math.max(30000, Number(cfg.refreshMs) || 60000);
  let timer = null;

  const $ = (id) => document.getElementById(id);
  if (!$('dashboard-status')) return;

  function path(obj, p) {
    return p.split('.').reduce((v, k) => (v && Object.prototype.hasOwnProperty.call(v, k) ? v[k] : undefined), obj);
  }
  function first(obj, keys) {
    for (const k of keys) {
      const v = k.includes('.') ? path(obj, k) : obj && obj[k];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }
  function num(v) {
    if (typeof v === 'number' && Number.isFinite(v)) return v;
    if (typeof v === 'string') {
      const n = Number(v.replace(/,/g, '').trim());
      if (Number.isFinite(n)) return n;
    }
    return 0;
  }
  function nfirst(obj, keys) { return num(first(obj, keys)); }
  function textfirst(obj, keys, fallback) {
    const v = first(obj, keys);
    if (v === undefined || v === null || v === '') return fallback || '—';
    return String(v);
  }
  function sum(arr, getter) { return arr.reduce((a, x) => a + (getter(x) || 0), 0); }
  function compactNumber(v) {
    if (!Number.isFinite(v)) return '—';
    return new Intl.NumberFormat(undefined, { maximumFractionDigits: 2 }).format(v);
  }
  function formatHashrate(v) {
    v = Number(v);
    if (!Number.isFinite(v) || v < 0) return '—';
    const units = ['H/s','kH/s','MH/s','GH/s','TH/s','PH/s'];
    let i = 0;
    while (v >= 1000 && i < units.length - 1) { v /= 1000; i++; }
    const digits = v >= 100 ? 0 : v >= 10 ? 1 : 2;
    return v.toFixed(digits) + ' ' + units[i];
  }
  function flattenArrays(value, out) {
    out = out || [];
    if (Array.isArray(value)) {
      if (value.length && value.every(x => x && typeof x === 'object' && !Array.isArray(x))) out.push(value);
      value.forEach(x => flattenArrays(x, out));
    } else if (value && typeof value === 'object') {
      Object.values(value).forEach(x => flattenArrays(x, out));
    }
    return out;
  }
  function looksLikeWorker(x) {
    if (!x || typeof x !== 'object') return false;
    return ['worker','name','worker_name','rig','hashrate','hashrate_30m','hashrate_3h','hashrate_24h','online','status'].some(k => Object.prototype.hasOwnProperty.call(x, k));
  }
  function extractWorkers(json) {
    if (Array.isArray(json) && json.some(looksLikeWorker)) return json;
    const direct = first(json, ['workers','data.workers','result.workers','data','result']);
    if (Array.isArray(direct) && direct.some(looksLikeWorker)) return direct;
    const candidates = flattenArrays(json).filter(a => a.some(looksLikeWorker));
    candidates.sort((a,b) => b.length - a.length);
    return candidates[0] || [];
  }
  function workerName(w, i) {
    let s = textfirst(w, ['worker','name','worker_name','rig','id'], 'WORKER-' + String(i + 1).padStart(2,'0'));
    s = s.replace(/^krxYR9ZGWQ[.\/:-]?/i, '');
    return s || ('WORKER-' + (i + 1));
  }
  function workerOnline(w) {
    const raw = first(w, ['online','is_online','active','isActive','status']);
    if (typeof raw === 'boolean') return raw;
    if (typeof raw === 'number') return raw > 0;
    if (typeof raw === 'string') return !/offline|inactive|dead|false|0/i.test(raw);
    return nfirst(w, ['hashrate_30m','hashrate30m','hashrate.30m','hashrate_30','hashrate']) > 0;
  }
  function workerHash(w, windowKey) {
    const keys = windowKey === '30m'
      ? ['hashrate_30m','hashrate30m','hashrate_30','hashrate.30m','hashrate.avg30m','hashrate.current','hashrate']
      : windowKey === '3h'
      ? ['hashrate_3h','hashrate3h','hashrate_180m','hashrate.3h','hashrate.avg3h']
      : ['hashrate_24h','hashrate24h','hashrate_1d','hashrate.24h','hashrate.avg24h'];
    return nfirst(w, keys);
  }
  function workerValid(w) { return nfirst(w, ['valid_shares','shares_valid','shares.valid','valid','accepted_shares','accepted']); }
  function workerStale(w) { return nfirst(w, ['stale_shares','shares_stale','shares.stale','stale']); }
  function workerInvalid(w) { return nfirst(w, ['invalid_shares','shares_invalid','shares.invalid','invalid','rejected_shares','rejected']); }
  function uniqueValues(workers, keys) {
    return [...new Set(workers.map(w => textfirst(w, keys, '')).filter(Boolean))];
  }
  async function getJSON(url) {
    const ctrl = new AbortController();
    const timeout = setTimeout(() => ctrl.abort(), 10000);
    try {
      const r = await fetch(url, { cache: 'no-store', signal: ctrl.signal, headers: { 'Accept': 'application/json' } });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return await r.json();
    } finally { clearTimeout(timeout); }
  }
  function setStatus(ok, message) {
    $('dashboard-status').textContent = message;
    $('mining-status-dot').classList.toggle('offline-dot', !ok);
  }
  function setBars(values) {
    const max = Math.max(...values, 1);
    [['bar-30m', values[0]], ['bar-3h', values[1]], ['bar-24h', values[2]]].forEach(([id,v]) => {
      $(id).style.width = Math.max(3, Math.min(100, (v / max) * 100)) + '%';
    });
    $('bar-label-30m').textContent = formatHashrate(values[0]);
    $('bar-label-3h').textContent = formatHashrate(values[1]);
    $('bar-label-24h').textContent = formatHashrate(values[2]);
  }
  function renderWorkers(workers) {
    const normalized = workers.map((w,i) => ({
      raw:w, name:workerName(w,i), online:workerOnline(w), h30:workerHash(w,'30m'), h3:workerHash(w,'3h'), h24:workerHash(w,'24h'),
      valid:workerValid(w), stale:workerStale(w), invalid:workerInvalid(w)
    })).sort((a,b) => (b.online-a.online) || (b.h30-a.h30) || a.name.localeCompare(b.name));

    const active = normalized.filter(w => w.online).length;
    const h30 = sum(normalized, w => w.h30), h3 = sum(normalized, w => w.h3), h24 = sum(normalized, w => w.h24);
    const valid = sum(normalized, w => w.valid), bad = sum(normalized, w => w.stale + w.invalid);
    $('hashrate-30m').textContent = formatHashrate(h30);
    $('hashrate-3h').textContent = formatHashrate(h3);
    $('hashrate-24h').textContent = formatHashrate(h24);
    $('active-workers').textContent = compactNumber(active);
    $('worker-total-note').textContent = 'of ' + compactNumber(normalized.length) + ' reported';
    $('valid-shares').textContent = compactNumber(valid);
    $('bad-shares').textContent = compactNumber(bad);
    setBars([h30,h3,h24]);

    const software = uniqueValues(workers, ['miner','software','miner_name','client','user_agent']).slice(0,3);
    const regions = uniqueValues(workers, ['region','server_region','server','location','pool']).slice(0,3);
    $('miner-software').textContent = software.length ? software.join(' · ') : 'Not reported';
    $('miner-region').textContent = regions.length ? regions.join(' · ') : 'Not reported';

    const tbody = $('worker-table-body');
    if (!normalized.length) {
      tbody.innerHTML = '<tr><td colspan="7" class="table-loading">No workers were returned by the public API.</td></tr>';
      return;
    }
    tbody.innerHTML = normalized.slice(0,25).map((w,i) =>
      '<tr>' +
      '<td>' + (i+1) + '</td>' +
      '<td><strong>' + escapeHtml(w.name) + '</strong></td>' +
      '<td><span class="worker-state ' + (w.online ? 'online' : 'offline') + '">' + (w.online ? 'ONLINE' : 'OFFLINE') + '</span></td>' +
      '<td>' + formatHashrate(w.h30) + '</td>' +
      '<td>' + formatHashrate(w.h3) + '</td>' +
      '<td>' + formatHashrate(w.h24) + '</td>' +
      '<td>' + compactNumber(w.valid) + '</td>' +
      '</tr>'
    ).join('');
  }
  function escapeHtml(s) {
    return String(s).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }
  function findBalance(json) {
    if (typeof json === 'number') return json;
    return nfirst(json, ['balance','unpaid','pending','amount','data.balance','result.balance','qtc','data.qtc']);
  }
  function payoutArray(json) {
    if (Array.isArray(json)) return json;
    const p = first(json, ['payouts','data.payouts','result.payouts','data','result']);
    return Array.isArray(p) ? p : [];
  }
  function renderLedger() {
    const ledger = Array.isArray(cfg.ledger) ? cfg.ledger : [];
    const target = $('mining-ledger');
    if (!ledger.length) {
      target.innerHTML = '<article class="ledger-empty"><span>NO COMPLETED COMMUNITY MINING BUYBACK / BURN RECORDED YET</span><p>This ledger will be populated only after a transaction is completed and can be independently verified. Live mining activity is not itself recorded as a buyback or burn.</p></article>';
      return;
    }
    target.innerHTML = ledger.map(item => '<article class="ledger-entry"><time>' + escapeHtml(item.date || 'DATE') + '</time><div><strong>' + escapeHtml(item.type || 'ACTION') + '</strong><p>' + escapeHtml(item.note || '') + '</p>' + (item.url ? '<a class="text-link" target="_blank" rel="noopener" href="' + escapeHtml(item.url) + '">VERIFY TRANSACTION ↗</a>' : '') + '</div></article>').join('');
  }
  async function refresh() {
    setStatus(true, 'REFRESHING…');
    $('refresh-mining').disabled = true;
    let workersOk = false;
    const tasks = [
      getJSON(workerApi).then(j => { renderWorkers(extractWorkers(j)); workersOk = true; }),
      getJSON(balanceApi).then(j => { const b = findBalance(j); $('pool-balance').textContent = b ? compactNumber(b) + ' QTC' : '0 / not reported'; }).catch(() => { $('pool-balance').textContent = 'Unavailable'; }),
      getJSON(payoutsApi).then(j => { $('payout-count').textContent = compactNumber(payoutArray(j).length); }).catch(() => { $('payout-count').textContent = 'Unavailable'; }),
      getJSON(btcApi).then(j => {
        const c=j.chain_stats||{}, m=j.mempool_stats||{};
        const sats=(num(c.funded_txo_sum)-num(c.spent_txo_sum))+(num(m.funded_txo_sum)-num(m.spent_txo_sum));
        $('btc-treasury-balance').textContent=(sats/1e8).toFixed(8)+' BTC';
        $('btc-tx-count').textContent=compactNumber(num(c.tx_count)+num(m.tx_count));
      }).catch(() => { $('btc-treasury-balance').textContent='Explorer unavailable'; $('btc-tx-count').textContent='—'; })
    ];
    const settled = await Promise.allSettled(tasks);
    const when = new Date();
    $('last-refresh').textContent = 'Last refresh: ' + when.toLocaleTimeString([], {hour:'numeric', minute:'2-digit', second:'2-digit'});
    if (workersOk) {
      setStatus(true, 'LIVE');
      $('api-note').textContent = 'Live worker telemetry connected to Kryptex public API. Balance/payout and Bitcoin explorer data are separate requests and may occasionally refresh independently.';
    } else {
      setStatus(false, 'API TEMPORARILY UNAVAILABLE');
      $('api-note').textContent = 'The site could not reach the public worker endpoint on this refresh. Mining can still continue; this dashboard will retry automatically.';
      if (!$('worker-table-body').querySelector('tr:not(.table-loading)')) $('worker-table-body').innerHTML='<tr><td colspan="7" class="table-loading">Live worker API unavailable. Automatic retry scheduled.</td></tr>';
    }
    $('refresh-mining').disabled = false;
    return settled;
  }

  $('refresh-mining').addEventListener('click', () => refresh());
  $('copy-command').addEventListener('click', async () => {
    const btn=$('copy-command'), cmd=$('mining-command').textContent.trim();
    try { await navigator.clipboard.writeText(cmd); btn.textContent='COPIED'; }
    catch (_) { btn.textContent='SELECT + COPY'; window.getSelection()?.selectAllChildren($('mining-command')); }
    setTimeout(() => { btn.textContent='COPY COMMAND'; }, 1800);
  });
  renderLedger();
  refresh();
  timer = setInterval(refresh, refreshMs);
  window.addEventListener('pagehide', () => { if (timer) clearInterval(timer); }, { once:true });
})();
