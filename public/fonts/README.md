# Vayam Font Directory

Place your custom local font files in this directory (`public/fonts/`).

## Expected File Formats & Naming

You can drop `.woff2` or `.woff` font files directly into this directory.

### Primary Latin Font (e.g. Manrope, Plus Jakarta Sans, or custom Vayam font)
- `VayamFont-Regular.woff2` (Weight 400)
- `VayamFont-Medium.woff2` (Weight 500)
- `VayamFont-SemiBold.woff2` (Weight 600)
- `VayamFont-Bold.woff2` (Weight 700)
- `VayamFont-ExtraBold.woff2` (Weight 800)

### Devanagari Font (Hindi / Marathi)
- `VayamDevanagari-Regular.woff2`
- `VayamDevanagari-Medium.woff2`
- `VayamDevanagari-SemiBold.woff2`
- `VayamDevanagari-Bold.woff2`

## Automatic Loading

The Vayam CSS (`app/globals.css`) includes `@font-face` definitions that check for these local filenames with fallback to high-quality Google Fonts (`Plus Jakarta Sans` + `Noto Sans Devanagari`).

When font files are present in `public/fonts/`, the browser will automatically pick them up without needing to change any React components or Tailwind classes.
