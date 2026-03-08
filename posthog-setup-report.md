<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Unicorn Mafia Next.js App Router site. The setup includes client-side initialisation via `instrumentation-client.ts` (the recommended approach for Next.js 15.3+), a server-side PostHog client, a reverse proxy through Next.js rewrites (EU region), and 10 tracked events across 7 files. Exception capture is enabled globally via `capture_exceptions: true`.

| Event                              | Description                                                 | File                                                |
| ---------------------------------- | ----------------------------------------------------------- | --------------------------------------------------- |
| `contact_form_opened`              | User opened the contact form dialog                         | `src/components/contact-form.tsx`                   |
| `contact_form_submitted`           | User successfully submitted the contact form                | `src/components/contact-form.tsx`                   |
| `contact_form_error`               | Contact form submission failed with an error                | `src/components/contact-form.tsx`                   |
| `nav_link_clicked`                 | User clicked a navigation link (desktop or mobile menu)     | `src/app/_components/navbar/navbar.tsx`             |
| `mobile_menu_toggled`              | User opened or closed the mobile navigation menu            | `src/app/_components/navbar/navbar.tsx`             |
| `social_link_clicked`              | User clicked a social media link in the footer              | `src/app/_components/contact/contact.tsx`           |
| `company_card_clicked`             | User clicked on a member company card                       | `src/app/_components/companies/company-card.tsx`    |
| `event_card_clicked`               | User clicked on a calendar event card                       | `src/app/_components/calendar/event-card.tsx`       |
| `hackathon_card_clicked`           | User clicked on a hackathon win card                        | `src/app/_components/hackathons/hackathon-card.tsx` |
| `contact_form_submission_received` | Server-side: contact form processed and sent to Google Chat | `src/app/api/contact/route.ts`                      |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics**: https://eu.posthog.com/project/92000/dashboard/558245
- **Contact form conversion funnel**: https://eu.posthog.com/project/92000/insights/TEfWdvSo
- **Contact form submissions vs errors**: https://eu.posthog.com/project/92000/insights/fRZAW88V
- **Social link clicks by platform**: https://eu.posthog.com/project/92000/insights/0xtrtR8h
- **Community content engagement**: https://eu.posthog.com/project/92000/insights/CcI37YLj
- **Navigation link clicks by section**: https://eu.posthog.com/project/92000/insights/m2II7Q0J

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
