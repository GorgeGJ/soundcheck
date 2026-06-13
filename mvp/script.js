
// ===============================
// Google Sheets connection
// ===============================
// 1) Create a Google Apps Script Web App using the README instructions.
// 2) Paste your deployed Web App URL below.
// Example: const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw92G3qSO6MUeydK3Hyp1LeZrMogug3HUqBqAi-_etC7DvpMmhwGUI5BXjpn0S63rsu/exec";
const GOOGLE_SHEETS_WEB_APP_URL = "https://script.google.com/macros/s/AKfycbw92G3qSO6MUeydK3Hyp1LeZrMogug3HUqBqAi-_etC7DvpMmhwGUI5BXjpn0S63rsu/exec";

async function submitToGoogleSheets(payload) {
  if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('PASTE_YOUR')) {
    console.warn('Google Sheets Web App URL is not configured yet.', payload);
    throw new Error('Google Sheets URL not configured');
  }

  // Google Apps Script Web Apps work best from static sites using no-cors.
  // The request will be opaque in the browser, so success means "request sent".
  await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8'
    },
    body: JSON.stringify(payload)
  });
}

const venues = [
  { name: "Alphaville", area: "Brooklyn", neighborhood: "Bushwick", genres: "indie / punk / experimental", score: 82, pay: "Mixed", sound: 8.4, booker: 8.1, loadin: "Medium", audience: 8.0, reviews: 18, wouldPlayAgain: 84, capacity: 150, age: "21+", website: "alphavillenyc.com", instagram: "@alphavillebk", note: "Good room energy. Weekends stronger than weekdays.", pros: ["Strong local scene", "Good fit for punk / indie bills", "Room has personality"], cons: ["Weeknight turnout can vary", "Pay terms should be clarified upfront"] },
  { name: "Baby's All Right", area: "Williamsburg", neighborhood: "Williamsburg", genres: "indie / alternative / touring", score: 88, pay: "Reliable", sound: 8.8, booker: 8.5, loadin: "Medium", audience: 8.7, reviews: 24, wouldPlayAgain: 91, capacity: 280, age: "Usually 21+", website: "babysallright.com", instagram: "@babysallright", note: "Strong production and audience fit for indie artists.", pros: ["Strong production", "Good audience discovery", "Recognizable venue name"], cons: ["Competitive booking", "Confirm promo expectations"] },
  { name: "The Broadway", area: "Bushwick", neighborhood: "Bushwick", genres: "punk / indie / rock", score: 79, pay: "Door split", sound: 7.8, booker: 7.5, loadin: "Easy", audience: 7.7, reviews: 15, wouldPlayAgain: 78, capacity: 150, age: "21+", website: "thebroadway.nyc", instagram: "@thebroadwaynyc", note: "Good for emerging bands building local following.", pros: ["Good emerging artist room", "Easy local scene crossover", "Casual vibe"], cons: ["Door split can be unpredictable", "Bill fit matters a lot"] },
  { name: "Our Wicked Lady", area: "Bushwick", neighborhood: "Bushwick", genres: "rock / electronic / rooftop", score: 76, pay: "Varies", sound: 7.4, booker: 7.7, loadin: "Stairs", audience: 7.8, reviews: 17, wouldPlayAgain: 75, capacity: 300, age: "21+", website: "ourwickedlady.com", instagram: "@ourwickedlady", note: "Vibe is strong, logistics can depend on room and setup.", pros: ["Memorable rooftop energy", "Good community feel", "Strong for rock / party bills"], cons: ["Load-in can be annoying", "Setup varies by room"] },
  { name: "Trans-Pecos", area: "Queens", neighborhood: "Ridgewood", genres: "experimental / noise / indie", score: 84, pay: "Fair", sound: 8.5, booker: 8.2, loadin: "Easy", audience: 8.3, reviews: 21, wouldPlayAgain: 88, capacity: 200, age: "All-ages for many events", website: "thetranspecos.com", instagram: "@trans.pecos", note: "Great fit for left-field and experimental bills.", pros: ["Great experimental fit", "Community-oriented", "Good for left-field audiences"], cons: ["Niche audience", "Not ideal for mainstream pop bills"] },
  { name: "Purgatory", area: "Brooklyn", neighborhood: "Bushwick", genres: "DIY / indie / punk", score: 73, pay: "Varies", sound: 7.2, booker: 7.0, loadin: "Medium", audience: 7.1, reviews: 12, wouldPlayAgain: 69, capacity: 200, age: "21+", website: "purgatorybk.com", instagram: "@purgatorybk", note: "Good scene crossover, check bill fit before confirming.", pros: ["DIY energy", "Good crossover bills", "Welcoming to new projects"], cons: ["Lower predictability", "Confirm payout and set time"] }
];

