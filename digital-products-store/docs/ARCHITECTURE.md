# Architecture

```
                        ┌────────────────────────────┐
  Google Sheet  ───────▶│ 03 Catalog Sync (n8n)      │──▶ commits site/products.json ─▶ static host redeploys
  (private source       │  + Claude writes blank     │
   of truth)            │    descriptions            │
        ▲               └────────────────────────────┘
        │ lookup/log
        │
  Customer ─ Buy now ─▶ Stripe Payment Link ─ checkout.session.completed ─▶ 01 Order Fulfillment (n8n)
                                                                              paid? → already handled? → product lookup
                                                                              → email download link → log order → Telegram
                                                                              (unmapped product → Telegram alert)

  Customer ─ chat widget ─▶ 02 AI Sales Agent (n8n webhook) ─▶ Claude + get_catalog tool + per-session memory
```

## Design decisions
- **Sheet is the single source of truth.** The public `products.json` is generated from it and never contains `supplier_download_url`; `scripts/validate.mjs` fails CI if that leaks.
- **Idempotent fulfilment.** Stripe may redeliver events; orders are keyed by Checkout `session_id` and skipped if already logged.
- **Fail loudly.** A paid order that can't be fulfilled alerts the owner instead of silently dropping.
- **The agent is read-only.** It can read the public catalog and talk; it cannot issue refunds, change prices or see orders. Refunds go to a human.
- **No secrets in the repo or site.** All keys live in n8n credentials; `config.js` is public.

## Known limitations / next steps
- Download links are static supplier URLs. For stronger protection, host files in R2/S3 and email expiring presigned links.
- Catalog sync commits even when nothing changed; add a hash check if the commit noise bothers you.
- Refund/chargeback handling (`charge.refunded`) is not automated yet.
- Chat has no rate limiting beyond n8n's own; put Cloudflare in front of the webhook for production traffic.
