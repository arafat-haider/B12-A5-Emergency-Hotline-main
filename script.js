document.addEventListener('DOMContentLoaded', () => {
  // -------- Navbar badges (HTML না বদলে সরাসরি class ধরছি) --------
  const heartBadge = document.querySelector('.badge-heart');
  const coinBadge  = document.querySelector('.badge-coin');
  const copyBadge  = document.querySelector('.badge-copy');

  // Spec অনুযায়ী ডিফল্ট মান (HTML-এ যা লেখা থাকুক, আমরা সেটাই overwrite করব)
  let hearts = 0;
  let coins  = 100;
  let copies = 0;

  const updateBadges = () => {
    if (heartBadge) heartBadge.textContent = `${hearts} ❤️`;
    if (coinBadge)  coinBadge.textContent  = `${coins} 🪙`;
    if (copyBadge)  copyBadge.textContent  = `${copies} Copy`;
  };
  updateBadges();

  // -------- History section --------
  const historyAside = document.querySelector('aside.history');
  const historyList  = historyAside ? historyAside.querySelector('ul') : null;
  const clearBtn     = historyAside ? historyAside.querySelector('button') : null;

  // Requirement: শুরুতে history খালি
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

  // -------- 💗 আইকনকে "বামে" আনা (HTML না বদলে flex order) --------
  // আপনার কার্ড header: <div class="flex ..."> [icon-wrap][heart]
  // heart-এ order:-1 দিলে এটা বামে চলে যাবে
  document.querySelectorAll('article.card .heart').forEach(h => {
    h.style.order = -1;
    h.style.marginRight = '8px'; // একটু স্পেস
  });

  // -------- Clipboard helper (fallback সহ) --------
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

  // -------- Dial helper (মোবাইলে tel: ওপেন) --------
  const dialNumber = (raw) => {
    const href = `tel:${String(raw).replace(/\s+/g, '')}`;
    const a = document.createElement('a');
    a.href = href;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  // -------- প্রয়োজনীয় ডাটা পার্সার (HTML থেকে name/number তুলি) --------
  // আপনার HTML কার্ড স্ট্রাকচার থেকে আমরা শিরোনাম ও নাম্বার নিই
  const getCardInfo = (card) => {
    if (!card) return { nameBn: 'Service', number: '' };
    const nameEl   = card.querySelector('h3');
    const numberEl = card.querySelector('div.mt-2'); // নম্বরের div
    const nameBn   = nameEl ? nameEl.textContent.trim() : 'Service';
    const number   = numberEl ? numberEl.textContent.trim() : '';
    return { nameBn, number };
  };

  // -------- Event Delegation: সব বাটন/হার্ট এক লিসেনারে --------
  document.body.addEventListener('click', async (e) => {
    const heartSpan = e.target.closest('span.heart');
    const btn       = e.target.closest('button');
    const card      = (heartSpan || btn) ? (heartSpan || btn).closest('article.card') : null;

    // 💗 Heart
    if (heartSpan && card) {
      hearts += 1;
      updateBadges();
      heartSpan.textContent = '❤️'; // ভিজ্যুয়াল ফিডব্যাক
      return;
    }

    if (!btn) return;

    // 📋 Copy
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

    // 📞 Call
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
      dialNumber(number); // মোবাইলে ডায়ালার খুলবে
      return;
    }
  });
});
