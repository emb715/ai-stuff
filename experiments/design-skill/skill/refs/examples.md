# Examples — Before and After for the Laws Agents Break Most

Original examples, written for this skill. Each pairs a law with the `taste.csv` rows that make it concrete, a ✗ version, a ✓ version, and one line on why. Snippets are minimal CSS/HTML, not full components.

Use these when building (copy the ✓ shape) and when reviewing (name the ✗ shape you found).

---

## D-14 Visual Hierarchy — type steps that read as steps
Rows: T-01, T-03
```css
/* ✗ six sizes, 1–2px apart */
h1{font-size:20px} h2{font-size:18px} h3{font-size:17px} p{font-size:16px} .meta{font-size:15px} .tiny{font-size:14px}
/* ✓ four sizes on a 1.25 scale, everything maps to one of them */
:root{--fs-sm:.8rem; --fs-base:1rem; --fs-lg:1.25rem; --fs-xl:1.563rem; --fs-2xl:1.953rem}
```
Why: a 1px step looks like a mistake. A ratio step looks like a decision.

## D-74 Highlighting — rare emphasis
Rows: C-09, T-10
```html
<!-- ✗ --> <p><b>Fast.</b> <mark>Secure.</mark> <b><mark>Free forever.</mark></b> <span class="badge">NEW</span></p>
<!-- ✓ --> <p>Fast and secure. <strong>Free forever.</strong></p>
```
Why: one emphasis per block is read. Three are skipped.

## D-30 Signal-to-Noise — the default "generated" surface
Rows: C-07, F-03, F-04
```css
/* ✗ */ .card{background:linear-gradient(135deg,#7c3aed,#db2777);border:2px solid #a78bfa;box-shadow:0 20px 40px rgba(0,0,0,.35)}
/* ✓ */ .card{background:var(--surface);border:1px solid var(--line)}
```
Why: gradient + border + heavy shadow are three separators doing one job.

## D-5 Gestalt Grouping — inner vs outer spacing
Rows: S-03
```css
/* ✗ everything 16px apart: label, input, next label all equidistant */
.field>*{margin-bottom:16px}
/* ✓ label hugs its input; fields separate from each other */
.field{display:grid;gap:6px} .form{display:grid;gap:24px}
```
Why: proximity is the grouping. Equal gaps erase it.

## D-13 PARC Repetition — one spacing scale
Rows: S-01, S-02
```css
/* ✗ */ .a{padding:13px 22px} .b{margin-top:7px} .c{gap:18px}
/* ✓ */ :root{--s1:4px;--s2:8px;--s3:16px;--s4:24px;--s5:40px;--s6:64px}
```
Why: a page with six spacing values looks designed. Fifteen values looks assembled.

## D-4 / D-80 Contrast and Legibility — "clean" is not "faint"
Rows: C-03, C-04
```css
/* ✗ */ body{color:#9ca3af;background:#fff}      /* 2.5:1 */
/* ✓ */ body{color:#1f2328;background:#fbfaf8}   /* ~15:1 */  .meta{color:#5b616b} /* ~6:1 */
```
Why: low-contrast body text is the commonest reason a minimal page is unreadable.

## D-93 Centered Text Penalty
Rows: T-09, L-04
```css
/* ✗ */ section p{text-align:center;max-width:none}
/* ✓ */ .hero h1,.hero .lede{text-align:center}  section p{text-align:start;max-width:65ch}
```
Why: centering a headline is fine. Centering a paragraph makes every line start somewhere new.

## D-49 Line Length
Rows: T-08
```css
/* ✗ */ .prose{width:100%}
/* ✓ */ .prose{max-width:65ch}
```

## D-16 Clickability + D-14 — one primary per view
Rows: H-01, H-02
```html
<!-- ✗ --> <button class="btn">Cancel</button> <button class="btn">Submit</button>
<!-- ✓ --> <button class="btn-ghost">Cancel</button> <button class="btn-primary">Create account</button>
```
Why: identical styling turns a one-click choice into a reading task.

## D-18 Fitts — target size
Rows: K-01
```css
/* ✗ */ .icon-btn{width:24px;height:24px}
/* ✓ */ .icon-btn{width:44px;height:44px;display:grid;place-items:center} /* icon stays 20px */
```

## D-9 Recognition over Recall — visible labels
Rows: K-02
```html
<!-- ✗ --> <input placeholder="Email">
<!-- ✓ --> <label for="email">Email</label> <input id="email" type="email" autocomplete="email">
```

## D-62 / D-86 Color plus a second channel
Rows: C-06
```html
<!-- ✗ --> <input class="border-red">
<!-- ✓ --> <input aria-invalid="true" aria-describedby="e1"> <p id="e1" class="error">⚠ Enter a valid email</p>
```

## D-90 Threat Detection — red means danger
Rows: C-05
```css
/* ✗ */ .note-secure{color:#dc2626;font-weight:700}   /* a reassurance styled as an error */
/* ✓ */ .note-secure{color:var(--text-muted)}
```

## D-26 Consistency — one radius scale
Rows: F-01, F-02
```css
/* ✗ */ .card{border-radius:22px} .btn{border-radius:6px} .input{border-radius:12px} .badge{border-radius:3px}
/* ✓ */ :root{--r-sm:4px;--r-md:8px;--r-lg:12px} .card{border-radius:var(--r-lg)} .btn,.input{border-radius:var(--r-md)}
```

## D-17 Reduction — no cards in cards
Rows: F-05
```html
<!-- ✗ --> <div class="card"><div class="card"><div class="card">Plan</div></div></div>
<!-- ✓ --> <section class="card"><h3>Plan</h3>…</section>
```

## D-67 Entry Point — the hero says one thing
Rows: L-02, W-01
```html
<!-- ✗ --> <h1>Unlock your potential</h1> <button>Start</button> <button>Demo</button> <button>Pricing</button>
<!-- ✓ --> <h1>Notes that keep up with your drafts</h1> <p class="lede">One line on who it is for.</p> <a class="btn-primary">Start writing</a>
```

## D-19 Feedback — designed states
Rows: K-04
```css
/* ✗ */ button:focus{outline:none}
/* ✓ */ button:focus-visible{outline:2px solid var(--accent);outline-offset:2px} button:disabled{opacity:.5;cursor:not-allowed}
```
