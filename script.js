
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


function slugifyVenue(name) {
  return name
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function profileUrl(v) {
  return `venue.html?venue=${slugifyVenue(v.name)}`;
}

function findVenueFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get('venue');
  if (!slug) return venues[0];
  return venues.find(v => slugifyVenue(v.name) === slug) || venues[0];
}

function openWebsiteUrl(website) {
  if (!website) return '#';
  return website.startsWith('http') ? website : `https://${website}`;
}

const sampleReviews = {
  "Alphaville": [
    { title: "Good energy for a weeknight bill", author: "Anonymous guitarist", date: "Prototype review", rating: 4, text: "Room felt good and the crowd was engaged. I would confirm payout details before announcing the show." },
    { title: "Best when the lineup is matched well", author: "Indie drummer", date: "Prototype review", rating: 4, text: "Strong local vibe. Works well when the bands share an audience instead of random genre mixing." }
  ],
  "Baby's All Right": [
    { title: "Professional room, strong audience fit", author: "Anonymous vocalist", date: "Prototype review", rating: 5, text: "Production felt smooth and the venue has real name recognition. Good room for an established local release show." },
    { title: "Clarify promo expectations", author: "Touring band member", date: "Prototype review", rating: 4, text: "Great stage and sound. I would ask exactly what the venue is doing versus what the artist needs to drive." }
  ],
  "The Broadway": [
    { title: "Useful for building local following", author: "Anonymous bassist", date: "Prototype review", rating: 4, text: "Easy to imagine bringing friends here. Door split means you should be realistic about draw." }
  ],
  "Our Wicked Lady": [
    { title: "Fun vibe, logistics depend on setup", author: "DJ / producer", date: "Prototype review", rating: 4, text: "Memorable energy and rooftop feel. Load-in can be the thing to check before saying yes." }
  ],
  "Trans-Pecos": [
    { title: "Great fit for experimental projects", author: "Experimental artist", date: "Prototype review", rating: 5, text: "Audience was open-minded and the room made sense for left-field music. Strong fit matters more than general popularity." }
  ],
  "Purgatory": [
    { title: "Good DIY crossover, ask details", author: "Anonymous band member", date: "Prototype review", rating: 3, text: "Cool scene crossover. I would confirm payout, set time, and what the full bill looks like before committing." }
  ]
};

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

      <div class="card-actions"><button class="facts-link" type="button" data-venue="${v.name}">Quick Facts →</button><a class="profile-link" href="${profileUrl(v)}">Full Profile</a></div>
    </article>
  `).join('');

  document.querySelectorAll('.facts-link, .venue-card').forEach(el => {
    el.addEventListener('click', e => {
      if (e.target.closest('.profile-link')) return;
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

    <a class="button primary full-profile-button" href="${profileUrl(v)}">Open full venue profile</a>

    <div class="source-note">Source mix: prototype artist reviews + public venue facts. Replace with verified sources as database grows.</div>
  `;
}

function filterVenues() {
  const q = search.value.toLowerCase();
  return venues.filter(v => `${v.name} ${v.area} ${v.neighborhood} ${v.genres}`.toLowerCase().includes(q));
}

if (grid && search && factsPanel) {
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
}

function renderVenueProfilePage() {
  const profileRoot = document.getElementById('venueProfile');
  if (!profileRoot) return;
  const v = findVenueFromUrl();
  const reviews = sampleReviews[v.name] || [];
  document.title = `${v.name} — Soundcheck Venue Profile`;
  profileRoot.innerHTML = `
    <section class="profile-hero">
      <div>
        <a class="back-link" href="index.html#venues">← Back to NYC venues</a>
        <p class="eyebrow">Venue Profile</p>
        <h1>${v.name}</h1>
        <p class="subhead">${v.neighborhood} · ${v.genres}</p>
        <p class="profile-summary">${v.note}</p>
        <div class="profile-actions">
          <a class="button primary" href="index.html#submit">Review this venue</a>
          <a class="button secondary" href="${openWebsiteUrl(v.website)}" target="_blank" rel="noreferrer">Venue website</a>
        </div>
      </div>
      <div class="profile-score-card">
        <span class="label">Soundcheck Score</span>
        <div class="score">${v.score}</div>
        <p><strong>${v.wouldPlayAgain}%</strong> would play again · <strong>${v.reviews}</strong> artist reviews</p>
      </div>
    </section>

    <section class="section profile-grid-section">
      <div class="profile-grid">
        <main class="profile-main">
          <article class="profile-card">
            <h2>Rating breakdown</h2>
            ${metricBar('Sound quality', v.sound)}
            ${metricBar('Booker communication', v.booker)}
            ${metricBar('Audience fit', v.audience)}
            ${metricBar('Pay reliability proxy', Math.min(10, v.score / 10))}
          </article>

          <article class="profile-card">
            <h2>Musician notes</h2>
            <div class="two-col">
              <div>
                <h4>Pros</h4>
                <ul>${v.pros.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
              <div>
                <h4>Watch out</h4>
                <ul>${v.cons.map(item => `<li>${item}</li>`).join('')}</ul>
              </div>
            </div>
          </article>

          <article class="profile-card">
            <div class="reviews-header">
              <h2>Recent artist reviews</h2>
              <a href="index.html#submit">Add review</a>
            </div>
            <div class="review-list">
              ${reviews.map(r => `
                <div class="review-item">
                  <div class="review-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5-r.rating)}</div>
                  <h3>${r.title}</h3>
                  <p class="meta">${r.author} · ${r.date}</p>
                  <p>${r.text}</p>
                </div>
              `).join('') || '<p class="section-copy">No public reviews yet. Be the first artist to review this venue.</p>'}
            </div>
          </article>
        </main>

        <aside class="profile-sidebar">
          <article class="profile-card sticky-card">
            <h2>Venue facts</h2>
            <div class="fact-grid single">
              <div><span>Capacity</span><strong>${v.capacity}</strong></div>
              <div><span>Age policy</span><strong>${v.age}</strong></div>
              <div><span>Neighborhood</span><strong>${v.neighborhood}</strong></div>
              <div><span>Borough / Area</span><strong>${v.area}</strong></div>
              <div><span>Website</span><strong>${v.website}</strong></div>
              <div><span>Instagram</span><strong>${v.instagram}</strong></div>
              <div><span>Common pay signal</span><strong>${v.pay}</strong></div>
              <div><span>Load-in</span><strong>${v.loadin}</strong></div>
            </div>
            <a class="button secondary sidebar-button" href="index.html#request">Request an update</a>
            <p class="source-note">Profile data is MVP seed data. Use submitted musician reviews to replace prototype signals over time.</p>
          </article>
        </aside>
      </div>
    </section>
  `;
}
renderVenueProfilePage();

const gigForm = document.getElementById('gigForm');
if (gigForm) {
  gigForm.addEventListener('submit', e => {
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
}

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
