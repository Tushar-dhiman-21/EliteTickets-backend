const PDFDocument = require("pdfkit");

const generateTicket = (booking) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margin: 50
        });

        const buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", () => {
            resolve(Buffer.concat(buffers));
        });

        doc.fontSize(24)
            .text("EliteTickets", {
                align: "center"
            });

        doc.moveDown();

        doc.fontSize(18)
            .text("EVENT TICKET");

        doc.moveDown();

        doc.fontSize(14)
            .text(`Name: ${booking.userId.name}`);

        doc.text(`Email: ${booking.userId.email}`);

        doc.text(`Event: ${booking.eventId.title}`);

        doc.text(`Booking ID: ${booking._id}`);

        doc.text(`Status: ${booking.status}`);

        doc.text(`Payment: ${booking.paymentStatus}`);

        doc.moveDown();

        doc.text("Please carry this ticket with a valid ID proof.");

        doc.end();
    });
};

module.exports = generateTicket;