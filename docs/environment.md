# Environment

| Variable              | Where                    | Purpose                                                             |
| --------------------- | ------------------------ | ------------------------------------------------------------------- |
| `CONTACT_RELAY_URL`   | Vercel (optional)        | Overrides the relay URL hardcoded in `src/app/api/contact/route.ts` |
| `DESTINATION_WEBHOOK` | Worker secret (`relay/`) | Slack or Google Chat webhook that receives contact form leads       |
| `GOOGLE_CHAT_WEBHOOK` | Vercel                   | No longer read. Delete it when Vercel access returns                |
