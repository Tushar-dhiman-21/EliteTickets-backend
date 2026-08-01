const PDFDocument = require("pdfkit");

const generateTicket = (booking) => {
    return new Promise((resolve, reject) => {

        const doc = new PDFDocument({
            size: [500, 650],
            margin: 0
        });

        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        // Background
        doc.rect(0, 0, 500, 700).fill("#F5F7FB");


        // ================= HEADER =================

doc.roundedRect(20, 20, 460, 120, 20)
    .fill("#312E81");

// Brand
doc.fillColor("white")
    .font("Helvetica-Bold")
    .fontSize(28)
    .text("ELITETICKETS", 0, 45, {
        align: "center"
    });

// Tagline
doc.font("Helvetica")
    .fontSize(12)
    .fillColor("#D1D5DB")
    .text("YOUR EVENT. YOUR EXPERIENCE.", 0, 82, {
        align: "center"
    });

// White Divider
doc.moveTo(150, 108)
    .lineTo(350, 108)
    .strokeColor("#FFFFFF")
    .lineWidth(1)
    .stroke();

        doc.end();
    });
};

module.exports = generateTicket;