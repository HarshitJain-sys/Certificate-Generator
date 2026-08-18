import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { CERT_WIDTH, CERT_HEIGHT } from "../components/CertificateTemplate";

const EXPORT_SCALE = 4; // native size is 720x540, so render at 4x (2880x2160) for crisp downloads

async function renderToCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  await document.fonts.ready; // wait for Google Fonts (Balthazar, EB Garamond, Poppins) to fully load

  // Wait for every image inside the certificate (logos, signatures, QR) to
  // finish decoding before we snapshot it, so nothing is captured half-drawn.
  const images = Array.from(node.querySelectorAll("img"));
  await Promise.all(
    images.map((img) =>
      img.complete
        ? img.decode().catch(() => undefined)
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  );

  return html2canvas(node, {
    scale: EXPORT_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
    onclone: (_clonedDoc: Document, clonedNode: HTMLElement) => {
      // CertificatePreview wraps this node in a `transform: scale(...)`
      // parent (to fit the on-screen panel width) inside an
      // `overflow: hidden` grandparent. html2canvas mis-maps position/
      // clipping against that live transform, which is what produced the
      // overlapping/duplicated/shifted export. Neutralize both in the
      // clone only, so the snapshot renders at native 720x540 — the same
      // markup that's already correct on screen, just untransformed.
      const scaledParent = clonedNode.parentElement as HTMLElement | null;
      if (scaledParent) {
        scaledParent.style.transform = "none";
        scaledParent.style.width = `${CERT_WIDTH}px`;
        scaledParent.style.height = `${CERT_HEIGHT}px`;
      }
      const clippingGrandparent = scaledParent?.parentElement as HTMLElement | null;
      if (clippingGrandparent) {
        clippingGrandparent.style.overflow = "visible";
        clippingGrandparent.style.width = `${CERT_WIDTH}px`;
        clippingGrandparent.style.height = `${CERT_HEIGHT}px`;
      }
    },
  });
}

function slugify(name: string): string {
  return (
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "certificate"
  );
}

export async function exportToPng(node: HTMLElement, fileName: string): Promise<void> {
  const canvas = await renderToCanvas(node);
  const link = document.createElement("a");
  link.download = `${slugify(fileName)}-certificate.png`;
  link.href = canvas.toDataURL("image/png", 1.0);
  link.click();
}

export async function exportToPdf(node: HTMLElement, fileName: string): Promise<void> {
  const canvas = await renderToCanvas(node);
  const imgData = canvas.toDataURL("image/png", 1.0);

  const isLandscape = canvas.width >= canvas.height;
  const pdf = new jsPDF({
    orientation: isLandscape ? "landscape" : "portrait",
    unit: "px",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  pdf.save(`${slugify(fileName)}-certificate.pdf`);
}

export async function printCertificate(node: HTMLElement): Promise<void> {
  const canvas = await renderToCanvas(node);
  const imgData = canvas.toDataURL("image/png", 1.0);

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  printWindow.document.write(`
    <!doctype html>
    <html>
      <head>
        <title>Print Certificate</title>
        <style>
          @page { margin: 0; }
          html, body { margin: 0; padding: 0; }
          img { width: 100%; height: auto; display: block; }
        </style>
      </head>
      <body>
        <img src="${imgData}" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
}
