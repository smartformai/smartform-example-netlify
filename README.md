# SmartForm + Netlify

Two ways to add a SmartForm contact form to a Netlify-hosted site.

## Setup

1. Get a form ID at https://usesmartform.com/dashboard.
2. Clone, configure, deploy:
   ```bash
   git clone https://github.com/yanghuai123456/smartform-example-netlify.git
   cd smartform-example-netlify
   # edit netlify.toml → context "production" env SMARTFORM_FORM_ID
   npx netlify deploy --prod
   ```
3. Open the deployed URL, submit, check your dashboard.

## Option A — pure static HTML form (no Netlify Functions)

`index.html` ships a plain HTML form that posts directly to SmartForm's public endpoint.
Netlify's static hosting serves it; there is no Netlify Function involved.

```html
<form action="https://api.usesmartform.com/api/v1/f/YOUR_FORM_ID" method="POST">
  <input  name="name"    required />
  <input  name="email"   type="email" required />
  <textarea name="message" required></textarea>
  <input  type="text" name="_gotcha" tabindex="-1" autocomplete="off"
          style="position:absolute;left:-9999px" aria-hidden="true" />
  <button type="submit">Send</button>
</form>
```

Replace `YOUR_FORM_ID` with the 8-char ID from your dashboard.

## Option B — Netlify Function proxy

`netlify/functions/submit.mjs` is a small serverless function that forwards browser submissions
to SmartForm. Use this when you want to:

- Keep the form ID out of the public HTML.
- Add validation or field normalization before forwarding.
- Reuse an existing Netlify Function codebase.

The browser calls `/.netlify/functions/submit` and the function does the upstream POST.

## How the API works

- `POST https://api.usesmartform.com/api/v1/f/{form_id}` — JSON or form-data, no API key.
- Response: `{ success, message, submission_id, is_spam, intent, next_url }`.

For the full contract, see https://usesmartform.com/docs.

## License

MIT.
