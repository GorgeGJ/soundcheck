# Connect Soundcheck to Google Sheets

This version sends both forms to a Google Sheet through a Google Apps Script Web App.

## 1. Create your Google Sheet

Create a new Google Sheet named `Soundcheck Database`.

Create two tabs exactly named:

- `Reviews`
- `Venue Requests`

Add these headers to `Reviews` in row 1:

```text
timestamp,venue,location,email,anonymous,genre,payout,wouldPlayAgain,sound,booker,payReliability,loadIn,note
```

Add these headers to `Venue Requests` in row 1:

```text
timestamp,venue,location,email,reason
```

## 2. Create Google Apps Script

In the Google Sheet, go to:

`Extensions → Apps Script`

Paste this code:

```javascript
const SHEET_REVIEWS = 'Reviews';
const SHEET_REQUESTS = 'Venue Requests';

function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const data = JSON.parse(e.postData.contents || '{}');

    if (data.type === 'review') {
      const sheet = ss.getSheetByName(SHEET_REVIEWS);
      sheet.appendRow([
        data.submittedAt || new Date().toISOString(),
        data.venue || '',
        data.location || '',
        data.email || '',
        data.anonymous || false,
        data.genre || '',
        data.payout || '',
        data.wouldPlayAgain || '',
        data.sound || '',
        data.booker || '',
        data.payReliability || '',
        data.loadIn || '',
        data.note || ''
      ]);
    }

    if (data.type === 'request') {
      const sheet = ss.getSheetByName(SHEET_REQUESTS);
      sheet.appendRow([
        data.submittedAt || new Date().toISOString(),
        data.venue || '',
        data.location || '',
        data.email || '',
        data.reason || ''
      ]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

## 3. Deploy as Web App

In Apps Script:

`Deploy → New deployment → Web app`

Use:

- Execute as: `Me`
- Who has access: `Anyone`

Copy the Web App URL. It should look like:

```text
https://script.google.com/macros/s/XXXXXXXX/exec
```

## 4. Paste URL into `script.js`

Open `script.js` and replace:

```javascript
const GOOGLE_SHEETS_WEB_APP_URL = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";
```

with your Apps Script Web App URL.

## 5. Test locally

Open `index.html` in your browser and submit a test review.

Important: because this uses `mode: 'no-cors'`, the browser cannot read the response from Apps Script, but the row should appear in your Google Sheet.
