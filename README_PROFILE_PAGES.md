# Soundcheck venue profile pages

This version adds a static venue profile page system.

## Files
- `index.html` — homepage / browse page
- `venue.html` — reusable venue profile page
- `script.js` — venue data, profile routing, Google Sheets form submission
- `styles.css` — homepage + profile page styles

## How profile URLs work
Each venue card now links to:

```text
venue.html?venue=babys-all-right
venue.html?venue=trans-pecos
venue.html?venue=our-wicked-lady
```

The page reads the `venue` query parameter, finds the matching venue in `script.js`, and renders the profile.

## Important
If your current local copy already has the real Google Apps Script URL, copy it into the top of this new `script.js`:

```javascript
const GOOGLE_SHEETS_WEB_APP_URL = "YOUR_DEPLOYED_URL";
```
