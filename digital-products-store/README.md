# Digital Products Store

A static storefront plus an n8n automation "agent" that runs a digital-products dropshipping business: it sells, delivers, answers customers and keeps the catalog fresh.

| Part | What it does |
|---|---|
| `site/` | Zero-build static website: product grid, Stripe-hosted checkout, AI chat widget |
| `n8n/workflows/01-order-fulfillment.json` | Stripe payment → email download link → log order → notify you |
| `n8n/workflows/02-ai-sales-agent.json` | Website chat → Claude agent that answers from the live catalog |
| `n8n/workflows/03-catalog-sync.json` | Google Sheet → AI-written descriptions → publishes `site/products.json` |
| `n8n/sheets/` | CSV templates for the Products and Orders sheet tabs |
| `docs/SETUP.md` | End-to-end setup, go-live checklist, troubleshooting |
| `docs/ARCHITECTURE.md` | How it fits together and known limitations |

## Quick start
```bash
npm run dev        # serve the site at http://localhost:3000
npm run validate   # check workflow JSON + catalog safety (also runs in CI)
```
Then follow [docs/SETUP.md](docs/SETUP.md). Workflows import with placeholder credentials/IDs that you must fill in inside n8n.

**Only sell products you have the rights to resell.** The policies page is template text; get it reviewed before launch.
