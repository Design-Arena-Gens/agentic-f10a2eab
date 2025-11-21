# Machiavelli’s Secret — Narrative Transcript

A Next.js application that converts the YouTube video “Machiavelli’s Secret — When You Stop Chasing, They Start Kneeling” into a flowing, timestamp‑free narrative. The transcript is bundled with the site so it can be deployed as a fully static experience (ideal for Vercel).

## 🚀 Quick start

```bash
npm install
npm run generate:narrative   # rebuild narrative from transcript.vtt
npm run dev                  # start local dev server
```

Visit `http://localhost:3000` to read the narrative retelling.

## 📁 Key files

- `transcript.vtt` — raw WebVTT captions fetched from the YouTube video.
- `scripts/generateNarrative.mjs` — converts the VTT file into polished prose.
- `content/narrative.json` — generated narrative consumed by the Next.js app.
- `app/page.tsx` — renders the narrative with contextual metadata.

## 🔄 Updating the transcript

1. Replace `transcript.vtt` with a newer caption export.
2. Run `npm run generate:narrative` to regenerate `content/narrative.json`.
3. Commit and redeploy — the site will automatically serve the refreshed copy.

## 🧰 Tech stack

- [Next.js 14](https://nextjs.org/) with the App Router
- [React 18](https://react.dev/)
- TypeScript with strict mode

## 📦 Deployment

The project is optimized for [Vercel](https://vercel.com/). Build with `npm run build` and deploy using:

```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-f10a2eab
```

After deployment, verify the live site:

```bash
curl https://agentic-f10a2eab.vercel.app
```
