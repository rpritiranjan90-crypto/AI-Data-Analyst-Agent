# Stripe Setup — Billing & Subscriptions (Test Mode is Free)

> Stripe handles checkout, subscription management, and receipts.
> **Test mode is always free** — use `4242 4242 4242 4242` as a test card.
> No money changes hands until you click "Activate" on your Stripe dashboard.

---

## Step 1 — Create a Stripe Account

1. Go to [https://stripe.com](https://stripe.com) and sign up.
2. No credit card needed for test mode — you can use the dashboard fully.

---

## Step 2 — Create Your Products

We'll create two recurring products matching the PricingPage plans.

### Pro Analyst — $29/month

1. Go to **Products → Add product**.
2. Name: `Pro Analyst`
3. Pricing: **Recurring → Monthly → $29.00 USD**.
4. Click **Save product**.
5. Copy the **Price ID** (starts with `price_`). You'll use this as `STRIPE_PRICE_PRO`.

### Enterprise SaaS — $299/month

1. Go to **Products → Add product**.
2. Name: `Enterprise SaaS`
3. Pricing: **Recurring → Monthly → $299.00 USD**.
4. Click **Save product**.
5. Copy the **Price ID**. This is `STRIPE_PRICE_ENTERPRISE`.

---

## Step 3 — Set Up the Webhook

The webhook tells your backend when a payment succeeds or a subscription is cancelled.
This is how the workspace plan upgrades from `free` to `pro` automatically.

1. Go to **Developers → Webhooks → Add endpoint**.
2. Fill in:
   - **Endpoint URL**: `https://ai-data-analyst-agent-xs7p.onrender.com/billing/webhooks/stripe`
   - **Listen to**: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
3. Click **Add endpoint**.
4. On the next screen, expand **Signing secret** and click **Click to reveal**.
5. Copy the signing secret (starts with `whsec_`) — this is `STRIPE_WEBHOOK_SECRET`.

---

## Step 4 — Set Environment Variables

**On Render → Backend Web Service → Environment:**

```
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_secret_here
STRIPE_PRICE_PRO=price_xxxxxxxxxxxxxxxxxxxx
STRIPE_PRICE_ENTERPRISE=price_yyyyyyyyyyyyyyyy
FRONTEND_URL=https://ai-data-analyst-agent-five.vercel.app
```

Find your `STRIPE_SECRET_KEY` at **Developers → API keys** (it's the secret key starting with `sk_test_`).

---

## Step 5 — Verify the Webhook

1. Go to **Developers → Webhooks** → click your webhook.
2. Click **Send test event**.
3. Select `checkout.session.completed`.
4. Click **Send test webhook**.
5. Check your Render backend logs — you should see:
   ```
   [billing][webhook] checkout.session.completed: ws=... plan=pro
   [billing] Workspace xxxxx plan updated to pro
   ```

---

## Step 6 — Test the Full Upgrade Flow

1. Go to [https://ai-data-analyst-agent-five.vercel.app](https://ai-data-analyst-agent-five.vercel.app).
2. Sign in → click **Upgrade to Pro** on the Pricing page.
3. You'll be redirected to Stripe Checkout. Use test card:
   ```
   Card:     4242 4242 4242 4242
   Expiry:   Any future date, e.g. 12/28
   CVC:      Any 3 digits, e.g. 123
   ZIP:      Any 5 digits, e.g. 10001
   ```
4. Click **Pay $29.00**.
5. You should be redirected to `/billing/success?session_id=...` and see the success page.
6. The workspace plan in Supabase should now show `pro`.

---

## Switching to Production (Real Money)

When you're ready to take real payments:

1. Go to **Developers → API keys** → toggle from "Test mode" to "Live mode".
2. Update `STRIPE_SECRET_KEY` in Render to the live key (`sk_live_...`).
3. Update all Price IDs to the live versions.
4. Click **Activate** on your Stripe dashboard.
5. The webhook URL stays the same — Stripe routes live events to the same endpoint.

> **Stripe fees for live mode:** 2.9% + 30¢ per successful charge.
> For $29/mo Pro plan: Stripe takes ~$1.14, you receive ~$27.86.

---

## Customer Portal

After the first payment, users can manage their subscription (upgrade, downgrade, cancel)
from the workspace settings page. This uses the **Stripe Customer Portal** — no extra setup needed.
Just make sure **Customer Portal** is enabled in **Settings → Customer Portal**.

---

## Troubleshooting

**"No billing account found for this workspace" when clicking Manage Billing:**
The user has never upgraded before. Upgrade to a paid plan first — the Stripe customer ID is created on the first checkout.

**Webhook not firing / plan not updating:**
- Check the webhook is pointing to the correct URL.
- Check `STRIPE_WEBHOOK_SECRET` matches exactly (it has a `whsec_` prefix).
- Check Render logs for `[billing][webhook]` entries.

**Checkout redirect goes to /billing/cancel:**
The customer clicked "Cancel" or the session expired. This is expected behaviour.
