# Letterpress — Pixel To Prototype Certificate

A web app for generating a professional Certificate of Completion for workshop
participants: fill a form, get a live preview, download as PNG/PDF or print.

Built with React + TypeScript + Vite + Tailwind CSS v4.

## 1. Installation

Prerequisites:

- Node.js 20 or newer (Node 22 recommended)
- npm 10+ (ships with Node)

## 2. Commands to run

```bash
cd cert-gen
npm install
npm run dev
```

Open the URL printed in the terminal (typically http://localhost:5173).

## 3. Project structure

```
cert-gen/
├─ public/
│  └─ favicon.svg
├─ src/
│  ├─ assets/
│  │  ├─ dpgu-logo.png            # extracted from the reference certificate
│  │  ├─ acm-logo.jpg             # extracted from the reference certificate
│  │  └─ signature.jpg            # extracted from the reference certificate
│  ├─ components/
│  │  ├─ AppHeader.tsx            # top bar, dark mode toggle, saved-records button
│  │  ├─ CertificateForm.tsx      # the 4-field data entry form
│  │  ├─ CertificateTemplate.tsx  # the certificate itself, matches the reference design
│  │  ├─ CertificatePreview.tsx   # scales the template to fit while exporting at native size
│  │  ├─ RecordsDrawer.tsx        # saved-certificates side panel (search/reload/delete)
│  │  └─ Toast.tsx                # success/error notifications
│  ├─ hooks/
│  │  └─ useTheme.ts              # dark/light mode persistence
│  ├─ lib/
│  │  ├─ certificateUtils.ts      # certificate ID generation, date formatting, storage
│  │  ├─ validation.ts            # name / email / department / Indian phone validation
│  │  └─ exportUtils.ts           # PNG/PDF export, print
│  ├─ types/
│  │  └─ certificate.ts           # shared TypeScript types
│  ├─ App.tsx                     # page composition and state
│  ├─ main.tsx                    # React entry point
│  └─ index.css                   # design tokens (colors, fonts), Tailwind import
├─ index.html
├─ package.json
├─ tsconfig*.json
└─ vite.config.ts
```

## 4. How to use

1. Install dependencies and start the dev server (see section 2).
2. Open the local URL in your browser.
3. Fill in **full name**, **email ID**, **department**, and **Indian phone
   number** on the left — these are the only fields collected. The
   certificate on the right updates live as you type the name.
4. Click **Generate certificate** — this assigns a unique certificate number,
   records an issue date, and saves the details to this device (visible
   under **Saved** in the header).
5. Use the **PNG**, **PDF**, or **Print** buttons to export. The exported
   certificate is the reference "Pixel to Prototype: Hands On Figma Workshop"
   certificate with only the participant's full name filled in — everything
   else (logos, workshop title, venue, date, signature) is fixed, matching
   the original design exactly.
6. **Reset** clears the form for the next participant.

Note: only the full name is required to be *shown* on the certificate itself,
per the brief. Email, department, and phone are captured and saved as part of
the participant record (visible in **Saved**) but are not printed on the
certificate.

Notes:

- Saved certificates and the certificate-number counter are stored in your
  browser's `localStorage`, scoped to this device/browser only.
- The preview always renders at the certificate's native resolution and is
  scaled down with CSS to fit the panel, so what you see on screen matches
  the exported PNG/PDF exactly.

## 5. Build for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # serve the production build locally to sanity-check it
```

Deploy the contents of `dist/` to any static host (Vercel, Netlify, GitHub
Pages, S3 + CloudFront, etc.) — no server-side component is required.
