// netlify/functions/submit.mjs — serverless proxy in front of SmartForm AI.
export default async (req) => {
  if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });

  const ct  = req.headers.get('content-type') || '';
  const body = ct.includes('application/json') ? await req.json() : Object.fromEntries(await req.formData());

  const r = await fetch(`${process.env.SMARTFORM_ENDPOINT}/api/v1/f/${process.env.SMARTFORM_FORM_ID}`, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body:    JSON.stringify(body),
  });
  return new Response(await r.text(), {
    status: r.status,
    headers: { 'Content-Type': 'application/json' },
  });
};
