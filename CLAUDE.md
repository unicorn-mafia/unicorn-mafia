# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack (opens on http://localhost:3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Testing
No test framework is currently configured in this project.

## Project Architecture

This is a Next.js 15 application using the App Router architecture with TypeScript and Tailwind CSS v4.

### Key Structure
- **App Router**: Uses Next.js 13+ App Router with `src/app/` directory
- **Component Organization**: Components are organized in `src/app/_components/` with feature-based folders
- **Styling**: Tailwind CSS v4 with custom theme configuration in `globals.css`
- **Fonts**: Uses Inter and Source Code Pro fonts loaded via `next/font/google`

### Component Architecture
- **Layout**: Root layout in `src/app/layout.tsx` sets up fonts and basic HTML structure
- **Pages**: Main page at `src/app/page.tsx` renders a single-page application with multiple sections
- **Components**: Feature-based components in `_components/` directory:
  - `navbar/` - Navigation with mobile responsive toggle
  - `hero/` - Main hero section with large typography
  - `affiliations/` - Affiliations section
  - `about/` - About section
  - `contact/` - Contact section with CSS modules for animations

### Styling Approach
- Uses Tailwind CSS v4 with custom theme extensions
- CSS modules for component-specific styles (e.g., `contact.module.css`)
- Custom font variables defined in `globals.css`
- Responsive design with mobile-first approach

### Key Features
- Mobile-responsive navigation with animated toggle
- Single-page application layout
- Custom typography with large display text
- Gradient text effects and animations
- Component-scoped styling with CSS modules

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled
- Next.js plugin configured for optimal development experience