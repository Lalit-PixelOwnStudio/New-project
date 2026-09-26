# Truehand: code architecture

How the web app (`apps/web`) is organised, and the rules that keep it that way. For the product and the rendering engine, see [02-product-architecture.md](02-product-architecture.md).

## Three tiers

```
┌──────────────────────────────────────────────────────────────────────┐
│ Presentation   src/app        pages, layouts, API route handlers     │
│                src/components shared UI                              │
│                src/editor     the editor and its Web Worker          │
│                src/myhand     making a handwriting from your own     │
│                src/content    blog posts, guides, use cases          │
│                src/lib        pure helpers shared with the browser   │
├──────────────────────────────────────────────────────────────────────┤
│ Business       src/server/services                                   │
│                checkout · entitlements · quota · feedback · hands    │
│                account · waitlist · webhooks                         │
├──────────────────────────────────────────────────────────────────────┤
│ Data           src/server/repositories   every SQL query             │
│                src/server/integrations   Razorpay, PayPal, email     │
│                src/server/db             connection and schema       │
└──────────────────────────────────────────────────────────────────────┘
```

Each tier only calls the one below it:

- **Presentation** handles HTTP and UI. A route handler checks who is signed in, validates the request body with the service's zod schema, calls one service function, and turns the result or a `ServiceError` into a response. Pages read data through services too. Nothing here imports `db`, a repository, an integration or `drizzle-orm`.
- **Business** holds the rules: what a plan grants, how many pages a download may use, when a payment counts as confirmed, how many handwritings an account keeps. Services call repositories and integrations and never write SQL. Expected failures, like a bad signature or a daily limit, throw a `ServiceError` with a stable `code` and an HTTP `status`.
- **Data** talks to storage and to other systems. A repository is a set of plain functions over one table (`orders`, `passes`, `credits`…). Functions that must run inside a transaction take an `Executor`, which is either `db` or a transaction. Integrations wrap one external API each. Neither calls back up into services.

`src/server/auth.ts` sets up Better Auth, which needs the database adapter itself. Presentation uses it only for `currentUser()` and `googleEnabled`.

These rules are enforced by `apps/web/test/architecture.test.ts`, so a change that breaks them fails the tests.

## A request, end to end

`POST /api/checkout` (a buyer presses "Get Month"):

1. `app/api/checkout/route.ts` gets the signed-in user, parses the body with `CheckoutInput`, and reads the country from the request headers.
2. `services/checkout.ts › startCheckout` works out the price for that country, asks `integrations/razorpay` (or `paypal`) for a provider order, and saves our order through `repositories/orders`.
3. The route returns the order to the browser, which opens the payment window.
4. After payment, `confirmRazorpayPayment` (or the webhook, as a backup) calls `fulfilOrder`. In one `withTransaction`, it marks the order paid and adds the plan, credits or unlock through their repositories. Fulfilment is idempotent: only the call that flips the order to paid grants anything.

## Folder map

| Path | What goes there |
| --- | --- |
| `src/app/<route>/page.tsx` | One page. Large pages keep their sections in a private folder next to them: `_home/`, `pricing/_sections/`. |
| `src/app/api/<name>/route.ts` | One API endpoint: validate, call a service, respond. |
| `src/server/services/<area>.ts` | Business rules for one area, plus the zod schemas of its inputs. |
| `src/server/repositories/<table>.ts` | Queries for one table. `transaction.ts` has `withTransaction` and the `Executor` type. |
| `src/server/integrations/<provider>.ts` | One external API. |
| `src/content/blog/posts/<slug>.ts` | One blog post. `blog/index.ts` lists them in order. `blocks.ts` and `types.ts` hold the helpers and types. |
| `src/content/guides/posts/<slug>.ts` | One starter guide, with its screenshot sizes in `guides/images.json`. |
| `src/content/use-cases/cases/<slug>.ts` | One use-case landing page. |

## Common changes

- **A new blog post:** add `src/content/blog/posts/<slug>.ts` (copy an existing one), list it in `blog/index.ts`, and run the tests. `test/blog.test.ts` checks the title and description lengths, links and sample ids. Its samples are rendered in handwriting on the next build.
- **A new guide or use case:** the same, under `guides/posts/` or `use-cases/cases/`.
- **A new API endpoint:** put the rule in a service, and put any new query in a repository. The route stays a few lines long.
- **A new table:** add it to `server/db/schema.ts`, run `pnpm --filter @truehand/web db:generate` for the migration, and give it a repository.
