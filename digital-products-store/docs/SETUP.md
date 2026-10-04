# Setup: start to finish

Order matters; each step depends on the one before.

## 0. Before you sell anything: sourcing rights
"Dropshipping" digital products means you list a product and a supplier (or your own storage) holds the file; your automation delivers it after payment. **Only sell products you have the right to resell** (PLR / MRR / reseller licences, or products you made). Reselling someone's work without permission is infringement and gets Stripe accounts closed. Put the licence terms in the `license_note` column.

## 1. Google Sheet (your product database)
1. Create a Google Sheet with two tabs named exactly **Products** and **Orders**.
2. Import `n8n/sheets/Products.csv` into Products and `n8n/sheets/Orders.csv` into Orders (headers only).
3. Copy the sheet ID from the URL (`/d/<ID>/edit`). Keep this sheet **private**: it holds `supplier_download_url`.

| Products column | Meaning |
|---|---|
| sku | unique id |
| title, category, price, currency | shown on site |
| description | leave blank and workflow 03 writes it with AI |
| image_url | optional, public image URL |
| stripe_payment_link_id | `plink_...` from step 2 |
| stripe_payment_link_url | `https://buy.stripe.com/...` (the Buy button) |
| supplier_download_url | **private**; emailed to the customer after payment |
| license_note | shown on site and in the email |
| active | `TRUE` to publish |

## 2. Stripe
1. For each product create a **Payment Link** (Stripe Dashboard → Payment Links). Turn on "collect customer email" (on by default).
2. Copy its `plink_...` id (visible in the dashboard URL / API) and its `https://buy.stripe.com/...` URL into the sheet.
3. Start in **test mode** with the `4242 4242 4242 4242` test card.

## 3. n8n
Use n8n Cloud or self-host with HTTPS (webhooks must be publicly reachable).
1. **Credentials**: create Stripe, Google Sheets (OAuth2), SMTP (or swap the node for Gmail/Resend), Telegram (bot from @BotFather), Anthropic and GitHub (fine-grained token, `Contents: read/write` on the repo only).
2. **Import** each file in `n8n/workflows/` (Workflows → Import from file), then in every node:
   - pick your credential,
   - replace `REPLACE_WITH_SHEET_ID`, `REPLACE_WITH_TELEGRAM_CHAT_ID`, `REPLACE_WITH_GITHUB_OWNER`, `YOUR-SITE-DOMAIN`, and the `orders@example.com` sender.
3. **01 Order Fulfillment**: open the *Stripe Checkout Completed* node and copy its webhook URL; n8n registers it in Stripe when you activate. Send a test purchase and confirm the email, the Orders row and the Telegram message arrive, and that a **second** delivery of the same event does nothing (idempotency by `session_id`).
4. **03 Catalog Sync**: click *Run Manually*. Check that `site/products.json` is committed and descriptions were filled in the sheet.
5. **02 AI Sales Agent**: activate, copy the **production** webhook URL, and paste it into `site/config.js` as `chatWebhookUrl`. Set `allowedOrigins` on the webhook node to your site's origin.
6. Activate all three workflows.

## 4. Website
> This project currently lives in the `digital-products-store/` folder of the `Gentle-Push` repo. If you move it to its own repo, change the *Commit products.json* node (repository + `filePath` -> `site/products.json`) and the `.github/workflows/ci.yml` location.

1. Push this repo to GitHub.
2. Deploy `site/` as a static site: Vercel/Netlify/Cloudflare Pages (publish directory `site`, no build command), or GitHub Pages.
3. Edit `site/config.js` (store name, chat URL) and `site/policies.html` (real contact email, legal review).
4. Every catalog sync commits `site/products.json`, which triggers a redeploy automatically.

## 5. Go live checklist
- [ ] Test purchase end-to-end in Stripe test mode
- [ ] Swap to live Stripe keys, recreate Payment Links in live mode, update sheet ids/urls
- [ ] Re-run workflow 03
- [ ] Policies page reviewed; supplier licences confirmed
- [ ] Telegram alert for unmapped payments tested (put a wrong `plink_` id on purpose)

## Troubleshooting
- **Paid but no email**: Telegram "NOT FULFILLED" alert means the `plink_` id in the sheet doesn't match the payment. Fix the row and fulfil manually.
- **Chat says unavailable**: check `chatWebhookUrl`, that workflow 02 is active, and `allowedOrigins`.
- **Workflow 03 commit errors**: the GitHub token needs Contents write on this repo and the `main` branch name must match the node.
