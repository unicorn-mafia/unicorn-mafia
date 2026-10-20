# Deploy

## Contact relay

The contact form posts to `/api/contact`, which forwards to the Worker in `relay/`. The Worker posts to `DESTINATION_WEBHOOK`.

| Step                            | Command or action                                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Sign in to Cloudflare           | `npx wrangler login`                                                                                                       |
| Deploy the Worker from `relay/` | `npx wrangler deploy`                                                                                                      |
| Set the destination             | `npx wrangler secret put DESTINATION_WEBHOOK`                                                                              |
| Point the site at it            | Set `CONTACT_RELAY_URL` in `src/app/api/contact/route.ts` to the `workers.dev` URL from the deploy output                  |
| Test it                         | `curl -X POST <relay-url> -H 'Content-Type: application/json' -d '{"name":"Test","email":"t@example.com","message":"hi"}'` |

`DESTINATION_WEBHOOK` takes any webhook that accepts `{ "text": "..." }`, which includes Slack and Google Chat incoming webhooks.

To change where leads go, run `wrangler secret put DESTINATION_WEBHOOK` again. The site needs no redeploy.

The relay URL is public. The Worker caps traffic at 10 requests a minute and rejects malformed or oversized submissions.
