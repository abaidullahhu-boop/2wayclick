<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Cursor Cloud specific instructions

- Install dependencies with `npm ci`. Start the app with `npm run dev -- --hostname 0.0.0.0 --port 3000`.
- Open the site at `http://localhost:3000`. Next.js 16 blocks development assets for `http://127.0.0.1:3000`, so client components, including the contact form, do not hydrate on that host.
- `RESEND_API_KEY` is optional locally. Without it, the contact form still succeeds and the dev server logs the enquiry. `npm run lint` and `npm run build` are the checks to run.
