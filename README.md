# Cosmitara website

Static site for GitHub Pages. No build step. Everything you need to change is in **`config.js`**.

## 1. Connect the form to your email (Web3Forms, free)
1. Go to https://web3forms.com, enter the email where you want requests, and click **Create Access Key**.
2. They email you a key. Paste it into `config.js` → `web3formsKey`.
3. Every request from the website will then arrive in your inbox, with the plan, details, questions and UPI transaction ID. Hit **Reply** to answer the person directly.

## 2. Add your details in `config.js`
- `upiId`: your UPI ID. The QR code and the "Pay in UPI app" button use it automatically, with the right amount for each plan.
- `youtube`, `email`: your channel link and contact email.
- `googleFormUrl`: the link from step 4. The "Prefer Google Forms?" line appears once this is filled.
- Prices and plan text live in `plans` if you ever change them.

## 3. Put it on GitHub Pages
1. Sign in at https://github.com/cosmitara and create a new **public** repository named **`cosmitara.github.io`**.
2. In the repo click **Add file → Upload files** and drag in everything from this folder (`index.html`, `styles.css`, `app.js`, `config.js`, the `assets` folder). Commit.
3. Go to **Settings → Pages**: Source = *Deploy from a branch*, Branch = `main`, folder = `/ (root)`. Save.
4. In a minute or two the site is live at **https://cosmitara.github.io**.

To update later, edit `config.js` right on GitHub (pencil icon) and commit. The site refreshes in about a minute.

## 4. Create the Google Form
Open `google-form-setup.gs` and follow the steps at the top. It builds the full form (same questions as the website) plus a linked Google Sheet.

## Custom domain (later)
Buy the domain, then in **Settings → Pages → Custom domain** enter it, and add the DNS records GitHub shows you at your domain registrar.
