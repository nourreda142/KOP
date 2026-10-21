# KOPPEE — Coffee & Company

A responsive, seven-page café concept built with semantic HTML, custom CSS and vanilla JavaScript. Reworked from the original KOP coffee website, retaining its brand and original images.

## Run

Open `index.html`, or use a static server for consistent browser storage: `python3 -m http.server 8080`, then visit `http://localhost:8080`.

## Pages

Home, Our story, The experience (including FAQs), Coffee menu, Book a table, Guest notes, Say hello. Original filenames are preserved for existing links.

## Interactions

- Accessible mobile navigation, current-page highlighting and back-to-top.
- Menu search, hot/iced filters, saved drinks and empty states.
- Favourites in browser localStorage; graceful handling when storage is unavailable.
- Reservation validation: future date/time, example opening hours and 1–6 guests.
- Latest demo plan stored locally; delete action. Names, email and notes are not persisted.
- Contact validation and safe message preview using textContent.
- Manual guest-note carousel and native FAQ disclosure controls.
- Keyboard focus, reduced-motion support and responsive layouts.

## Demo boundaries

Menu prices, hours and guest notes are illustrative. No actual orders, bookings, messages, newsletter subscriptions or payments are processed. No backend, account, analytics or build dependencies are required. Replace demo content and add a secure backend before offering real business services.

## Customise

Edit content directly in the HTML pages. Theme colours are CSS custom properties at the top of `assets/style.css`. Shared behaviour is in `assets/app.js`. Navigation and footer are deliberately included in every HTML page so they remain usable with JavaScript disabled; update all seven when changing shared content. Original Bootstrap CSS is retained in assets but is no longer loaded.

## Validation

JavaScript syntax check passed. All seven pages passed local asset/link and single-H1 checks. Automated logic checks covered mobile navigation, menu search, filters, favourites, empty results and storage failure. Browser rendering and full browser form validation have not been verified in this environment.
