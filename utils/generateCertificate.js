const PDFDocument = require("pdfkit");

function generateCertificate(res, courseName, userName) {
    const doc = new PDFDocument({ layout: "landscape", size: "A4", margin: 0 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="certificate.pdf"`);
    doc.pipe(res);

    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const primaryColor = "#1a3a5c";
    const accentColor = "#c9a227";

    doc.rect(0, 0, pageWidth, pageHeight).fill("#fdfcf8");

    doc.rect(24, 24, pageWidth - 48, pageHeight - 48)
       .lineWidth(2)
       .strokeColor(primaryColor)
       .stroke();

    doc.rect(34, 34, pageWidth - 68, pageHeight - 68)
       .lineWidth(1)
       .strokeColor(accentColor)
       .stroke();

    // --- Corner ornaments (simple diamond accents) ---
    const corners = [
        [24, 24], [pageWidth - 24, 24],
        [24, pageHeight - 24], [pageWidth - 24, pageHeight - 24]
    ];
    corners.forEach(([x, y]) => {
        doc.circle(x, y, 5).fill(accentColor);
    });

    // --- Header eyebrow text ---
    doc.fontSize(11)
       .fillColor(accentColor)
       .font("Helvetica")
       .text("S K I L L B U Z Z   A I", 0, 65, { align: "center", characterSpacing: 2 });

    // --- Main title ---
    doc.fontSize(38)
       .fillColor(primaryColor)
       .font("Times-Bold")
       .text("Certificate of Completion", 0, 90, { align: "center" });

    // --- Decorative line under title ---
    const lineY = 145;
    doc.moveTo(pageWidth / 2 - 90, lineY)
       .lineTo(pageWidth / 2 + 90, lineY)
       .lineWidth(1.5)
       .strokeColor(accentColor)
       .stroke();
    doc.circle(pageWidth / 2, lineY, 3).fill(accentColor);

    // --- "This certifies that" ---
    doc.fontSize(14)
       .fillColor("#555")
       .font("Helvetica-Oblique")
       .text("This certifies that", 0, 175, { align: "center" });

    // --- Recipient name ---
    doc.fontSize(32)
       .fillColor(primaryColor)
       .font("Times-BoldItalic")
       .text(userName, 0, 200, { align: "center" });

    // --- Underline beneath name ---
    const nameWidth = doc.widthOfString(userName, { font: "Times-BoldItalic", fontSize: 32 });
    doc.moveTo(pageWidth / 2 - nameWidth / 2 - 20, 245)
       .lineTo(pageWidth / 2 + nameWidth / 2 + 20, 245)
       .lineWidth(0.75)
       .strokeColor("#999")
       .stroke();

    // --- Completion text ---
    doc.fontSize(14)
       .fillColor("#555")
       .font("Helvetica-Oblique")
       .text("has successfully completed the course", 0, 260, { align: "center" });

    // --- Course name ---
    doc.fontSize(22)
       .fillColor(primaryColor)
       .font("Helvetica-Bold")
       .text(`"${courseName}"`, 60, 290, { align: "center", width: pageWidth - 120 });

    // --- Footer section: date, signature, seal ---
    const footerY = pageHeight - 130;

    // Date (left)
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });
    doc.moveTo(90, footerY).lineTo(260, footerY).lineWidth(0.75).strokeColor("#999").stroke();
    doc.fontSize(11).fillColor("#333").font("Helvetica-Bold")
       .text(today, 90, footerY + 6, { width: 170, align: "center" });
    doc.fontSize(10).fillColor("#888").font("Helvetica")
       .text("Date Issued", 90, footerY + 22, { width: 170, align: "center" });

    // Seal (center) — simple circular badge
    const sealX = pageWidth / 2;
    const sealY = footerY - 10;
    doc.circle(sealX, sealY, 32).lineWidth(2).strokeColor(accentColor).stroke();
    doc.circle(sealX, sealY, 26).lineWidth(1).strokeColor(accentColor).stroke();
    doc.fontSize(9).fillColor(accentColor).font("Helvetica-Bold")
       .text("VERIFIED", sealX - 30, sealY - 10, { width: 60, align: "center" });
    doc.fontSize(16).fillColor(accentColor).font("Helvetica-Bold")
       .text("✓", sealX - 30, sealY + 2, { width: 60, align: "center" });

    // Signature (right)
    doc.moveTo(pageWidth - 260, footerY).lineTo(pageWidth - 90, footerY).lineWidth(0.75).strokeColor("#999").stroke();
    doc.fontSize(16).fillColor(primaryColor).font("Times-Italic")
       .text("SkillBuzz AI", pageWidth - 260, footerY - 20, { width: 170, align: "center" });
    doc.fontSize(10).fillColor("#888").font("Helvetica")
       .text("Authorized Signature", pageWidth - 260, footerY + 6, { width: 170, align: "center" });

    doc.end();
}

module.exports = generateCertificate;