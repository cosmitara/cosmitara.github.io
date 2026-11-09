/*
  ───────────────────────────────────────────────
  COSMITARA SITE SETTINGS — edit only this file
  ───────────────────────────────────────────────
  1. upiId          → your UPI ID (e.g. "cosmitara@okaxis")
  2. web3formsKey   → free key from https://web3forms.com (enter your email, they mail you the key)
  3. googleFormUrl  → link to your Google Form (after running google-form-setup.gs)
  4. youtube / email → your channel link and contact email
*/
window.COSMITARA = {
  upiId: "cosmitara@nyes",
  payeeName: "Cosmitara",
  web3formsKey: "YOUR_WEB3FORMS_ACCESS_KEY",
  googleFormUrl: "",
  instagram: "https://instagram.com/cosmitara",
  youtube: "https://youtube.com/@cosmitara",
  email: "cosmitara@gmail.com",
  deliveryTime: "within 48 hours",

  plans: [
    { id: "quick",    name: "Quick Insight",    questions: 1, price: 99,
      blurb: "One clear question, one focused spread. Good for a single decision or a feeling you can't shake." },
    { id: "two",      name: "Two Questions",    questions: 2, price: 149,
      blurb: "Two questions, read together, so you see how one part of your life is touching the other." },
    { id: "detailed", name: "Detailed Reading", questions: 5, price: 299,
      blurb: "Up to five questions with your birth details woven in. The full picture of where you are right now." }
  ]
};
