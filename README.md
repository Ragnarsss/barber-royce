# Barber Royce - Landing Page

High-performance, conversion-focused landing page for a barbershop business. Built with modern web technologies optimized for SEO, accessibility, and user experience.

## Project Overview

Professional landing page designed to maximize online presence and drive booking conversions for a local barbershop. Implements best practices for local SEO, performance optimization, and cross-device compatibility.

## Tech Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Styling**: CSS Modules / TailwindCSS (TBD)
- **State Management**: React Hooks
- **Fast Refresh**: SWC

## Key Features

- Modern, responsive design (mobile-first)
- Optimized Core Web Vitals (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- SEO-optimized with prerendering capabilities
- Local SEO integration (Google Business Profile)
- Analytics & conversion tracking
- WCAG 2.1 AA accessibility compliant
- Progressive Web App capabilities

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Installation

```bash
# Clone repository
git clone https://github.com/[username]/barber-royce.git
cd barber-royce

# Install dependencies
npm install

# Start development server
npm run dev
```

## Available Scripts

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## Project Structure

```
barber-royce/
├── src/
│   ├── components/      # React components
│   ├── assets/          # Images, fonts, static files
│   ├── App.tsx          # Main application component
│   └── main.tsx         # Entry point
├── public/              # Static assets
├── WEB_REQUIREMENTS_CHECKLIST.md  # Technical requirements & KPIs
└── vite.config.ts       # Vite configuration
```

## Performance Targets

| Metric                          | Target  | Current |
| ------------------------------- | ------- | ------- |
| LCP (Largest Contentful Paint)  | < 2.5s  | TBD     |
| INP (Interaction to Next Paint) | < 200ms | TBD     |
| CLS (Cumulative Layout Shift)   | < 0.1   | TBD     |
| Lighthouse Score                | > 90    | TBD     |
| Bundle Size                     | < 200KB | TBD     |

## Key Metrics & KPIs

See [WEB_REQUIREMENTS_CHECKLIST.md](./WEB_REQUIREMENTS_CHECKLIST.md) for comprehensive metrics dashboard including:

- Marketing & conversion metrics
- Social media integration
- Technical performance
- SEO & local search
- Cross-functional KPIs

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_GA_TRACKING_ID=your-ga-tracking-id
VITE_GMB_LOCATION_ID=your-gmb-location-id
VITE_API_URL=your-api-url
```

## Deployment

### Recommended Platforms

- **Vercel** (Recommended for React SPA)
- **Netlify**
- **CloudFlare Pages**

```bash
# Build production bundle
npm run build

# Deploy to Vercel
vercel --prod

# Or deploy to Netlify
netlify deploy --prod
```

## SEO Strategy

- React with prerendering (react-snap)
- Dynamic meta tags (react-helmet-async)
- Schema.org structured data (LocalBusiness)
- Google Business Profile integration
- Optimized for local search queries

## Testing

```bash
# Run linter
npm run lint

# Type check
tsc --noEmit

# Test build
npm run build && npm run preview
```

## Development Roadmap

- [ ] Initial setup & component architecture
- [ ] Hero section with booking CTA
- [ ] Services showcase
- [ ] Portfolio/gallery implementation
- [ ] Contact & location integration
- [ ] Analytics & tracking setup
- [ ] SEO optimization
- [ ] Performance tuning
- [ ] A/B testing implementation

## Contributing

This is a private commercial project. For team members:

1. Create a feature branch (`git checkout -b feature/AmazingFeature`)
2. Commit changes (`git commit -m 'Add AmazingFeature'`)
3. Push to branch (`git push origin feature/AmazingFeature`)
4. Open a Pull Request

## License

Private & Confidential - All Rights Reserved

## Contact

Project Maintainer - [@zunig](https://github.com/zunig)

Project Link: [https://github.com/zunig/barber-royce](https://github.com/zunig/barber-royce)

---

**Status**: In Development  
**Version**: 0.0.0  
**Last Updated**: February 2026
