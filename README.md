# Truehand

Type text, get it back handwritten: realistic handwriting on ruled paper, rendered in the browser and downloaded as PDF or PNG. Free with ads; three one-time plans (Week, Month, Year) add pages, every hand, paper and pen, up to 4K quality, and no ads.

## Repository

| Path                | What it is                                                                                                       |
| ------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `apps/web`          | The Next.js site: editor, catalogue, pricing, accounts, payments, content pages                                  |
| `packages/engine`   | The handwriting engine: HarfBuzz shaping, layout on ruled paper, controlled randomness, Canvas renderer, PDF/ZIP |
| `packages/catalog`  | Handwriting styles, papers and pens, with their free/Pro tier                                                    |
| `assets/fonts`      | The open-source handwriting fonts (OFL / Apache 2.0) and their licences                                          |
| `docs/`             | Requirement analysis and product/architecture notes                                                              |

## Run it locally

Needs Node 22+ and pnpm 10 (`corepack enable`).

```sh
pnpm install
pnpm dev            # http://localhost:3000
```

No setup is needed for development: the database is an embedded PGlite in `apps/web/.data/`, and sign-in codes are printed to the terminal instead of emailed.

Other commands:

```sh
pnpm test           # engine and web tests
pnpm typecheck
pnpm format
pnpm build          # production build of the site
```

## Deploy on Vercel

1. **Root Directory must be `apps/web`.** In the Vercel project: Settings → Build and Deployment → Root Directory → `apps/web` → Save. Leave the framework on Next.js and every command on its default. With the root left at the repository root, the build fails with _"No Output Directory named public"_ or _"No Next.js version detected"_.
2. **Database.** Add Neon from the Vercel Marketplace (Storage → Neon), or paste any Postgres URL as `DATABASE_URL`. Each build applies the migrations to it, so there is no separate step.
3. **Environment variables.** Add the ones below under Settings → Environment Variables, then redeploy.
4. **Production branch.** Make `main` the default branch on GitHub (Settings → Branches) and the production branch on Vercel (Settings → Environments → Production). Merges to `main` then go live, and pull requests get preview URLs.

### Environment variables

The full list with comments is in [`apps/web/.env.example`](apps/web/.env.example).

| Variable                                                                          | Needed for                                        |
| --------------------------------------------------------------------------------- | ------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                                                             | Canonical URLs, sitemap, emails (`https://truehand.app`). Empty: the Vercel production domain |
| `DATABASE_URL`                                                                    | Accounts, orders, download limits                 |
| `BETTER_AUTH_SECRET`                                                              | Sign-in. Generate with `openssl rand -base64 32`  |
| `BETTER_AUTH_URL`                                                                 | Same as the site URL                              |
| `ADMIN_EMAILS`                                                                    | Who can read feedback at `/admin/feedback` (your sign-in email) |
| `RESEND_API_KEY`, `EMAIL_FROM`                                                    | Emailing sign-in codes                            |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                        | Optional "Continue with Google"                   |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Payments from India (INR, UPI)    |
| `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Payments from everywhere else (USD) |
| `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_*`                         | Ads, once AdSense is approved                     |
| `NEXT_PUBLIC_AD_PLACEHOLDERS`                                                     | `0` hides the labelled ad placeholders            |
| `NEXT_PUBLIC_BUSINESS_*`, `NEXT_PUBLIC_SUPPORT_EMAIL`                              | Your legal name and address on the legal pages    |

Empty values count as unset, so pasting the whole example file with blanks is safe. The site itself (editor, previews, downloads, every content page) works without any of these. Sign-in and checkout need the database and the auth secret.

### Payments

Both providers take one-time payments; there are no subscriptions to manage.

- **Razorpay:** Dashboard → Account & Settings → API Keys for the key id and secret. Webhooks → add `https://<your-domain>/api/webhooks/razorpay`, event `payment.captured`, and copy its secret into `RAZORPAY_WEBHOOK_SECRET`.
- **PayPal:** developer.paypal.com → Apps & Credentials → create an app for the client id and secret. Add a webhook to `https://<your-domain>/api/webhooks/paypal` with event `PAYMENT.CAPTURE.COMPLETED` and put its id in `PAYPAL_WEBHOOK_ID`. Use `PAYPAL_ENV=sandbox` to test, `live` for real payments.

Checkout confirms the payment in the browser first; the webhooks are the backup if the tab closes mid-payment. Fulfilment is idempotent, so both arriving is fine.

### Ads

Until AdSense approves the site, every ad space shows a labelled placeholder. After approval, set `NEXT_PUBLIC_ADSENSE_CLIENT` (`ca-pub-…`), create one responsive display ad unit and put its id in `NEXT_PUBLIC_ADSENSE_SLOT_DISPLAY`; it fills every placement. To compare placements in AdSense reports, give any of them its own unit (`NEXT_PUBLIC_ADSENSE_SLOT_TOP`, `_EDITOR`, `_FEED`, `_ARTICLE`, `_BANNER`, `_FOOTER`, `_EXPORT`, `_ANCHOR`, `_RAIL`). People on a plan never load ad code.

| Placement | Where                                                              | Size                         |
| --------- | ------------------------------------------------------------------ | ---------------------------- |
| `top`     | Under the page intro, above the editor and on index pages          | 728 × 90, 320 × 100 on phones |
| `editor`  | Below the editor                                                   | Responsive                   |
| `feed`    | Between sections on the home, style, use-case and batch pages      | Responsive                   |
| `banner`  | Between style groups                                               | Responsive                   |
| `article` | Inside guides, after every second section                          | Responsive                   |
| `footer`  | Above the footer, every page                                       | Responsive                   |
| `export`  | In the download popup while pages are written                      | 336 × 280                    |
| `anchor`  | Pinned to the bottom of phones, closable                           | 320 × 50                     |
| `rail`    | Both side margins on screens 1760 px and wider                     | 160 × 600                    |

Pricing, sign-in, account and legal pages carry no ads.

### Feedback

After a download the popup asks for a 1–5 rating, with an optional comment and email; every guide ends with "Did this guide help?", and `/feedback` (linked in the footer) takes the same form any time. A device that sent or skipped it isn't asked again for 14 days. Nothing the user wrote is sent, only the rating, their comment and the settings used. Add your email to `ADMIN_EMAILS`, sign in, and open `/admin/feedback` to read everything, newest first.

### Guide screenshots

The screenshots in the guides (`apps/web/public/guides`) are taken from the running site, with the controls each step mentions outlined and numbered. After changing the editor, retake them:

```sh
pnpm --filter @truehand/web build && pnpm --filter @truehand/web start
# in another terminal; CHROME_PATH points at any Chrome or Chromium
CHROME_PATH=/path/to/chrome pnpm --filter @truehand/web guide:shots http://localhost:3000
```

## Fonts

The handwriting fonts come from Google Fonts and are committed in `assets/fonts` with their licences. To refetch or add a family, edit `scripts/fonts/families.json` and run `pnpm fonts:fetch`. The site copies them to `public/hands/` and renders its preview images before each dev start and build (`apps/web/scripts/sync-assets.ts`).
