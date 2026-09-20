
(function () {
  const cfg = window.WATTGOBLIN_CONFIG || {};
  const targetString = cfg.launchISO;
  const ids = ["days","hours","minutes","seconds"];
  const dateText = document.getElementById("launch-date-text");
  if (!document.getElementById("countdown")) return;

  if (!targetString) {
    if (dateText) dateText.textContent = "LAUNCH TIME LOCKING IN";
    return;
  }

  const target = new Date(targetString).getTime();
  if (!Number.isFinite(target)) {
    if (dateText) dateText.textContent = "LAUNCH TIME TBA";
    return;
  }

  const fmt = new Intl.DateTimeFormat(undefined, {
    weekday: "short", year: "numeric", month: "short", day: "numeric",
    hour: "numeric", minute: "2-digit", timeZoneName: "short"
  });
  if (dateText) dateText.textContent = "TARGET // " + fmt.format(new Date(target));

  function tick() {
    let diff = target - Date.now();
    if (diff <= 0) {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = "00";
      });
      if (dateText) dateText.textContent = "$WGBL LAUNCH WINDOW IS LIVE";
      return;
    }

    const d = Math.floor(diff / 86400000); diff %= 86400000;
    const h = Math.floor(diff / 3600000); diff %= 3600000;
    const m = Math.floor(diff / 60000); diff %= 60000;
    const s = Math.floor(diff / 1000);

    const vals = { days:d, hours:h, minutes:m, seconds:s };
    for (const [id, val] of Object.entries(vals)) {
      const el = document.getElementById(id);
      if (el) el.textContent = String(val).padStart(2,"0");
    }
    setTimeout(tick, 1000);
  }
  tick();
})();
