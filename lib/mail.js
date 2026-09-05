const nodemailer = require('nodemailer');
const { getDb } = require('./db');

function getTransport() {
  if (!process.env.SMTP_HOST) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
}

const FROM = () => process.env.SMTP_FROM || 'Farnosť Lokca <no-reply@rkclokca.sk>';
const SITE = () => process.env.SITE_URL || 'http://localhost:3000';

async function sendConfirmationEmail(email, token) {
  const t = getTransport();
  if (!t) throw new Error('SMTP nie je nakonfigurované (.env.local)');
  const url = `${SITE()}/api/subscribe/confirm?token=${token}`;
  await t.sendMail({
    from: FROM(),
    to: email,
    subject: 'Potvrďte odber noviniek – Farnosť Lokca',
    html: `
      <p>Dobrý deň,</p>
      <p>na tento e-mail bola vyžiadaná registrácia odberu noviniek a farských oznamov
      zo stránky Rímskokatolíckej farnosti Lokca.</p>
      <p><a href="${url}">Kliknutím sem potvrďte odber</a></p>
      <p>Ak ste o odber nežiadali, tento e-mail ignorujte.</p>
    `,
  });
}

async function notifySubscribers({ subject, heading, excerpt, link }) {
  const t = getTransport();
  if (!t) throw new Error('SMTP nie je nakonfigurované (.env.local)');
  const subs = getDb().prepare('SELECT email, token FROM subscribers WHERE confirmed = 1').all();
  let sent = 0;
  for (const s of subs) {
    const unsub = `${SITE()}/api/subscribe/unsubscribe?token=${s.token}`;
    try {
      await t.sendMail({
        from: FROM(),
        to: s.email,
        subject,
        html: `
          <h2 style="font-family:Georgia,serif">${heading}</h2>
          <p>${excerpt}</p>
          <p><a href="${SITE()}${link}">Prečítať na stránke farnosti</a></p>
          <hr>
          <p style="font-size:12px;color:#888">
            Tento e-mail ste dostali, lebo odoberáte novinky farnosti Lokca.
            <a href="${unsub}" style="color:#888">Odhlásiť odber</a>
          </p>
        `,
      });
      sent++;
    } catch (e) {
      console.error('Mail error for', s.email, e.message);
    }
  }
  return sent;
}

module.exports = { sendConfirmationEmail, notifySubscribers };
