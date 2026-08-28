# UptimeRobot Setup — Prevent Render Free Tier from Sleeping

> **Why:** Render's free tier puts your backend to sleep after 15 minutes of
> inactivity. The first request after sleep takes 30–60 seconds (cold start).
> This is unacceptable during a college demo or live evaluation. Setting up
> a free UptimeRobot monitor that pings your `/health` endpoint every 14
> minutes keeps the service warm and the demo instant.

---

## 5-Minute Setup

1. **Sign up** at [https://uptimerobot.com](https://uptimerobot.com) (free tier is enough).

2. Click **+ Add New Monitor**.

3. Fill in the form:

   | Field | Value |
   |---|---|
   | Monitor Type | **HTTP(s)** |
   | Friendly Name | `AI Data Analyst Agent – Backend` |
   | URL (to monitor) | `https://ai-data-analyst-agent-xs7p.onrender.com/health` |
   | Monitoring Interval | **14 minutes** (free tier minimum) |

4. Click **Create Monitor**.

That's it. UptimeRobot will now hit your backend every 14 minutes, keeping
the service awake. It also emails you if the service goes down.

---

## How to Verify It's Working

After ~20 minutes, check your Render dashboard → Logs. You should see
GET `/health` requests arriving at a steady cadence.

```bash
# Quick health check from your terminal
curl -I https://ai-data-analyst-agent-xs7p.onrender.com/health
# Expected: HTTP/1.1 200 OK
```

---

## When the Service Sleeps Anyway

The free UptimeRobot plan monitors every 14 minutes. Render's sleep timer
is 15 minutes. That's a **1-minute safety margin** which is usually enough,
but if you ever see a slow first request, hit `curl` on the URL yourself
30 seconds before the demo starts.

---

## Alternative: Upgrade Render to a Paid Plan

If you want zero cold starts and faster networking, Render's Starter plan
($7/month) keeps the service always-on and adds a faster CPU. For a
college project, UptimeRobot is more than enough.

---

## See also

- `docs/ARCHITECTURE.md` — system overview
- `docs/ERROR_CODES.md` — what every error means
- `README.md` — quick start
