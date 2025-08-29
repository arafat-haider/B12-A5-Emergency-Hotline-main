document.addEventListener('DOMContentLoaded', () => {
  const cardSection = document.getElementById('cardSection');
  const historyList = document.getElementById('historyList');

  if (!cardSection) {
    console.error('cardSection container not found. Did you set id="cardSection" in HTML?');
    return; // এখানে থামাই, যাতে appendChild error না দেয়
  }
  if (!historyList) {
    console.error('historyList container not found. Did you set id="historyList" in HTML?');
  }

  const services = [
    { nameBn:"জাতীয় জরুরি সেবা", nameEn:"National Emergency", number:"999", category:"সার্বজনীন" },
    // ... বাকি ডাটাগুলো
  ];

  services.forEach(svc => {
    const card = document.createElement('article');
    card.className = 'card p-4';
    card.innerHTML = `
      <div class="flex items-start justify-between">
        <div class="icon-wrap">🚨</div>
        <button class="heart-btn heart" type="button">♡</button>
      </div>
      <h3 class="mt-3 text-[18px] font-extrabold">${svc.nameBn}</h3>
      <p class="text-[13px] text-[#6B7280]">${svc.nameEn}</p>
      <div class="mt-2 text-[28px] font-extrabold">${svc.number}</div>
      <div class="mt-1"><span class="pill">${svc.category}</span></div>
      <div class="mt-4 grid grid-cols-2 gap-3">
        <button class="copy-btn flex items-center justify-center gap-2" type="button"
                data-name="${svc.nameBn}" data-number="${svc.number}">
          <i class="fa-solid fa-copy"></i> Copy
        </button>
        <button class="call-btn flex items-center justify-center gap-2" type="button"
                data-name="${svc.nameBn}" data-number="${svc.number}">
          <i class="fa-solid fa-phone"></i> Call
        </button>
      </div>
    `;
    cardSection.appendChild(card); // <- cardSection থাকলেই এখন কাজ করবে
  });

  // নিচে আগের মতো event delegation / history add ইত্যাদি…
});
