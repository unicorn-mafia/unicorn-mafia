# Contributing

Thanks for your interest in contributing to the Unicorn Mafia website.

## Adding your company

Member companies can appear on the site by adding an entry to [`public/companies.yaml`](public/companies.yaml). The file is structured as a set of *domains* containing *categories*. Each category lists a set of tools (companies) with the following fields:

```yaml
{
  "name": "Your Company",
  "icon_url": "/companies/your-logo.svg",
  "website_url": "https://example.com",
  "description": "Optional short description"
}
```

1. Copy your company logo into `public/companies/` in **SVG** format.
2. Add a new object under the appropriate category in `public/companies.yaml` referencing the logo path and your website.
3. Commit your changes and open a pull request.

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Please run `npm run lint` and `npm run build` before submitting a PR.
