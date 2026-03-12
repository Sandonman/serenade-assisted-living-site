# Deploy Waitlist API (Render + Resend)

## 1) Create a Resend API key
1. In Resend, create API key.
2. Verify sender domain/email.

## 2) Deploy API to Render
1. In Render, create **Web Service** from this repo.
2. Use `render.yaml` (Blueprint) or set manually:
   - Build command: `npm install`
   - Start command: `npm start`
3. Set environment variables:
   - `RESEND_API_KEY` = your Resend key
   - `WAITLIST_FROM_EMAIL` = verified sender, e.g. `Serenade <waitlist@yourdomain.com>`
   - `WAITLIST_TO_EMAILS` = recipients CSV, e.g. `calzoni8@yahoo.com,other@example.com`

## 3) Update frontend API URL
`waitlist.html` uses:

```js
window.WAITLIST_API_BASE = 'https://serenade-waitlist-api.onrender.com';
```

Replace with your actual Render service URL if different.

## 4) Test
- Open `/waitlist.html`
- Submit test form
- Confirm email arrives to owners
- Check Render logs if anything fails
