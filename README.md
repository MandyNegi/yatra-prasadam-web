# YatraPrasadam — Prasadam Discovery Platform

> **"Prasadam along your journey."**  
> Find pure Krishna prasadam, connect directly with devotee kitchens, and travel with devotion across Indian Railways.

YatraPrasadam is a fast, responsive, mobile-first railway discovery website built to help railway travellers find sanctified Krishna prasadam, verify declared dietary practices (Jain-compliant, No onion/garlic, Sattvic, Ekadashi vrat), and coordinate directly with devotee providers via WhatsApp.

---

## ✨ Key Features Implemented

1. **Station Search & Discovery:**
   - Search by railway station name, city, state, or standard station code (e.g. `PUNE`, `NDLS`, `MTJ`, `BSB`, `PURI`, `AYC`, `TPTY`, `ADI`).
   - Autocomplete suggestions with station code badges and quick navigation.
   - Stable, shareable URLs: `/stations/:slug` (e.g., `/stations/pune`, `/stations/new-delhi`).

2. **Differentiating Dietary Preference System:**
   - Explicit structured attributes:
     - 🪔 **Krishna Prasadam** (offered with devotion)
     - 🌿 **No Onion, No Garlic** (strictly excluded premises)
     - 🌾 **Jain-Friendly** (declared root-vegetable exclusion)
     - 🥛 **Sattvic Aahar** (pure ghee, whole spices, non-commercial)
     - 🥥 **Ekadashi-Friendly** (grain-free fasting options on vrat days)
   - **Strict AND Matching**: A provider must satisfy every selected criteria. Dietary requirements are never silently relaxed.

3. **Contextual WhatsApp Coordination:**
   - Standard click-to-chat `https://wa.me/` integration.
   - Optional prefill modal allowing travellers to specify their train number/name, date of journey, arrival time, passenger count, and coach notes.
   - Generates formatted, respectful Hare Krishna coordination messages directly in WhatsApp.
   - Safe external link attributes (`noopener,noreferrer`) without third-party dependencies or paid API keys.

4. **Devotee Provider Registration:**
   - Public `/become-a-provider` registration form.
   - Station coverage selection, advance notice requirements, and detailed dietary preparation notes.
   - Stores applications with `status: "pending"` to protect privacy and prevent unverified listings from appearing publicly.

5. **Administrator Dashboard (`/admin`):**
   - Review pending provider applications with full contact details.
   - Approve applications (instantly promotes to verified, published directory) or reject with notes.
   - Manage active providers (toggle published state, update availability status, edit advance notice).
   - Add and manage railway stations and junction hubs.
   - Moderate reports submitted by travellers regarding outdated numbers or inactive kitchens.

6. **Firebase Integration & Mock Mode:**
   - Cloud Firestore and Firebase Auth ready via environment variables (`.env`).
   - Seamless **Mock Mode** fallback with persistent `localStorage` and realistic initial pilot data (New Delhi, Pune, Mathura, Varanasi, Puri, Ayodhya, Tirupati, Ahmedabad) so reviewers can test every feature immediately without external credentials.
   - Dedicated `firestore.rules` enforcing strict read/write security constraints.

7. **SEO, Performance & Devotional UX:**
   - Deep forest green (`#1b4332`), warm cream backgrounds (`#fbf9f4`), and gold accents (`#c8963e`).
   - Route-level code-splitting with sub-50kB initial bundle size.
   - OpenGraph metadata, `robots.txt`, and `sitemap.xml`.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🔐 Administrator Access

- Navigate to `/admin` or click **Admin Portal** in the navigation header.
- For local testing and demonstration in mock mode, use the administrative passcode:
  ```text
  admin108
  ```
- From the admin dashboard, you can view the pending applications queue, approve Ayodhya Dham Ram Prasadam Seva, inspect reports, or add new railway stations.

---

## 🛠️ Configuring Live Firebase (Production)

To connect a live Firebase project, create a `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Then deploy the included `firestore.rules` using the Firebase CLI:
```bash
firebase deploy --only firestore:rules
```

---

## 📄 License & Devotional Spirit

Built for the service of pilgrims across Indian Railways.
*Hare Krishna Hare Krishna Krishna Krishna Hare Hare • Hare Rama Hare Rama Rama Rama Hare Hare*
