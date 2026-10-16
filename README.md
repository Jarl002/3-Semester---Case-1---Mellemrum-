# Mellemrum

Mellemrum er en lokal kultur- og eventplatform for Aarhus. Brugere kan opdage og tilmelde sig koncerter, talks og workshops; arrangører kan dele events og se tilmeldinger via en intern oversigt.

Projektet startede som en React-prototype udleveret til Case 1 i Product Optimization. Det er siden blevet auditeret og videreudviklet gennem 11 dokumenterede forbedringer, fordelt på afgrænsede feature branches — se [`DOKUMENTATION.md`](DOKUMENTATION.md) for den fulde audit, datamodel-beskrivelse og refleksion.

[Deployet løsning](https://jarl002.github.io/3-Semester---Case-1---Mellemrum-/)

## Kør lokalt

```bash
npm install
cp .env.example .env   # udfyld med din egen Supabase API URL og publishable key
npm run dev
```

> Vil du sætte et helt nyt Mellemrum-projekt op fra bunden (nyt Supabase-projekt, startdata osv.), findes den originale opsætningsguide i [lærerens skabelon-repo](https://github.com/cederdorff/mellemrum).

## Ruter

- `/` – eventoversigt
- `/events/:eventId` – eventdetalje og tilmelding
- `/om` – om Mellemrum
- `/tilmeldinger` – internt overblik

## Datamodel

`venues` → `events` → `registrations`, forbundet via `venueId`/`eventId`-fremmednøgler. Se [`DOKUMENTATION.md`](DOKUMENTATION.md#den-forbedrede-datamodel) for den fulde beskrivelse.

## Deploy

Projektet deployer automatisk til GitHub Pages ved push til `main`, via GitHub Actions-workflowet i `.github/workflows/`. `VITE_SUPABASE_URL` og `VITE_SUPABASE_APIKEY` skal være sat som Environment variables i GitHub Environment `github-pages-deployment`.

## Arbejdsform

Én sammenhængende forbedring ad gangen i en tydeligt navngivet feature branch. Forståelige commits, verificeret ændring, merge til `main` — ikke direkte arbejde på `main`.

## Scripts

```bash
npm run dev
npm run lint
npm run build
npm run preview
```
