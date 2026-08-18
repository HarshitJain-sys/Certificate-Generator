import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const EXPORT_SCALE = 4; // native size is 720x540, so render at 4x (2880x2160) for crisp downloads

async function renderToCanvas(node: HTMLElement): Promise<HTMLCanvasElement> {
  await document.fonts.ready; // wait for Google Fonts (Balthazar, EB Garamond, Poppins) to fully load
  return html2canvas(node, {
    scale: EXPORT_SCALE,
    useCORS: true,
    backgroundColor: "#ffffff",
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
