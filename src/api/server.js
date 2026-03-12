import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

const allowedOrigins = [
  'https://sandonman.github.io',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500'
];

app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error('Not allowed by CORS'));
  }
}));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ ok: true });
});

app.post('/api/waitlist', async (req, res) => {
  try {
    const {
      residentName,
      residentDob,
      advocateName,
      phone,
      email,
      currentResidence,
      referredBy
    } = req.body || {};

    const required = [residentName, residentDob, advocateName, phone, email, currentResidence, referredBy];
    if (required.some((v) => !v || String(v).trim() === '')) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' });
    }

    const resendKey = process.env.RESEND_API_KEY;
    const from = process.env.WAITLIST_FROM_EMAIL;
    const to = (process.env.WAITLIST_TO_EMAILS || '').split(',').map((x) => x.trim()).filter(Boolean);

    if (!resendKey || !from || to.length === 0) {
      return res.status(500).json({ ok: false, error: 'Server email config missing' });
    }

    const subject = `New Waitlist Candidate: ${residentName}`;
    const html = `
      <h2>New Waitlist Candidate Submission</h2>
      <p><strong>Resident Name:</strong> ${residentName}</p>
      <p><strong>Resident Date of Birth:</strong> ${residentDob}</p>
      <p><strong>Family Member / Advocate:</strong> ${advocateName}</p>
      <p><strong>Phone:</strong> ${phone}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Current Residence:</strong> ${currentResidence}</p>
      <p><strong>Referred By:</strong> ${referredBy}</p>
    `;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from,
        to,
        reply_to: email,
        subject,
        html
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Resend error:', errText);
      return res.status(502).json({ ok: false, error: 'Failed to send email' });
    }

    return res.json({ ok: true });
  } catch (error) {
    console.error('waitlist error', error);
    return res.status(500).json({ ok: false, error: 'Unexpected server error' });
  }
});

app.listen(port, () => {
  console.log(`Waitlist API listening on ${port}`);
});
