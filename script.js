(function () {
  const cfg = window.WATTGOBLIN_CONFIG || {};
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());
  document.querySelectorAll('[data-wallet-address]').forEach(el => el.textContent = cfg.creatorFeeWallet || 'Not configured');
  document.querySelectorAll('[data-wallet-explorer]').forEach(el => {
    if (cfg.creatorFeeWalletExplorer) el.href = cfg.creatorFeeWalletExplorer;
  });
  document.querySelectorAll('[data-wallet-label]').forEach(el => el.textContent = cfg.creatorFeeWalletLabel || 'Official Developer Fee Wallet');

  const menu = document.querySelector('.nav-links');
  const menuBtn = document.querySelector('.menu-btn');
  if (menu && menuBtn) {
    menuBtn.addEventListener('click', () => {
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
  }

  document.querySelectorAll('[data-copy-wallet]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const status = btn.parentElement.parentElement.querySelector('.copy-status');
      try {
        await navigator.clipboard.writeText(cfg.creatorFeeWallet);
        if (status) status.textContent = 'Wallet address copied.';
      } catch (e) {
        if (status) status.textContent = 'Copy failed — select the address manually.';
      }
    });
  });
})();
