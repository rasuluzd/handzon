/**
 * Genererer en faktisk kvittering-PDF (ikke en utskrift av siden).
 * jsPDF lastes dynamisk i klikk-handleren, så det ikke tynger hovedbundelen.
 * I produksjon hentes den offisielle PDF-kvitteringen fra Avio POS/ED (FR-4.3);
 * denne genereres lokalt for demoen.
 */

export interface ReceiptLine {
  label: string;
  amount: string;
  /** Marineblå (f.eks. kundeklubb-rabatt). */
  accent?: boolean;
}

export interface ReceiptData {
  reference: string;
  sellerName: string;
  orgNr: string;
  address: string;
  branchName: string;
  when: string;
  regNr: string;
  vehicle: string;
  lines: ReceiptLine[];
  vat: string;
  total: string;
  issuedAt: string;
}

const NAVY = { r: 30, g: 58, b: 112 };
const INK = { r: 22, g: 34, b: 58 };
const MUTED = { r: 115, g: 123, b: 138 };
const LINE = { r: 218, g: 222, b: 229 };

export async function downloadReceiptPdf(data: ReceiptData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = 210;
  const margin = 18;
  const right = pageWidth - margin;

  // Marineblå topplinje
  doc.setFillColor(NAVY.r, NAVY.g, NAVY.b);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(19);
  doc.text("Handz On Auto Care", margin, 16);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(183, 198, 228);
  doc.setFontSize(11);
  doc.text("KVITTERING", right, 14, { align: "right" });
  doc.setTextColor(214, 224, 241);
  doc.setFontSize(12);
  doc.text(data.reference, right, 22, { align: "right" });

  let y = 48;

  // Selger
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(data.sellerName, margin, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.text(`Org.nr ${data.orgNr}`, margin, y);
  y += 5;
  doc.text(data.address, margin, y);
  y += 5;
  doc.text(`Utstedt ${data.issuedAt}`, margin, y);

  // Ordredetaljer (høyre kolonne)
  let yr = 48;
  const labelX = right - 62;
  const rows: Array<[string, string]> = [
    ["Avdeling", data.branchName],
    ["Tidspunkt", data.when],
    ["Bil", `${data.vehicle}`.trim() || "—"],
    ["Reg.nr", data.regNr],
  ];
  doc.setFontSize(10);
  rows.forEach(([label, value]) => {
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(label, labelX, yr);
    doc.setTextColor(INK.r, INK.g, INK.b);
    doc.text(value, right, yr, { align: "right" });
    yr += 5.5;
  });

  y = Math.max(y, yr) + 10;

  // Linjeposter
  doc.setDrawColor(LINE.r, LINE.g, LINE.b);
  doc.line(margin, y, right, y);
  y += 8;
  doc.setFontSize(11);
  data.lines.forEach((line) => {
    doc.setFont("helvetica", "normal");
    if (line.accent) doc.setTextColor(NAVY.r, NAVY.g, NAVY.b);
    else doc.setTextColor(INK.r, INK.g, INK.b);
    doc.text(line.label, margin, y);
    doc.text(line.amount, right, y, { align: "right" });
    y += 7;
  });

  y += 1;
  doc.line(margin, y, right, y);
  y += 7;

  // Mva
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  doc.setFontSize(10);
  doc.text("Herav mva. (25 %)", margin, y);
  doc.text(data.vat, right, y, { align: "right" });
  y += 10;

  // Totalt
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text("Å betale ved henting", margin, y);
  doc.setFontSize(17);
  doc.text(data.total, right, y, { align: "right" });
  y += 16;

  // Fotnote
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
  const note =
    "Betaling skjer ved henting av bilen. Kvitteringen oppbevares i minimum 6 år i tråd med bokføringsloven og er tilgjengelig på Min side etter utført behandling.";
  doc.text(doc.splitTextToSize(note, pageWidth - margin * 2), margin, y);

  doc.save(`kvittering-${data.reference}.pdf`);
}
