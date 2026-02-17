import { chromium } from "playwright";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import { PDFDocument } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Raíz del proyecto
const root = path.resolve(__dirname, "..");

// HTML fuente
const inputHtml = path.join(root, "src", "index.html");

// Carpeta output
const outDir = path.join(root, "out");
const outPdf = path.join(outDir, "portada.pdf");

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// A4 exacto (pt)
const A4_W = 595.2755906;
const A4_H = 841.8897638;

(async () => {
  // 1) Render con Chromium
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.emulateMedia({ media: "print" });
  await page.goto(`file://${inputHtml}`, { waitUntil: "load" });
  await page.evaluate(async () => {
    await document.fonts.ready;
  });

  await page.pdf({
    path: outPdf,
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: "0mm", right: "0mm", bottom: "0mm", left: "0mm" },
    scale: 1,
  });

  await browser.close();

  // 2) Normaliza boxes (esto es lo que elimina el “micro-scroll” en Preview/Acrobat)
  const bytes = fs.readFileSync(outPdf);
  const pdfDoc = await PDFDocument.load(bytes);

  for (const p of pdfDoc.getPages()) {
    // MediaBox
    p.setSize(A4_W, A4_H);
    // Crop/Trim/Bleed/Art
    p.setCropBox(0, 0, A4_W, A4_H);
    p.setTrimBox(0, 0, A4_W, A4_H);
    p.setBleedBox(0, 0, A4_W, A4_H);
    p.setArtBox(0, 0, A4_W, A4_H);
  }

  const outBytes = await pdfDoc.save({
    useObjectStreams: false, // más compatible con algunos visores
    updateFieldAppearances: false,
  });

  fs.writeFileSync(outPdf, outBytes);

  console.log("PDF generado (boxes A4 normalizadas) en:", outPdf);
})();
