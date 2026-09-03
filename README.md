# Case Management System — Phone Accessories Inventory App

Case Management System is a frontend web application for managing phone case inventory in a phone accessories store.

The project helps store staff add new products, search and filter existing items, track product availability, and organize phone case data in a simple warehouse workflow.

## Overview

The goal of this project was to create a practical inventory management tool for a phone accessories store.

The interface focuses on everyday store tasks: adding new case models, checking stock quantity, filtering products by different criteria, and keeping data available after the page is reopened.

## Features

- Add new phone case products
- Store product information such as brand, model, color, price, quantity, type, and gender category
- Search and filter products by multiple criteria
- Show product availability: “In stock” / “Out of stock”
- Save data using localStorage
- Load saved data when the page opens again
- Work with structured JSON data
- Responsive interface for different screen sizes

## Tech Stack

- HTML5
- CSS3
- Bootstrap
- JavaScript
- JSON
- localStorage
- Fetch API

## My Role

I worked on the frontend implementation of the project, including:

- Page structure and layout
- Product form interface
- JavaScript logic for adding and displaying products
- Filtering and search functionality
- Availability status logic
- localStorage data saving
- Working with JSON files for product/model data
- Responsive UI styling

## Key Frontend Tasks

- Built the interface for adding new warehouse products
- Created dynamic product rendering with JavaScript
- Implemented search and filtering by brand, model, type, gender, price, and quantity
- Added localStorage logic to keep data after page reload
- Used JSON files to structure product and model data
- Created stock availability states based on quantity
- Styled the interface with Bootstrap and custom CSS

## Project Structure

```bash
case-management-system/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── data/
│   ├── models.json
│   └── cases.json
├── images/
└── README.md
