# Google Sheets Backend Setup Guide

I have successfully updated your portfolio's contact form to capture inputs, show a "Sending..." animation, and handle the background data submission!

To finish the connection to your Google Sheet, you just need to set up the receiving script on Google's end. Follow these steps:

## 1. Create the Google Sheet
1. Go to Google Drive and create a new Google Sheet.
2. In the very first row, add these exact column headers in columns A through F:
   - `timestamp`
   - `name`
   - `email`
   - `phone`
   - `service`
   - `message`

## 2. Add the Apps Script
1. In your Google Sheet, click **Extensions > Apps Script**.
2. Delete any existing code and paste the following script:

```javascript
const sheetName = 'Sheet1';
const scriptProp = PropertiesService.getScriptProperties();

function initialSetup () {
  const activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  scriptProp.setProperty('key', activeSpreadsheet.getId());
}

function doPost (e) {
  const lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    const doc = SpreadsheetApp.openById(scriptProp.getProperty('key'));
    const sheet = doc.getSheetByName(sheetName);
    
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const nextRow = sheet.getLastRow() + 1;
    
    const newRow = headers.map(function(header) {
      return header === 'timestamp' ? new Date() : e.parameter[header];
    });
    
    sheet.getRange(nextRow, 1, 1, newRow.length).setValues([newRow]);
    
    // --- INSTANT EMAIL NOTIFICATION ---
    // Automatically sends an email alert to you when someone fills the form
    MailApp.sendEmail({
      to: "ar.rehman7240@gmail.com",
      subject: "New Portfolio Project Lead from " + e.parameter['name'],
      htmlBody: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #ff6a00; border-bottom: 2px solid #ff6a00; padding-bottom: 8px;">New Lead Received!</h2>
          <p><strong>Name:</strong> ${e.parameter['name']}</p>
          <p><strong>Email:</strong> ${e.parameter['email']}</p>
          <p><strong>Service Type:</strong> ${e.parameter['service']}</p>
          <p><strong>Project Details:</strong></p>
          <blockquote style="background: #f9f9f9; border-left: 4px solid #ccc; padding: 10px 15px; margin: 10px 0;">
            ${e.parameter['message']}
          </blockquote>
        </div>
      `
    });

    // --- INSTANT TELEGRAM TEXT ALERTS (OPTIONAL) ---
    // If you want free text messages on Telegram:
    // 1. Create a Bot via BotFather on Telegram to get a Bot Token.
    // 2. Get your User Chat ID via @userinfobot.
    // 3. Uncomment the line below and replace <BOT_TOKEN> and <CHAT_ID>:
    // const telegramMsg = "New Lead: " + e.parameter['name'] + " (" + e.parameter['email'] + ") - " + e.parameter['service'] + "\nMessage: " + e.parameter['message'];
    // UrlFetchApp.fetch("https://api.telegram.org/bot<BOT_TOKEN>/sendMessage?chat_id=<CHAT_ID>&text=" + encodeURIComponent(telegramMsg));
    
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'success', 'row': nextRow }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  catch (e) {
    return ContentService
      .createTextOutput(JSON.stringify({ 'result': 'error', 'error': e }))
      .setMimeType(ContentService.MimeType.JSON);
  }
  
  finally {
    lock.releaseLock();
  }
}
```

## 3. Run the Initial Setup
1. At the top of the Apps Script editor, click the **Save** icon.
2. Select `initialSetup` from the function dropdown next to the "Run" button.
3. Click **Run**.
4. Google will ask you to review permissions. Click **Review permissions**, choose your Google account, click **Advanced**, and then click **Go to Untitled project (unsafe)**. Click **Allow**.

## 4. Deploy the Web App
1. At the top right of the editor, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Under "Execute as", select **Me**.
4. Under "Who has access", select **Anyone** (This is crucial!).
5. Click **Deploy**.
6. Copy the **Web app URL** that is generated.

## 5. Add the URL to Your Portfolio
Open `src/App.vue` in your code editor, locate line 183 (inside the `<script setup>` block), and replace the placeholder with your new URL:

```javascript
// IMPORTANT: Paste your Google Apps Script Web App URL here
const GOOGLE_SCRIPT_URL = 'YOUR_ACTUAL_URL_HERE'
```

Once you do that, your form is fully connected to your Google Sheet! Try submitting a test message.
