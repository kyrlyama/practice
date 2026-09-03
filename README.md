# Stock Tracker — Phone Accessories Inventory & Sales System

A full-stack web application for managing screen protector inventory across two retail locations, built for a phone accessories store. The system replaced a manual paper-based process with a live, database-backed tool used daily by store staff.

## Overview

The goal of this project was to build a practical, production-ready inventory tool — not just a frontend demo. It evolved from a simple product list into a full-stack application with a real database, a secure PHP backend, and an AI-powered feature that turns handwritten sales sheets into structured, exportable data.

The interface is built around real store workflows: adding and removing stock without creating duplicate entries, searching and filtering by multiple criteria at once, and generating sales reports without manual data entry.

## Features

- Add and remove stock through a single form; identical products (same brand, model, type, and store) update their existing quantity instead of creating duplicates, enforced at the database level with a unique key constraint
- Search and filter inventory by brand, model, type, availability, and store, with model suggestions pulled live from existing stock
- Two-store inventory tracking with color-coded store badges
- AI-powered sales sheet digitization: upload a photo of a handwritten sales log, and Claude's vision model extracts each row into an editable table, flagging low-confidence fields for manual review
- One-click export of the reviewed sales data to a formatted `.xlsx` file matching the store's existing paperwork, generated client-side
- Deployed and accessible to store staff from any device, backed by a live MySQL database

## Tech Stack

- **Frontend:** HTML5, CSS3, Bootstrap, JavaScript (ES6+), Fetch API
- **Backend:** PHP, MySQL (mysqli), cURL
- **AI Integration:** Claude API (vision) for handwriting recognition and structured data extraction
- **Data export:** SheetJS (client-side `.xlsx` generation)
- **Hosting:** deployed on a live MySQL-backed PHP host

## My Role

I designed and built the entire system solo, end to end, including:

- Database schema design, including a unique-key constraint to prevent duplicate inventory rows
- PHP backend endpoints for adding, removing, searching, and reading inventory data
- Frontend interface, state handling, and dynamic table rendering in vanilla JavaScript
- Integration with the Claude API for image-based data extraction, including prompt design and response parsing
- Client-side Excel report generation matching an existing business document format
- Full deployment: database migration, secure credential handling, and hosting setup

## Key Tasks

- Diagnosed and fixed a data-duplication bug by introducing a composite unique key and an `INSERT ... ON DUPLICATE KEY UPDATE` pattern
- Built a photo-upload and preview flow, then wired it to a PHP endpoint that securely proxies image data to the Claude API and returns cleaned, structured JSON
- Designed an editable results table that highlights AI-flagged low-confidence fields for quick human review before saving
- Implemented dynamic search filters and live model autocomplete based on current stock, not a hardcoded list
- Migrated the local development database to production and resolved a character-encoding issue affecting non-Latin text
- Secured API credentials via a gitignored config file and GitHub push-protection compliance

## Project Structure

```bash
inventory-app/
├── index.html
├── app.js
├── css/
│   └── styles.css
├── db.php
├── config.php           # not tracked in git — holds the API key
├── add_glass.php
├── remove_glass.php
├── get_glasses.php
├── analyze_photo.php    # Claude API integration
├── schema.sql
└── README.md
```
