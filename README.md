# ÚNICO — Condicionados (MVP PDF)

Repositorio mínimo para generar el PDF de “Condicionados” (A4) a partir de HTML/CSS usando Playwright + Chromium.

## Requisitos

- Node.js 18+ (recomendado 20 LTS)
- npm 9+
- macOS / Linux / Windows
- Acceso a descargar dependencias (incluye Chromium de Playwright)

## Estructura

- `src/index.html`
  Página única A4 (MVP) con el layout final.
- `src/print.css`
  CSS de impresión.
- `src/assets/*`
  SVGs (logo, watermark, etc.).
- `src/fonts/*`
  Fuentes locales (OTF).
- `render/render.mjs`
  Script de render: abre `src/index.html` en Chromium, exporta PDF y normaliza boxes a A4.
- `out/*.pdf`
  Salida (generada).

## Instalación

```bash
npm install
npx playwright install --with-deps chromium
```

## Generar el PDF
```bash
npm run pdf
```

### Salida
El PDF generado se guarda en `out/*.pdf`