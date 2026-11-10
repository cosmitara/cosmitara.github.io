/**
 * Cosmitara — creates the "Request a Reading" Google Form + a linked Google Sheet.
 *
 * How to use (2 minutes):
 *  1. Open https://script.google.com while signed in to the Cosmitara Google account.
 *  2. New project → delete the sample code → paste this whole file.
 *  3. Change UPI_ID below to your real UPI ID.
 *  4. Click Run (▶) on createCosmitaraForm and allow the permissions it asks for.
 *  5. Open View → Logs (or "Execution log"): copy the "Share this link" URL.
 *     Paste it into config.js → googleFormUrl, and into your Instagram bio/highlights.
 *  6. In the form: Responses tab → ⋮ → "Get email notifications for new responses".
 */
const UPI_ID = 'cosmitara@nyes';

function createCosmitaraForm() {
  const form = FormApp.create('Cosmitara · Request a Reading');
  form.setDescription(
    'Personal tarot & astrology readings by Cosmitara ✨\n\n' +
    '• Quick Insight — 1 question — ₹79 (regular ₹99)\n' +
    '• Two Questions — 2 questions — ₹99 (regular ₹149)\n' +
    '• Detailed Reading — up to 5 questions — ₹199 (regular ₹299)\n\n' +
    'Your reading is sent by email or Instagram DM within 24 hours of payment. ' +
    'Readings are for reflection and guidance, not medical, legal or financial advice.'
  );
  form.setProgressBar(true);
  form.setConfirmationMessage('Request sent. The cards are being drawn 🌙 Your reading will reach you within 24 hours.');

  // ---- Section 1: reading + about you
  form.addMultipleChoiceItem()
    .setTitle('Which reading would you like?')
    .setChoiceValues(['Quick Insight (1 question) — ₹79', 'Two Questions — ₹99', 'Detailed Reading (up to 5 questions) — ₹199'])
    .setRequired(true);

  form.addTextItem().setTitle('Full name').setRequired(true);
  form.addTextItem().setTitle('Email').setHelpText('Your reading is sent here.').setRequired(true)
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());
  form.addTextItem().setTitle('Instagram handle').setHelpText('Optional, e.g. @yourname');
  form.addDateItem().setTitle('Date of birth').setRequired(true);
  form.addTimeItem().setTitle('Time of birth').setHelpText('Optional. Even an approximate time helps.');
  form.addTextItem().setTitle('Place of birth').setHelpText('Optional. City, State');
  form.addMultipleChoiceItem().setTitle('What is this about?')
    .setChoiceValues(['Love & relationships', 'Career & purpose', 'Self-growth & healing', 'Family & friendships', 'General guidance', 'Other'])
    .setRequired(true);
  form.addTextItem().setTitle("Other person's name and date of birth")
    .setHelpText('Optional. Only if your question is about someone specific.');
  form.addMultipleChoiceItem().setTitle('Send my reading by').setChoiceValues(['Email', 'Instagram DM']).setRequired(true);

  // ---- Section 2: questions
  form.addPageBreakItem().setTitle('Your questions')
    .setHelpText('Open questions get the richest answers. Try "What do I need to know about…" rather than yes/no. ' +
                 'Quick Insight: fill Question 1. Two Questions: fill 1–2. Detailed: up to 5.');
  form.addParagraphTextItem().setTitle('Question 1').setRequired(true);
  for (let i = 2; i <= 5; i++) form.addParagraphTextItem().setTitle('Question ' + i);
  form.addParagraphTextItem().setTitle("Anything else you'd like me to know?");

  // ---- Section 3: payment
  form.addPageBreakItem().setTitle('Pay and send')
    .setHelpText('Pay the amount for your reading to the UPI ID below using GPay, PhonePe, Paytm or any UPI app:\n\n' +
                 'UPI ID: ' + UPI_ID + '\n\nThen enter the UPI transaction ID (UTR / reference number) from your payment details.');
  form.addTextItem().setTitle('UPI transaction ID').setRequired(true);
  form.addCheckboxItem().setTitle('Confirmation')
    .setChoiceValues(["I'm 18 or older, and I understand readings are for reflection and guidance, not medical, legal or financial advice."])
    .setRequired(true);

  // ---- Responses → Google Sheet
  const sheet = SpreadsheetApp.create('Cosmitara · Reading requests');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, sheet.getId());

  Logger.log('Share this link: ' + form.getPublishedUrl());
  Logger.log('Edit the form: ' + form.getEditUrl());
  Logger.log('Responses sheet: ' + sheet.getUrl());
}
