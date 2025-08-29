document.addEventListener('DOMContentLoaded', () => {
  // ---------- Navbar badges (HTML বদলাবো না, তাই class দিয়েই ধরি) ----------
  const heartBadge = document.querySelector('.badge-heart');
  const coinBadge  = document.querySelector('.badge-coin');
  const copyBadge  = document.querySelector('.badge-copy');

  // সংখ্যাগুলো বর্তমান টেক্সট থেকে initialize (যেমন "100 🪙")
  const parseLeadingInt = (el, fallback) => {
    if (!el) return fallback;
    const m = el.textContent.trim().match(/\d+/);
    return m ? parseInt(m[0], 10) : fallback;
  };

  let hearts = parseLeadingInt(heartBadge, 0);
  let coins  = parseLeadingInt(coinBadge,  100);
  let copies = parseLeadingInt(copyBadge,  0);

  const updateBadges = () => {
    if (heartBadge) heartBadge.textContent = `${hearts} ❤️`;
    if (coinBadge)  coinBadge.textContent  = `${coins} 🪙`;
    if (copyBadge)  copyBadge.textContent  = `${copies} Copy`;
  };
  updateBadges();

  // ---------- History সেকশন ----------
  const historyAside = document.querySelector('aside.history');
  const historyList  = historyAside ? historyAside.querySelector('ul') : null;
  const clearBtn     = historyAside ? historyAside.querySelector('button') : null;

  // Requirement অনুযায়ী history শুরুতে খালি
  if (historyList) historyList.innerHTML = '';

  const timeNow = () =>
    new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const addHistory = (name, number) => {
    if (!historyList) return;
    const li = document.createElement('li');
    li.className = 'py-2 flex items-center justify-between';
    li.innerHTML = `<span>${name} - ${number}</span><span class="text-[13px] text-[#6B7280]">${timeNow()}</span>`;
    historyList.prepend(li);
  };

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (historyList) historyList.innerHTML = '';
    });
  }

  // ---------- Clipboard helper (fallback সহ) ----------
  const copyToClipboard = async (text) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.focus(); ta.select();
      const ok = document.execCommand('copy');
      document.body.removeChild(ta);
      return ok;
    } catch {
      return false;
    }
  };

  // ---------- Dial helper (মোবাইলে tel: ওপেন) ----------
  const dialNumber = (raw) => {
    const href = `tel:${String(raw).replace(/\s+/g, '')}`;
    const a = document.createElement('a');
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // ---------- Event Delegation (সমস্ত কার্ড/বাটনের জন্য) ----------
  document.body.addEventListener('click', async (e) => {
    // যেকোনো বাটন বা হার্ট span ধরব
    const btn = e.target.closest('button');
    const heartSpan = e.target.closest('span.heart');

    // কার্ড কনটেক্সট বের করি
    const card = (btn || heartSpan) ? (btn || heartSpan).closest('article.card') : null;

    // ------- HEART (span.heart) -------
    if (heartSpan && card) {
      hearts += 1;
      updateBadges();
      // ভিজ্যুয়াল ইঙ্গিত
      heartSpan.textContent = '❤️';
      return;
    }

    if (!btn) return;

    // কার্ডের ভেতর থেকে name/number/category DOM থেকে বের করি (HTML না বদলেই)
    const getCardInfo = (root) => {
      if (!root) return { nameBn: 'Service', number: '' };
      const nameEl   = root.querySelector('h3');
      const numberEl = root.querySelector('div.mt-2');
      const nameBn   = nameEl ? nameEl.textContent.trim() : 'Service';
      const number   = numberEl ? numberEl.textContent.trim() : '';
      return { nameBn, number };
    };

    // ------- COPY -------
    if (btn.classList.contains('copy-btn')) {
      const { nameBn, number } = getCardInfo(card);
      const ok = await copyToClipboard(number);
      if (ok) {
        copies += 1;
        updateBadges();
        alert(`Copied: ${nameBn} (${number})`);
      } else {
        alert('Copy failed. Try manually.');
      }
      return;
    }

    // ------- CALL -------
    if (btn.classList.contains('call-btn')) {
      const { nameBn, number } = getCardInfo(card);

      if (coins < 20) {
        alert('Not enough coins to make a call (need 20).');
        return;
      }

      alert(`Calling ${nameBn} (${number})`);
      coins -= 20;
      updateBadges();
      addHistory(nameBn, number);
      dialNumber(number);
      return;
    }
  });
});
