# GotSpot — Smart Parking for Poland

Real-time parking finder for 20 major Polish cities. Built with React + TypeScript, Leaflet maps, and GCP infrastructure.

> **Status:** Working demo. Prototype for validation and investment — real parking data integration is the next milestone.

---

## Features

- City selection across 20 major Polish cities
- Interactive Leaflet map per city
- Mobile-optimised UI
- GCP Cloud Storage + CDN hosting via Terraform
- CI/CD via GitHub Actions

---

## Quick Start

```bash
npm install
npm start
```

Copy `.env.example` to `.env` and fill in your values before running.

---

## Deploy to GCP

See `DEPLOYMENT_GUIDE.md` for full Terraform + GCP setup.

Required GitHub secrets:
- `GCP_PROJECT_ID`
- `GCP_SA_KEY`

---

## Investor Demo

A standalone investor demo app lives in `investor-demo/`. Deploy it separately to Vercel — see `investor-demo/DEPLOYMENT_GUIDE.md`.

---

## Project Structure

```
GotSpot/
├── src/                  # Main React app
├── investor-demo/        # Standalone investor demo
├── terraform/            # GCP infrastructure as code
├── .github/workflows/    # CI/CD pipelines
└── scripts/              # Terraform backend setup
```

---

## License

Proprietary — All rights reserved
