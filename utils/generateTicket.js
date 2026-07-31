const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const generateTicket = async (booking) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doc = new PDFDocument({
                size: [500, 700],
                margin: 30
            });

            const buffers = [];

            doc.on("data", (chunk) => buffers.push(chunk));

            doc.on("end", () => {
                resolve(Buffer.concat(buffers));
            });

            const event = booking.eventId;
            const user = booking.userId;

            const ticketNumber =
                "ET-" +
                new Date().getFullYear() +
                "-" +
                booking._id.toString().slice(-6).toUpperCase();

            const formattedDate = new Date(event.date).toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );

            // Header
            doc
                .roundedRect(0, 0, 500, 90, 0)
                .fill("#1E3A8A");

            doc
                .fillColor("white")
                .fontSize(24)
                .font("Helvetica-Bold")
                .text("🎟 ELITETICKETS", 0, 25, {
                    align: "center"
                });

            doc
                .fontSize(12)
                .font("Helvetica")
                .text("YOUR EVENT PASS", {
                    align: "center"
                });

            // Event Name
            doc
                .fillColor("#111827")
                .fontSize(20)
                .font("Helvetica-Bold")
                .text(event.title, 30, 120, {
                    align: "center"
                });

            // Divider
            doc
                .moveTo(30, 155)
                .lineTo(470, 155)
                .strokeColor("#D1D5DB")
                .stroke();

            let y = 180;

            doc.fontSize(13).font("Helvetica");

            doc.text(`👤 Name`, 40, y);
            doc.text(user.name, 180, y);

            y += 30;

            doc.text(`📧 Email`, 40, y);
            doc.text(user.email, 180, y);

            y += 30;

            doc.text(`📅 Date`, 40, y);
            doc.text(formattedDate, 180, y);

            y += 30;

            doc.text(`📍 Venue`, 40, y);
            doc.text(event.location, 180, y);

            y += 30;

            doc.text(`🎵 Category`, 40, y);
            doc.text(event.category, 180, y);

            y += 30;

            doc.text(`💰 Price`, 40, y);
            doc.text(`₹${event.ticketPrice}`, 180, y);

            y += 30;

            doc
                .font("Helvetica-Bold")
                .fillColor("#1E3A8A")
                .text("Ticket No", 40, y);

            doc.text(ticketNumber, 180, y);

            y += 40;

            // QR Code
            const qrData = `
Ticket: ${ticketNumber}
Booking: ${booking._id}
Name: ${user.name}
Event: ${event.title}
`;

            const qr = await QRCode.toDataURL(qrData);

            const qrImage = Buffer.from(
                qr.replace(/^data:image\/png;base64,/, ""),
                "base64"
            );

            doc.image(qrImage, 170, y, {
                width: 150
            });

            y += 170;

            doc
                .moveTo(30, y)
                .lineTo(470, y)
                .dash(5, {
                    space: 5
                })
                .stroke("#BDBDBD");

            y += 25;

            doc
                .undash()
                .fontSize(12)
                .fillColor("green")
                .font("Helvetica-Bold")
                .text("✔ Booking Confirmed", {
                    align: "center"
                });

            y += 25;

            doc
                .font("Helvetica")
                .fillColor("#555")
                .fontSize(10)
                .text(
                    "Please carry a valid Government ID.\nThis ticket is non-transferable.\nPowered by EliteTickets © 2026",
                    {
                        align: "center"
                    }
                );

            doc.end();
        } catch (err) {
            reject(err);
        }
    });
};

module.exports = generateTicket;