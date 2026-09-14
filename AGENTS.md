## Coding Rules (React / Next.js / TypeScript)

> Condensed from `React_-_Nextjs_PR_Review_Checklist.md` (project root), which has the full rule set with ❌/✅ code examples for every item — look up the rule number there when you need more detail. **[BLOCK]** = never violate; it breaks the build, security, or accessibility. **[WARN]** = follow by default; only deviate with an inline comment explaining why.
>
> This project is currently an early-stage Next.js App Router site with no shared API client, auth, i18n library, or `features/` folder structure yet. The rules below for those areas describe the convention to establish the moment you introduce that kind of code (e.g. the first HTTP call should go through a new shared client, not scattered `fetch`s).

### 1. Build & Lint
- **[BLOCK]** `npm run build` must complete with zero errors. (1.1)
- **[BLOCK]** `npm run lint` (`next lint`/`eslint`) must pass with zero errors; pre-existing unrelated warnings are OK. (1.2)
- **[BLOCK]** `tsc --noEmit` must be clean. (1.3)
- **[WARN]** Justify client bundle increases > 50 KB gzipped vs. the base branch. (1.4)

### 2. JavaScript / TypeScript Quality
- **[BLOCK]** No `eval()`. (2.1)
- **[BLOCK]** No `debugger` statements. (2.2)
- **[WARN]** No stray `console.log/debug/info/time/timeEnd` without a comment justifying it; `console.error`/`console.warn` are fine for genuine errors. (2.3 — see also 16.3, stricter for this project)
- **[BLOCK]** No `var` — use `const`/`let`. (2.4)
- **[WARN]** `const` for anything never reassigned; SCREAMING_SNAKE_CASE for true module-level constants/config/limits, camelCase for local values. (2.5)
- **[WARN]** Prefer `?.` optional chaining over the `!` non-null assertion. (2.6)
- **[BLOCK]** Strict equality only: `===` / `!==`. (2.7)
- **[BLOCK]** No shadowed variables (don't reuse an outer-scope name in an inner scope). (2.8)
- **[BLOCK]** No use-before-declare for `let`/`const` inside a function body. (2.9)
- **[WARN]** Don't introduce new `any`; if unavoidable, add `// any: <reason>`. (2.10)
- **[WARN]** Exported functions/components/hooks need explicit interfaces — no anonymous types or `any` in public signatures. (2.11)
- **[WARN]** Don't add type annotations TypeScript already infers from the initializer (e.g. `useState(false)`, not `useState<boolean>(false)`). (2.12)
- **[WARN]** Extract magic numbers with non-obvious meaning into named constants. (2.13)
- **[WARN]** Prefer `interface` for object/props shapes; use `type` for unions, intersections, or primitive aliases. (2.14)

### 3. React
- **[BLOCK]** Component names are PascalCase and match their file name. (3.1.1)
- **[WARN]** One primary component per file; small private subcomponents may be co-located, shared ones get their own file. (3.1.2)
- **[BLOCK]** Call hooks unconditionally at the top level only — never inside conditionals, loops, or nested functions. (3.1.3)
- **[BLOCK]** Only call hooks from components or `use*`-prefixed custom hooks. (3.1.4)
- **[WARN]** Type props via a named, exported interface, not an inline anonymous type. (3.1.5)
- **[WARN]** Default prop values via ES default parameters, not the legacy `defaultProps`. (3.1.6)
- **[WARN]** Don't pass new inline arrow functions/object literals to `React.memo`-wrapped children — wrap with `useCallback`/`useMemo`. (3.1.7)
- **[BLOCK]** Every `.map()`-rendered list needs a stable, unique key from the data — never the array index for lists that can reorder/filter/insert/remove. (3.1.8)
- **[WARN]** Only add `'use client'` where the file truly needs interactivity, browser APIs, or state/effect hooks. (3.1.9)
- **[BLOCK]** Never mutate state in place — always call the setter with a new value/updater function. (3.1.10)
- **[WARN]** Don't sync derived state via `useEffect` + `useState`; compute it inline during render. (3.1.11)
- **[WARN]** Keep a consistent order inside components: hooks → derived values → effects → event handlers → `return`/JSX. (3.1.12)
- **[WARN]** Split components once they exceed ~300 lines or mix data-fetching/layout/business logic — extract subcomponents and/or hooks. (3.1.13)

### 4. Data Fetching & API Layer
- **[BLOCK]** Route all HTTP calls through a shared/centralized API client, not ad-hoc `fetch`/`axios` calls scattered in components. (4.1)
- **[BLOCK]** Build request URLs from env config (`process.env.NEXT_PUBLIC_API_URL` or a server-only equivalent) — never hardcode absolute server URLs. (4.2)
- **[WARN]** Only add a local `try/catch` for feature-specific recovery (field-level message, fallback, retry); rely on the shared client/interceptor for the generic error case. (4.3)
- **[WARN]** Route Handlers (`app/api/**/route.ts`) and Server Actions must validate input (e.g. with `zod`) before touching a DB or external service. (4.4)
- **[WARN]** Never import server-only modules (DB clients, secrets) into a file marked `'use client'`. (4.5)
- **[WARN]** Feature-specific state belongs in its own hook/store slice, not in a shared/global context. (4.6)

### 5. Hooks & Memory Management
- **[BLOCK]** Any effect that adds a listener/subscription/timer must return a cleanup function that tears it down. (5.1)
- **[BLOCK]** Cancel in-flight fetches started in `useEffect` (via `AbortController` or an ignore flag) in the cleanup function. (5.2)
- **[WARN]** Remove unused imports. (5.3)
- **[WARN]** Prefer a data-fetching library (React Query/SWR) or a Server Component fetch over manual `useEffect` + `useState` for display data. (5.4)
- **[WARN]** Don't nest `.then()` chains inside an effect — extract a named async function and call it. (5.5)
- **[WARN]** Clear any `setTimeout`/`setInterval` in the effect's cleanup. (5.6)
- **[BLOCK]** `useEffect` dependency arrays must be exhaustive; disabling `react-hooks/exhaustive-deps` requires an inline comment explaining why it's safe. (5.7)

### 6. Routing (Next.js App Router)
- **[BLOCK]** Guard new authenticated route segments via middleware or a layout-level session check — never rely on the page component alone. (6.1)
- **[WARN]** Route segment folder names are kebab-case. (6.2)
- **[WARN]** Keep dynamic segment param names consistent across sibling routes (e.g. always `[proposalId]`, not mixed with `[id]`). (6.3)
- **[WARN]** Route segments that fetch data should ship `loading.tsx` and `error.tsx`. (6.4)

### 7. Styling
- **[BLOCK]** No static inline `style={{ ... }}` with hardcoded values — dynamic/computed style bindings are fine. (7.1)
- **[BLOCK]** No `!important` without a comment explaining which third-party style it overrides and why. (7.2)
- **[WARN]** Every class referenced in JSX must exist in that component's stylesheet or be a valid Tailwind utility. (7.3)
- **[WARN]** Co-locate component-specific styles in that component's own module file, not a global stylesheet. (7.4)
- **[WARN]** Don't repeat hard-coded design tokens (colors/spacing/font sizes) — use Tailwind theme tokens or CSS custom properties. (7.5)
- **[WARN]** No ID selectors in stylesheets — classes only. (7.6)
- **[BLOCK]** New style files must use the project's standardized extension consistently. (7.7)

### 8. JSX Templates
- **[BLOCK]** `dangerouslySetInnerHTML` requires sanitization (e.g. DOMPurify) plus an inline comment naming the reviewer who confirmed the source is safe. (8.1)
- **[WARN]** Components rendering async data must handle loading, empty, and error states. (8.2)
- **[WARN]** Extract complex inline conditionals/computed values in JSX to a named variable or helper above `return`. (8.3)
- **[BLOCK]** No direct DOM manipulation via `document.getElementById`/`querySelector` — use refs and state. (8.4)
- **[WARN]** No more than one level of nested ternary in JSX — extract to a variable, a lookup map, or a component. (8.5)

### 9. Security
- **[BLOCK]** Never commit secrets (API keys, passwords, tokens) — not even in comments or tracked `.env` files. (9.1)
- **[BLOCK]** `NEXT_PUBLIC_*` env vars must never hold secrets — they're inlined into the client bundle. (9.2)
- **[BLOCK]** Production config (`next.config.ts`, prod env files) must never disable security/type/lint checks (`ignoreBuildErrors`, `ignoreDuringBuilds`, disabled CSRF/auth, etc.). (9.3)
- **[BLOCK]** No tokens/PII in plain-text `localStorage`/`sessionStorage` — prefer HttpOnly cookies for auth tokens. (9.4)
- **[WARN]** Don't bypass the shared API client's auth/CSRF headers with a raw `fetch`/`axios` call. (9.5)

### 10. File & Folder Conventions
- **[WARN]** Feature folders under `features/`/`app/` are kebab-case. (10.1)
- **[WARN]** Components use `PascalCase.tsx`; hooks use `use-kebab-case.ts`; utilities use `kebab-case.ts`. (10.2)
- **[WARN]** A feature's components/hooks/types live inside that feature's own folder, not scattered under generic top-level folders. (10.3)
- **[WARN]** No loose files at the `app/`/`src/` root — put new files in a named feature folder, `shared/`, `components/`, or `lib/`. (10.4)
- **[WARN]** Use the project's `@/*` path alias instead of long relative imports; don't add a new alias without updating `tsconfig.json`. (10.5)

### 11. Code Hygiene
- **[WARN]** Follow Prettier/ESLint formatting: 2-space indentation (no tabs), single quotes for strings (double quotes in JSX attributes), required semicolons, ~100-char line length, no trailing whitespace, single trailing newline per file. (11.1–11.6)
- **[WARN]** Commented-out code needs a comment explaining why it's kept (temporary workaround, pending verification, etc.). (11.7)
- **[WARN]** `TODO`/`FIXME` comments must reference a tracking issue id. (11.8)

### 12. Commit & PR Hygiene
- **[WARN]** Commit messages start with the ticket ID, then a brief description. (12.1)
- **[WARN]** PR title is the ticket title (or close paraphrase), prefixed with the ticket number. (12.2)
- **[WARN]** PR description includes the ticket as a heading, its link, and a summary of the change. (12.3)
- **[WARN]** Keep one concern/ticket per PR — don't mix unrelated changes. (12.4)
- **[BLOCK]** Any `package.json` change must include the matching lockfile update in the same commit. (12.5)
- **[WARN]** Explain dependency additions/removals/upgrades in the PR description. (12.6)

### 13. Performance
- **[WARN]** Memoize deliberately — `React.memo`/`useMemo`/`useCallback` on components/computations that are genuinely expensive or re-render often with unchanged props, not everywhere. (13.1)
- **[WARN]** Never trigger data fetching inside a `.map()` loop or directly during render — fetch once (effect/loader/Server Component) and pass data down. (13.2)
- **[WARN]** Use `next/image` for images; don't add uncompressed assets over ~200 KB to `public/`. (13.3)
- **[WARN]** Comment any non-memoized, computationally heavy operation running in render to explain why memoization wasn't needed. (13.4)
- **[WARN]** Code-split large, non-critical client components with `next/dynamic` (rich text editors, charts, modals). (13.5)

### 14. Accessibility (WCAG 2.2)
- **[BLOCK]** Every `<img>` needs `alt` text (informational: descriptive text; decorative: `alt=""`). (14.1)
- **[BLOCK]** Every `<button>` needs `id`, `title`, and `aria-label`. (14.2)
- **[BLOCK]** Links/inputs without visible text need `aria-label`/`aria-labelledby`. (14.3)
- **[BLOCK]** Form controls need an associated `<label htmlFor>` — `aria-label` alone isn't enough when a visible label exists. (14.4)
- **[BLOCK]** Validation errors must be wired to their input via `aria-describedby` + `aria-invalid`. (14.5)
- **[BLOCK]** Status/toast messages need an `aria-live` region. (14.6)
- **[BLOCK]** Data tables need `<th scope="col"|"row">` headers and a `<caption>`. (14.7)
- **[BLOCK]** Modals must trap focus on open and return focus to the trigger element on close. (14.8)
- **[BLOCK]** Never gate auth/verification behind a cognitive test (e.g. image CAPTCHA) without an accessible alternative. (14.9)
- **[WARN]** `<div>`/`<span>` with `onClick` also needs `role`, `tabIndex={0}`, and `Enter`/`Space` keyboard handling. (14.10)
- **[WARN]** Text contrast ≥ 4.5:1 (normal) or 3:1 (large/bold ≥ 18pt/14pt). (14.11)
- **[WARN]** Touch/click targets ≥ 24×24 CSS px. (14.12)
- **[WARN]** Sticky headers/toolbars must not fully obscure a focused element (`scroll-padding-top`, etc.). (14.13)
- **[WARN]** Never remove the focus indicator (`outline: none`) without a compliant custom replacement (≥2px, ≥3:1 contrast) on `:focus-visible`. (14.14)
- **[WARN]** Drag interactions (reorder, resize) need a non-dragging click/keyboard alternative. (14.15)
- **[WARN]** Looping animations over 5s must be pausable or respect `prefers-reduced-motion`. (14.16)
- **[WARN]** Heading levels must be sequential (h1→h2→h3, never skipped) — use CSS for visual size, not heading level. (14.17)
- **[WARN]** Keep `<html lang="...">` set in `app/layout.tsx`. (14.18)

### 15. Internationalisation
- **[WARN]** Route new user-facing strings through the project's i18n library `t()` once one is introduced, instead of hardcoding text. (15.1)

### 16. Project-Specific
- **[BLOCK]** Normalize API/unexpected errors through a shared `parseError()` utility and a standardized `{ success, data, error }` response shape once such error handling exists — don't invent ad-hoc error shapes per call site. (16.1)
- **[WARN]** Keep files under ~500 lines; split into smaller components/hooks/modules once they grow past that. (16.2)
- **[BLOCK]** No `console.*` statements in production code paths, full stop (stricter than the general rule 2.3 above). (16.3)
