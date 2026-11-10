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
  googleFormUrl: "https://docs.google.com/forms/d/e/1FAIpQLSf8PXhcuBirXuzwEpY7NV-cO2MG7tffSALTwPfMd9-vZGcQRA/viewform",
  instagram: "https://instagram.com/cosmitara",
  youtube: "https://youtube.com/@cosmitara",
  email: "cosmitara@gmail.com",
  deliveryTime: "within 24 hours",

  // "was" = regular price shown crossed out during the launch offer. Delete it to hide the strike-through.
  offerLabel: "Launch offer",
  plans: [
    { id: "quick",    name: "Quick Insight",    questions: 1, price: 79,  was: 99,
      blurb: "One clear question, one focused spread. Good for a single decision or a feeling you can't shake." },
    { id: "two",      name: "Two Questions",    questions: 2, price: 99,  was: 149,
      blurb: "Two questions, read together, so you see how one part of your life is touching the other." },
    { id: "detailed", name: "Detailed Reading", questions: 5, price: 199, was: 299,
      blurb: "Up to five questions with your birth details woven in. The full picture of where you are right now." },
    // Not shown in the price cards; offered after the free Yes/No wheel.
    { id: "yesno",    name: "Yes/No Reading",   questions: 1, price: 39, home: false,
      blurb: "One yes/no question, answered personally: the card, the answer, and what it means for you." }
  ],

  /*
    Reviews: add real ones only, from people who agreed to be quoted.
    Copy the example below, fill it in, and remove the // at the start of each line.
    Until there is at least one review, the site shows an invite to share one.
  */
  reviews: [
    // { name: "Priya S.", country: "India", reading: "Detailed Reading", stars: 5,
    //   text: "Paste what they wrote here, in their own words." },
    { name: "Thao My", country: "China", stars: 5,
      text: "I am absolutely blown away by how accurate my reading was! Every single card pulled resonated so deeply with what I am currently going through in my life right now." },
    { name: "Yuktha", country: "India", reading: "Yes/No Reading", stars: 5,
      text: "I was incredibly stressed out over a tough situation and desperately needed some quick guidance. I decided to try their Yes/No reading feature, and it was exactly what I needed. The answer was direct, clear, and provided immediate comfort." },
    { name: "Ananya", country: "India", stars: 5,
      text: "I was feeling completely stuck regarding my career path, but this reading gave me the exact push I needed." },
    { name: "Rohan", country: "India", stars: 5,
      text: "Incredibly insightful! The relationship spread I got perfectly captured the dynamic between me and my partner." },
    { name: "Kriti Joshi", country: "India", stars: 4,
      text: "I’ve made it a habit to pull a daily card on this site every morning. It’s amazing how often the card matches the energy of my day." },
    { name: "AuraGlow_99", country: "United States", stars: 5,
      text: "Honestly, I was a bit of a skeptic at first, but a friend recommended this site. I am so glad I tried it." },
    { name: "Chloe", country: "United Kingdom", stars: 5,
      text: "This website has been a sanctuary for me during a very turbulent month. The readings are always delivered with so much compassion and empathy. It feels like a safe space to find peace of mind." },
    { name: "Lucas", country: "Australia", stars: 5,
      text: "I opted for the full, detailed layout and it exceeded all my expectations. The report was beautifully written, thoroughly explained, and deeply analytical. Worth every single penny!" },
    { name: "Elena", country: "Canada", stars: 4,
      text: "As someone completely new to tarot, I loved how easy this site makes it to understand the cards." },
  ]
};
