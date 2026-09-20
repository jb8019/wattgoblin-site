(function(){
  const cfg=window.WATTGOBLIN_CONFIG||{};
  const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
  $$('[data-year]').forEach(e=>e.textContent=new Date().getFullYear());
  $$('[data-wallet-address]').forEach(e=>e.textContent=cfg.creatorFeeWallet||'Not configured');
  $$('[data-wallet-label]').forEach(e=>e.textContent=cfg.creatorFeeWalletLabel||'Official Developer Fee Wallet');
  $$('[data-wallet-explorer]').forEach(e=>{if(cfg.creatorFeeWalletExplorer)e.href=cfg.creatorFeeWalletExplorer});

  const page=(location.pathname.split('/').pop()||'index.html').toLowerCase();
  $$('.nav-links a').forEach(a=>{if((a.getAttribute('href')||'').toLowerCase()===page)a.classList.add('active')});
  const menu=$('.nav-links'), btn=$('.menu-btn'); if(menu&&btn)btn.addEventListener('click',()=>{const o=menu.classList.toggle('open');btn.setAttribute('aria-expanded',String(o))});

  $$('[data-copy-wallet]').forEach(b=>b.addEventListener('click',async()=>{const card=b.closest('.wallet-card')||document;const s=$('.copy-status',card);try{await navigator.clipboard.writeText(cfg.creatorFeeWallet);if(s)s.textContent='SOL address copied.'}catch(e){if(s)s.textContent='Copy failed — select the address manually.'}}));

  // Countdown console. It stays in LOCKING IN mode until config.js has an official launchDate.
  const targetEls={d:$('[data-cd-days]'),h:$('[data-cd-hours]'),m:$('[data-cd-mins]'),s:$('[data-cd-secs]')};
  const cStatus=$('[data-launch-status]'), target=$('[data-launch-target]'), sysclock=$('[data-system-clock]');
  function pad(n){return String(n).padStart(2,'0')}
  function tick(){
    const now=new Date(); if(sysclock)sysclock.textContent=now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'});
    if(!cfg.launchDate){if(cStatus)cStatus.textContent=cfg.launchStatus||'LAUNCH TIME LOCKING IN';if(target)target.textContent='TARGET: PENDING';return}
    const t=new Date(cfg.launchDate), diff=t-now;
    if(target)target.textContent='TARGET: '+t.toLocaleString();
    if(diff<=0){Object.values(targetEls).forEach(e=>{if(e)e.textContent='00'});if(cStatus)cStatus.textContent='LAUNCH WINDOW REACHED';return}
    const total=Math.floor(diff/1000), days=Math.floor(total/86400), hrs=Math.floor((total%86400)/3600), mins=Math.floor((total%3600)/60), secs=total%60;
    if(targetEls.d)targetEls.d.textContent=String(days).padStart(2,'0'); if(targetEls.h)targetEls.h.textContent=pad(hrs); if(targetEls.m)targetEls.m.textContent=pad(mins); if(targetEls.s)targetEls.s.textContent=pad(secs);
    if(cStatus)cStatus.textContent='COUNTDOWN ACTIVE';
  } tick(); setInterval(tick,1000);

  // Dynamic site-status feed. This is a site feed, not an external blockchain/price feed.
  const feed=$('[data-live-feed]');
  if(feed){let i=0; const rows=[]; const add=()=>{const list=cfg.liveFeed||[]; if(!list.length)return; const item=list[i%list.length];i++;const row=document.createElement('div');row.className='feed-row';const now=new Date();row.innerHTML=`<span class="feed-time">${now.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit',second:'2-digit'})}</span><span class="feed-level">${item.level}</span><span class="feed-text">${item.text}</span>`;feed.prepend(row);rows.push(row);while(feed.children.length>8)feed.lastElementChild.remove()};for(let n=0;n<6;n++)setTimeout(add,n*110);setInterval(add,4200)}

  const io=('IntersectionObserver'in window)?new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.08}):null;
  $$('.reveal').forEach(e=>io?io.observe(e):e.classList.add('visible'));
})();
