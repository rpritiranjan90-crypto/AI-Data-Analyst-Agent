# Resend Setup — Transactional Email (Free Tier)

> Resend is the email service for sending password reset links, team invitations,
> and payment receipts. Free tier: **3,000 emails/month, 100/day**.

---

## Step 1 — Create a Resend Account

1. Go to [https://resend.com](https://resend.com) and sign up with GitHub or Google.
2. You're dropped into the dashboard — no credit card needed.

---

## Step 2 — Add a Domain (Recommended)

For production emails that land in inboxes (not spam):

1. Go to **Domains → Add Domain**.
2. Enter your sending domain (e.g. `yourdomain.com` or a subdomain like `mail.yourdomain.com`).
3. Resend shows DNS records to add. Add them in your DNS provider (Cloudflare, Route 53, etc.):
   - One **MX** record for receiving (optional, only if you want to receive replies)
   - One or more **TXT** records for SPF, DKIM, and DMARC verification
4. Click **Verify** in Resend. This usually takes 2–5 minutes.

For a quick test without a domain, skip to Step 3 — emails will come from `from@resend.dev`.

---

## Step 3 — Create an API Key

1. Go to **API Keys → Create API Key**.
2. Give it a name like `ai-data-analyst-backend`.
3. Copy the key — it starts with `re_`. It looks like: `re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx`.

---

## Step 4 — Set the Environment Variables

**Development (.env):**
```bash
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=AI Data Analyst <noreply@resend.dev>
APP_ENV=development
```

**Production (.env on Render):**
```bash
RESEND_API_KEY=re_your_key_here
RESEND_FROM_EMAIL=AI Data Analyst <noreply@yourdomain.com>   # your verified domain
APP_ENV=production
```

---

## Step 5 — Verify Email Delivery

Trigger a password reset on the live app with a real email address.
Check:
1. The **Resend dashboard → Emails** — you should see the sent email with status `Delivered`.
2. The recipient's inbox (or spam folder) — the email should arrive within 30 seconds.

---

## Email Types Sent

| Email | When | Template |
|---|---|---|
| Password Reset | User clicks "Forgot password" | `reset_password.html.j2` |
| Team Invite | Workspace owner invites a member | `invite.html.j2` |
| Payment Receipt | Stripe checkout completes | `payment_receipt.html.j2` |

All are rendered with Jinja2 and sent via the Resend REST API.

---

## Resend Free Tier Limits

| Limit | Free | Paid |
|---|---|---|
| Emails per month | 3,000 | 50,000 (Pro $20/mo) |
| Emails per day | 100 | Unlimited |
| Verified domains | 1 | Unlimited |
| Custom branding | No (shows Resend) | Yes |

For a paid client pilot with ~10 users, the free tier is sufficient.
The 100/day limit covers ~4 password resets + 1 team invite per user per day.

---

## Testing Without Real Email

In `APP_ENV=development`, the email is:
1. **Logged** to the backend console with the full reset token.
2. **Sent** via Resend API to the Resend inbox (check [app.resend.com/emails](https://resend.com/emails)).

You don't need a verified domain for development — use `noreply@resend.dev` as the sender.

---

## Troubleshooting

**"Domain not verified" error:**
Make sure you added all the DNS records and waited for verification. Some DNS providers take up to 24 hours for propagation.

**Email landed in spam:**
Add SPF, DKIM, and DMARC records for your domain. Resend's verification screen shows exactly what to add.

**Emails not sending in production:**
Check the Render logs for `[email]` prefix messages. Common cause: `RESEND_API_KEY` not set in the Render environment variables.
