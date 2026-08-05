const PDFDocument = require("pdfkit");

function generateCertificate(res, courseName, userName) {
    const doc = new PDFDocument({ layout: "landscape", size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="certificate.pdf"`);

    doc.pipe(res);

    // Border
    doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40)
       .lineWidth(3)
       .strokeColor("#6a5af9")
       .stroke();

    // Title
    doc.fontSize(36)
       .fillColor("#333")
       .font("Helvetica-Bold")
       .text("Certificate of Completion", 0, 100, { align: "center" });

    // Subtitle
    doc.fontSize(16)
       .fillColor("#666")
       .font("Helvetica")
       .text("This certifies that", 0, 170, { align: "center" });

    // User name
    doc.fontSize(28)
       .fillColor("#6a5af9")
       .font("Helvetica-Bold")
       .text(userName, 0, 200, { align: "center" });

    // Course completion text
    doc.fontSize(16)
       .fillColor("#666")
       .font("Helvetica")
       .text("has successfully completed the course", 0, 250, { align: "center" });

    // Course name
    doc.fontSize(24)
       .fillColor("#333")
       .font("Helvetica-Bold")
       .text(courseName, 0, 285, { align: "center" });

    // Date
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric", month: "long", day: "numeric"
    });
    doc.fontSize(12)
       .fillColor("#999")
       .font("Helvetica")
       .text(`Issued on ${today}`, 0, 350, { align: "center" });

    // Footer branding
    doc.fontSize(14)
       .fillColor("#6a5af9")
       .font("Helvetica-Bold")
       .text("SkillBuzz AI", 0, doc.page.height - 80, { align: "center" });

    doc.end();
}

module.exports = generateCertificate;