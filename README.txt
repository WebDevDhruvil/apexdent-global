APEXDENT GLOBAL — SPCK READY
================================
1. Extract this ZIP.
2. In Spck Editor, open/import the "apexdent" folder.
3. Confirm the structure:
   index.html
   css/style.css
   js/app.js
   js/three-canvas.js
   assets/logo.svg
   assets/favicon.svg
4. Open index.html and tap Play/Preview.
5. Internet access is required for the Three.js CDN and Google Fonts. All application logic works without a backend.

SECURITY DEMO NOTE
------------------
This is a frontend prototype. Passwords are SHA-256 hashed with Web Crypto before localStorage storage, inputs are sanitized/validated, sessions auto-expire after inactivity, and consent/preferences are stored locally. This is NOT a production authentication system: localStorage is not a secure credential vault and a real deployment should use server-side authentication, HTTPS, secure cookies, CSRF protection, rate limiting, audit logging and a real database.

BOOKING
-------
Bookings are stored in localStorage under "apex_bookings". Accounts use "apex_users". Session uses "apex_session". Clear site storage to reset the demo.

THREE.JS
--------
three-canvas.js imports Three.js from jsDelivr CDN. For fully offline operation, download a compatible Three.js ESM build and replace the import URL with a local asset path.
