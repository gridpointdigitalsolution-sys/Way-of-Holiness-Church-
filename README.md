# The Way of Holiness Church — Mind of Christ Ministry

Premium 4-page church website. Sacred Luxury design system: deep navy + matte gold, Cormorant Garamond serif, Great Vibes script, Jost sans.

## Pages

| File | Purpose |
|------|---------|
| `index.html` | Home — animated hero with logo halo, services, founders preview, latest videos, testimonials, CTA |
| `about.html` | About — full founder + first lady spotlight, our story timeline, mission/vision/values, statement of faith |
| `programs.html` | Programs — weekly gatherings, upcoming events calendar, YouTube video grid, departments |
| `contact.html` | Contact — info cards, form, prayer request, online giving, plan-your-visit, location/map |

## Where to Drop Your Real Content

### 1. Logo

Save your logo as: **`images/logo.png`** (square — 640 × 640 recommended, transparent background ideal).

It will automatically appear in:
- Browser tab favicon (every page)
- Loader animation (every page)
- Top navigation bar (every page)
- Hero section halo on the home page
- Page hero crests on About / Programs / Contact
- Footer brand block (every page)

### 2. Founder + First Lady Photos

Save as:
- `images/founder.jpg` — Senior Pastor & Founder
- `images/first-lady.jpg` — First Lady & Co-Founder

Recommended: vertical 4:5 portrait, 1200 × 1500 px, well-lit, professional.

### 3. Other Image Slots (optional)

| File | Where it appears |
|------|------------------|
| `images/church-gathering.jpg` | About preview on home page |
| `images/program-sunday.jpg` | Sunday Worship card on Programs page |
| `images/program-bible.jpg` | Bible Study card on Programs page |
| `images/program-prayer.jpg` | Prayer Night card on Programs page |

If a photo is missing, the placeholder graphic remains — no broken image icons.

### 4. YouTube Videos

In `index.html` and `programs.html`, find every `data-youtube="[YOUTUBE_VIDEO_ID]"` attribute on `.video-tile` elements. Replace `[YOUTUBE_VIDEO_ID]` with just the video ID.

**How to get the ID:** From `https://www.youtube.com/watch?v=dQw4w9WgXcQ`, the ID is `dQw4w9WgXcQ` (after `v=`).

Once filled in, the tile auto-loads the YouTube thumbnail. One click plays the video inline.

Also replace `[YOUTUBE_CHANNEL_URL]` in the CTA buttons with your channel URL.

### 5. Text Placeholders

Anywhere you see square-bracketed text — `[Pastor's Full Name]`, `[Service Time]`, `[Church Address]`, `[Phone Number]`, `[Email Address]`, `[Year]`, `[Sermon Title]`, `[Event Title]`, `[FACEBOOK_URL]`, `[INSTAGRAM_URL]`, `[WHATSAPP_URL]` — drop your real value in. Search & replace works well.

### 6. Map Embed

In `contact.html`, the location section has a placeholder. Replace it with a real Google Maps embed:

```html
<iframe
  src="https://www.google.com/maps/embed?pb=YOUR_EMBED_CODE"
  width="100%" height="100%" style="border:0;"
  allowfullscreen loading="lazy"
  referrerpolicy="no-referrer-when-downgrade"
  title="Way of Holiness Church location">
</iframe>
```

Get the embed code from Google Maps → Share → Embed a map.

### 7. Forms

The contact form and prayer form are wired up with success-state UI but **do not send anywhere** out of the box. To go live, point them at:
- A serverless endpoint (Formspree, Netlify Forms, Web3Forms, Formspark)
- Or your own backend `/api/contact`

In `js/main.js`, look for the `setTimeout(...)` block inside the contact form handler — that simulates the send. Replace with a real `fetch()`.

## Design System

- **Colors:** Navy void `#04080F` → Navy deep `#060C1A`. Gold primary `#C9A84C`, gold bright `#D4AF37`. Cream `#F8F3ED`.
- **Fonts:** Cormorant Garamond (display), Great Vibes (script accents), Jost (UI/body).
- **Spacing:** Container max 1300px. Section padding clamp(5rem, 10vw, 9rem).

## Tech

- Pure HTML / CSS / JS — no build step, no dependencies.
- Mobile-first responsive — tested down to 360 px.
- Smooth animations with `prefers-reduced-motion` honored.
- Accessible: ARIA labels, semantic HTML, focus styles, keyboard navigation.

## Run Locally

Just open `index.html` in a browser. Or for a proper local server:

```powershell
python -m http.server 8000
```

Then visit http://localhost:8000

## Going Live

Drop the entire folder onto any static host:
- Netlify (drag-and-drop)
- Vercel
- GitHub Pages
- Cloudflare Pages
- Any cPanel / shared hosting

That's it. No build, no deploy script.
