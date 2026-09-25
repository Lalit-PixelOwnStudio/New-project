# Truehand

Type text, get it back handwritten: realistic handwriting on ruled paper, rendered in the browser and downloaded as PDF or PNG. Free with ads; Pro (a week, month or year, paid once) removes ads and unlocks every hand, paper and pen.

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
| `NEXT_PUBLIC_SITE_URL`                                                             | Canonical URLs, sitemap, emails (`https://truehand.app`) |
| `DATABASE_URL`                                                                    | Accounts, orders, download limits                 |
| `BETTER_AUTH_SECRET`                                                              | Sign-in. Generate with `openssl rand -base64 32`  |
| `BETTER_AUTH_URL`                                                                 | Same as the site URL                              |
| `RESEND_API_KEY`, `EMAIL_FROM`                                                    | Emailing sign-in codes                            |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`                                        | Optional "Continue with Google"                   |
| `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Payments from India (INR, UPI)    |
| `PAYPAL_ENV`, `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, `PAYPAL_WEBHOOK_ID`, `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Payments from everywhere else (USD) |
| `NEXT_PUBLIC_ADSENSE_CLIENT`, `NEXT_PUBLIC_ADSENSE_SLOT_*`                         | Ads, once AdSense is approved                     |
| `NEXT_PUBLIC_AD_PLACEHOLDERS`                                                     | `0` hides the labelled ad placeholders            |
| `NEXT_PUBLIC_BUSINESS_*`, `NEXT_PUBLIC_SUPPORT_EMAIL`                              | Your legal name and address on the legal pages    |

The site itself (editor, previews, downloads, every content page) works without any of these. Sign-in and checkout need the database and the auth secret.

### Payments

Both providers take one-time payments; there are no subscriptions to manage.

- **Razorpay:** Dashboard → Account & Settings → API Keys for the key id and secret. Webhooks → add `https://<your-domain>/api/webhooks/razorpay`, event `payment.captured`, and copy its secret into `RAZORPAY_WEBHOOK_SECRET`.
- **PayPal:** developer.paypal.com → Apps & Credentials → create an app for the client id and secret. Add a webhook to `https://<your-domain>/api/webhooks/paypal` with event `PAYMENT.CAPTURE.COMPLETED` and put its id in `PAYPAL_WEBHOOK_ID`. Use `PAYPAL_ENV=sandbox` to test, `live` for real payments.

Checkout confirms the payment in the browser first; the webhooks are the backup if the tab closes mid-payment. Fulfilment is idempotent, so both arriving is fine.

### Ads

Until AdSense approves the site, every ad space shows a labelled placeholder. After approval, set `NEXT_PUBLIC_ADSENSE_CLIENT` (`ca-pub-…`) and create one display ad unit each for the editor, the download popup, articles and the banner, putting their ids in `NEXT_PUBLIC_ADSENSE_SLOT_EDITOR`, `_EXPORT`, `_ARTICLE` and `_BANNER`. Pro users never load ad code.

## Fonts

The handwriting fonts come from Google Fonts and are committed in `assets/fonts` with their licences. To refetch or add a family, edit `scripts/fonts/families.json` and run `pnpm fonts:fetch`. The site copies them to `public/hands/` and renders its preview images before each dev start and build (`apps/web/scripts/sync-assets.ts`).
