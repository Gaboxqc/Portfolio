# 👋 Hey! Welcome to My Portfolio

This is the code behind my personal portfolio site. I built the whole thing myself — frontend and backend — mostly to have somewhere to put my projects and certifications, but also just because it was a fun challenge.

The data isn't hardcoded. Everything you see on the site comes from [a REST API I built separately](https://github.com/Gaboxqc/GaboxAPI), so I can update my projects or add new certifications without ever touching this repo.

🌐 **Take a look:** [gabrielmayorga.dev](https://gabrielmayorga.dev)

---

## What's on the site

Three pages. The home page is the main landing — intro, some featured projects, and a peek at my certifications. Then there's a full projects page where you can search and filter by type, difficulty level, or technology tags. And a courses page that lists everything I've studied and got certified in.

The whole site works in English, Spanish, and German. I added the multilingual support both here and in the API, so the content itself is translated, not just the UI.

---

## Stack

- **React 19 + Vite 8** — I'm not going back to CRA after using Vite
- **TypeScript** — full type coverage across components, hooks, services, and the API models
- **Tailwind CSS v4** — utility classes with a custom theme
- **Framer Motion** — page transitions and the animated background blobs
- **React Router v7** — client-side navigation
- **TanStack Query + Axios** — handles all the API calls and caching
- **Radix UI** — used for the language selector dropdown
- **Vercel Analytics + Speed Insights** — just to keep an eye on things

---

## Running it locally

```bash
git clone https://github.com/Gaboxqc/Portfolio.git
cd Portfolio
npm install
npm run dev
```

That opens at `http://localhost:5173`. You'll also want a `.env` file:

```env
VITE_API_URL=https://your-api-url.vercel.app/portfolio
```

There's a `.env.example` in the repo you can copy.

You can point that at the live API if you don't want to run the backend locally — all the read endpoints are public.

Other scripts you might want:

```bash
npm run build        # production build → /dist
npm run preview      # serve the production build locally
npm run lint         # ESLint
npm run test         # Vitest
npm run format       # Prettier
```

---

## Project structure

```
src/
├── components/
│   ├── cards/          # ProjectCard, CertificationCard, CourseCard, SkillCard
│   ├── containers/     # map API collections onto cards
│   ├── sections/       # HomePage sections + NavbarSections
│   └── ui/             # Badge, AsyncCollection, FilterGroup, GradientButton, …
├── context/
│   └── LanguageContext.tsx    # locale state, persistence, translate()
├── hooks/
│   ├── useProjects.ts / useCourses.ts / useCertifications.ts   # data
│   ├── useFilters.ts          # filter option lookups
│   ├── useDocumentMeta.ts     # per-route title, canonical, OG tags
│   ├── useToggleArray.ts      # multi-select filter state
│   ├── useLanguage.ts         # LanguageContext accessor
│   ├── useScrollRestoration.ts
│   └── useTilt.ts             # card tilt effect on hover
├── locales/            # en.json, es.json, de.json (key parity is tested)
├── pages/              # HomePage, ProjectsPage, CoursesPage, NotFound, Error
├── services/           # axios instance + one module per endpoint
├── styles/             # index.css, theme.css
├── test/               # Vitest setup
├── types/              # shared domain types (Project, Credential, …)
├── utils/              # getTranslation, style helpers
├── App.tsx             # router, QueryClient, background glows
├── Layout.tsx          # navbar/footer shell + Suspense boundary
└── main.tsx
```

Tests live next to what they cover, as `*.test.ts(x)`.

---

## Where the data comes from

The projects, courses, and certifications are all stored in a PostgreSQL database and exposed through a FastAPI backend I wrote. It lives in its own repo:

👉 [github.com/Gaboxqc/GaboxAPI](https://github.com/Gaboxqc/GaboxAPI)

The frontend pulls from it with TanStack Query through the hooks in `src/hooks/`. Read endpoints are open, write endpoints need an API key.

---

## Adding a language

The locale files are in `src/locales/`. If you wanted to add French for example, you'd create `fr.json` following the same structure as `en.json`, then register the new option in `LanguageContext.tsx`. That covers the UI strings — for content translations you'd also need to add them on the API side.

---

## Deploying

It's on Vercel. Connect the repo, it picks up the Vite config automatically. Done.

---

## Get in touch

- 📧 [gabrielmayorgate@gmail.com](gabrielmayorgate@gmail.com)
- 🐙 [github.com/Gaboxqc](https://github.com/Gaboxqc)
