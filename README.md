# Advance Group

Production frontend + Cloudflare Worker for Advance Group.

## What this is

A static marketing site with a property report form and quote request form, served by a Cloudflare Worker.

The project is the foundation of the Advance Group property intelligence and trade management platform.

## Current status

- Frontend is deployed on Cloudflare Workers.
- Advance Group is the current application identity.
- LINZ property data integration is connected through the property data service.
- Property record data structures are in place.
- The property intelligence API is under active development.
- The current MVP should not be assumed to store production customer data unless explicitly implemented and verified.

## Stack

- Vanilla HTML/CSS/JS frontend
- Cloudflare Worker
- Cloudflare Workers Assets
- LINZ property data integration
- Property data services
- Property record data layer

## Project structure

```text
advance-group/
â”œâ”€â”€ public/
â”‚   â”œâ”€â”€ index.html
â”‚   â”œâ”€â”€ app.js
â”‚   â”œâ”€â”€ style.css
â”‚   â””â”€â”€ property-intelligence.js
â”œâ”€â”€ services/
â”‚   â”œâ”€â”€ nz-address-normalization.js
â”‚   â”œâ”€â”€ nz-address-validation.js
â”‚   â”œâ”€â”€ nz-property-data.js
â”‚   â”œâ”€â”€ property-data.js
â”‚   â””â”€â”€ property-record.js
â”œâ”€â”€ data/
â”‚   â”œâ”€â”€ property.js
â”‚   â””â”€â”€ property-schema.js
â”œâ”€â”€ app.js
â”œâ”€â”€ index.html
â”œâ”€â”€ style.css
â”œâ”€â”€ worker.js
â””â”€â”€ wrangler.jsonc