const grid = document.getElementById('venueGrid');
const search = document.getElementById('search');
const factsPanel = document.getElementById('venueFacts');
let selectedVenueName = venues[0].name;

function metricBar(label, value) {
  const pct = Math.max(0, Math.min(100, value * 10));
  return `
    <div class="rating-row">
      <div class="rating-label"><span>${label}</span><strong>${value}/10</strong></div>
      <div class="rating-track"><div class="rating-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function renderVenues(list) {
  grid.innerHTML = list.map(v => `
    <article class="venue-card glass-card ${v.name === selectedVenueName ? 'selected' : ''}" data-venue="${v.name}">
      <div class="venue-top">
        <div>
          <h3>${v.name}</h3>
          <div class="meta">${v.area} · ${v.genres}</div>
        </div>
        <div class="score-bubble">${v.score}<span>/100</span></div>
      </div>

      <div class="review-summary">
        <strong>${v.wouldPlayAgain}%</strong> would play again · <strong>${v.reviews}</strong> artist reviews
      </div>

      <p class="venue-note">${v.note}</p>

      <div class="metrics compact-metrics">
        <div class="metric"><span>Pay</span><strong>${v.pay}</strong></div>
        <div class="metric"><span>Sound</span><strong>${v.sound}/10</strong></div>
        <div class="metric"><span>Booker</span><strong>${v.booker}/10</strong></div>
        <div class="metric"><span>Load-in</span><strong>${v.loadin}</strong></div>
      </div>

      <div class="pros-cons">
        <div><span class="mini-label">Pros</span><p>${v.pros[0]}</p></div>
        <div><span class="mini-label">Watch out</span><p>${v.cons[0]}</p></div>
      </div>

      <button class="facts-link" type="button" data-venue="${v.name}">Venue Facts →</button>
    </article>
  `).join('');

  document.querySelectorAll('.facts-link, .venue-card').forEach(el => {
    el.addEventListener('click', e => {
      const venueName = e.currentTarget.dataset.venue;
      const venue = venues.find(v => v.name === venueName);
      selectedVenueName = venueName;
      showVenueFacts(venue);
      renderVenues(filterVenues());
    });
  });
}

function showVenueFacts(v) {
  factsPanel.innerHTML = `
    <div class="panel-header">
      <div>
        <div class="panel-badge">Venue Profile</div>
        <h3>${v.name}</h3>
        <p>${v.neighborhood} · ${v.genres}</p>
      </div>
      <div class="score-bubble large">${v.score}<span>/100</span></div>
    </div>

    <div class="panel-section">
      <h4>Soundcheck ratings</h4>
      ${metricBar('Sound', v.sound)}
      ${metricBar('Booker', v.booker)}
      ${metricBar('Audience fit', v.audience)}
    </div>

    <div class="panel-section fact-grid">
      <div><span>Capacity</span><strong>${v.capacity}</strong></div>
      <div><span>Age policy</span><strong>${v.age}</strong></div>
      <div><span>Neighborhood</span><strong>${v.neighborhood}</strong></div>
      <div><span>Website</span><strong>${v.website}</strong></div>
      <div><span>Instagram</span><strong>${v.instagram}</strong></div>
      <div><span>Review count</span><strong>${v.reviews}</strong></div>
    </div>

    <div class="panel-section two-col">
      <div>
        <h4>Pros</h4>
        <ul>${v.pros.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
      <div>
        <h4>Watch out</h4>
        <ul>${v.cons.map(item => `<li>${item}</li>`).join('')}</ul>
      </div>
    </div>

    <div class="source-note">Source mix: prototype artist reviews + public venue facts. Replace with verified sources as database grows.</div>
  `;
}

function filterVenues() {
  const q = search.value.toLowerCase();
  return venues.filter(v => `${v.name} ${v.area} ${v.neighborhood} ${v.genres}`.toLowerCase().includes(q));
}

renderVenues(venues);
showVenueFacts(venues[0]);

search.addEventListener('input', () => {
  const filtered = filterVenues();
  if (!filtered.some(v => v.name === selectedVenueName) && filtered.length) {
    selectedVenueName = filtered[0].name;
    showVenueFacts(filtered[0]);
  }
  renderVenues(filtered);
});

document.getElementById('gigForm').addEventListener('submit', e => {
  e.preventDefault();
  const pay = Number(document.getElementById('pay').value);
  const travel = Number(document.getElementById('travel').value);
  const venueScore = Number(document.getElementById('venueScore').value);
  const day = document.getElementById('day').value;
  let score = venueScore + Math.min(pay / 10, 25) - Math.max((travel - 30) / 4, 0);
  if (day === 'weekend') score += 8;
  let verdict = 'Negotiate';
  let text = 'The gig has potential, but ask for clearer terms or better support before confirming.';
  if (score >= 95) { verdict = 'Accept'; text = 'The offer looks strong relative to venue quality, travel, and likely turnout.'; }
  if (score < 72) { verdict = 'Skip or renegotiate hard'; text = 'The current offer may not justify the time, travel, or venue risk.'; }
  const result = document.getElementById('gigResult');
  result.classList.remove('hidden');
  result.innerHTML = `<h3>${verdict}</h3><p>${text}</p><p><strong>Gig score:</strong> ${Math.round(score)}/120</p>`;
});

const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', async e => {
    e.preventDefault();
    const review = {
      venue: document.getElementById('reviewVenue').value,
      location: document.getElementById('reviewLocation').value,
      email: document.getElementById('reviewEmail').value,
      anonymous: document.getElementById('anonymous').checked,
      genre: document.getElementById('reviewGenre').value,
      payout: document.getElementById('reviewPayout').value,
      wouldPlayAgain: document.getElementById('reviewAgain').value,
      sound: document.getElementById('reviewSound').value,
      booker: document.getElementById('reviewBooker').value,
      payReliability: document.getElementById('reviewPay').value,
      loadIn: document.getElementById('reviewLoadin').value,
      note: document.getElementById('reviewNote').value,
      submittedAt: new Date().toISOString()
    };
    const successEl = document.getElementById('reviewSuccess');
    try {
      await submitToGoogleSheets({ type: 'review', ...review });
      successEl.textContent = 'Review submitted. Thank you for helping other musicians.';
    } catch (error) {
      console.error(error);
      successEl.textContent = 'Google Sheets is not connected yet. Your review payload is printed in the browser console.';
      console.log('Soundcheck review payload:', review);
    }
    successEl.classList.remove('hidden');
    reviewForm.reset();
    document.getElementById('anonymous').checked = true;
  });
}

const requestForm = document.getElementById('requestForm');
if (requestForm) {
  requestForm.addEventListener('submit', async e => {
    e.preventDefault();
    const request = {
      venue: document.getElementById('requestVenue').value,
      location: document.getElementById('requestLocation').value,
      email: document.getElementById('requestEmail').value,
      reason: document.getElementById('requestReason').value,
      submittedAt: new Date().toISOString()
    };
    const successEl = document.getElementById('requestSuccess');
    try {
      await submitToGoogleSheets({ type: 'request', ...request });
      successEl.textContent = 'Venue request submitted. Thank you.';
    } catch (error) {
      console.error(error);
      successEl.textContent = 'Google Sheets is not connected yet. Your request payload is printed in the browser console.';
      console.log('Soundcheck venue request payload:', request);
    }
    successEl.classList.remove('hidden');
    requestForm.reset();
  });
}
