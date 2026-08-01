const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const generateTicket = (booking) => {
    return new Promise(async (resolve, reject) => {
  try {

        if (!booking || !booking._id || !booking.eventId || !booking.userId) {
            throw new Error("A booking with populated eventId and userId is required");
        }

        const event = booking.eventId;
        const user = booking.userId;

        const doc = new PDFDocument({
            size: [720, 320],
            margin: 0
        });

        const buffers = [];

        doc.on("data", (chunk) => buffers.push(chunk));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        doc.on("error", reject);

        // Background
        doc.rect(0, 0, 720, 320)
            .fill("#F4F6FB");


        // Main Ticket
        doc.roundedRect(20, 20, 680, 280, 18)
            .fill("#FFFFFF");

        // Right  Section
        doc.rect(540, 20, 160, 280)
            .fill("#1E293B");

        // Dashed Cut Line
        doc.moveTo(540, 20)
            .lineTo(540, 300)
            .dash(5, { space: 5 })
            .stroke("#BDBDBD");

        doc.undash();

        // Cut Holes
        doc.circle(540, 20, 12).fill("#F4F6FB");
        doc.circle(540, 300, 12).fill("#F4F6FB");

        doc.fillColor("#1E293B")
            .font("Helvetica-Bold")
            .fontSize(34)
            .text(event.title, 50, 42, {
                width: 460
            });

        const date = new Date(event.date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });

        doc.fillColor("#6B7280")
   .font("Helvetica")
   .fontSize(18)
   .text(date,50,90);

        // Divider
        doc.moveTo(50, 122)
            .lineTo(500, 122)
            .strokeColor("#E5E7EB")
            .lineWidth(1)
            .stroke();
        doc.roundedRect(50, 132, 90, 24, 12)
            .fill("#EEF2FF");

        doc.fillColor("#4F46E5")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                event.category.toUpperCase(),
                50,
                139,
                {
                    width: 90,
                    align: "center"
                }
            );


        doc.roundedRect(155, 132, 70, 24, 12)
            .fill("#DCFCE7");

        doc.fillColor("#166534")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                "Rs " + event.ticketPrice,
                155,
                139,
                {
                    width: 70,
                    align: "center"
                }
            );


        doc.roundedRect(240, 132, 90, 24, 12)
            .fill("#FEF3C7");

        doc.fillColor("#B45309")
            .font("Helvetica-Bold")
            .fontSize(10)
            .text(
                "VERIFIED",
                240,
                139,
                {
                    width: 90,
                    align: "center"
                }
            );




        // Holder Card
        doc.roundedRect(50, 175, 220, 70, 12)
            .fill("#F3F4F6");

        doc.fillColor("#6B7280")
            .font("Helvetica")
            .fontSize(10)
            .text("TICKET HOLDER", 65, 188);

        doc.fillColor("#1E293B")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text(user.name, 65, 208);

        doc.font("Helvetica")
            .fontSize(10)
            .fillColor("#6B7280")
            .text(user.email, 65, 228, {
                width: 190
            });


        // Venue Card
        doc.roundedRect(290, 175, 220, 70, 12)
            .fill("#F3F4F6");

        doc.fillColor("#6B7280")
            .font("Helvetica")
            .fontSize(10)
            .text("VENUE", 305, 188);

        doc.fillColor("#1E293B")
            .font("Helvetica-Bold")
            .fontSize(14)
            .text(event.location, 305, 208, {
                width: 190
            });

        const ticketNumber =
            "ET-" +
            new Date().getFullYear() +
            "-" +
            booking._id.toString().slice(-6).toUpperCase();

        doc.fillColor("#6B7280")
            .font("Helvetica")
            .fontSize(10)
            .text("TICKET NUMBER", 50, 262);

        doc.fillColor("#4F46E5")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text(ticketNumber, 50, 278);
        // EliteTickets
        doc.fillColor("#FFFFFF")
            .font("Helvetica-Bold")
            .fontSize(16)
            .text("ELITE", 570, 40, {
                width: 100,
                align: "center"
            });

        doc.fontSize(16)
            .text("TICKETS", 570, 62, {
                width: 100,
                align: "center"
            });

        //  Badge
        doc.roundedRect(570, 105, 100, 28, 14)
            .fill("#FBBF24");

        doc.fillColor("#1E293B")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(" PASS", 570, 113, {
                width: 100,
                align: "center"
            });

        const qrData = JSON.stringify({
            ticket: ticketNumber,
            booking: booking._id,
            name: user.name,
            event: event.title
        });

        const qr = await QRCode.toDataURL(qrData);

        const qrImage = Buffer.from(
            qr.replace(/^data:image\/png;base64,/, ""),
            "base64"
        );

   doc.roundedRect(572,148,106,106,10)
   .fill("#FFFFFF");

doc.roundedRect(572,148,106,106,10)
   .lineWidth(1)
   .strokeColor("#E5E7EB")
   .stroke();

doc.image(qrImage,578,154,{
    width:94
});

        doc.fillColor("#FFFFFF")
            .font("Helvetica")
            .fontSize(9)
            .text("SCAN TO ENTER", 570, 245, {
                width: 100,
                align: "center"
            });
        doc.fillColor("#9CA3AF")
            .fontSize(8)
            .text(ticketNumber, 565, 270, {
                width: 110,
                align: "center"
            });
        doc.end();


    } catch (err) {
        reject(err);
    }

    });
};

module.exports = generateTicket;