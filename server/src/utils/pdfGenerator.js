import PDFDocument from 'pdfkit';

export function generateInvoicePdf(paymentData) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      let buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'right' });
      doc.fontSize(10).text('Your Company Name', 50, 50);
      doc.text('123 Legal Street, City', 50, 65);
      doc.text('contact@yourdomain.com', 50, 80);

      doc.moveDown();

      // Customer Info
      const top = 120;
      doc.fontSize(10).text(`Billed To:`, 50, top);
      doc.font('Helvetica-Bold').text(paymentData.customerName, 50, top + 15);
      doc.font('Helvetica').text(paymentData.customerEmail, 50, top + 30);
      if (paymentData.customerPhone) {
        doc.text(paymentData.customerPhone, 50, top + 45);
      }

      // Invoice Details
      doc.text(`Invoice No: ${paymentData.id}`, 350, top);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 350, top + 15);
      doc.text(`Status: Paid (${paymentData.status})`, 350, top + 30);

      doc.moveDown(4);

      // Table Header
      const tableTop = 230;
      doc.font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('Amount', 450, tableTop, { align: 'right' });
      
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      
      // Table Row
      doc.font('Helvetica');
      doc.text(paymentData.serviceName, 50, tableTop + 30);
      doc.text(`Rs. ${paymentData.amount}`, 450, tableTop + 30, { align: 'right' });
      
      doc.moveTo(50, tableTop + 50).lineTo(550, tableTop + 50).stroke();

      // Total
      doc.font('Helvetica-Bold');
      doc.text('Total Paid:', 350, tableTop + 70);
      doc.text(`Rs. ${paymentData.amount}`, 450, tableTop + 70, { align: 'right' });

      doc.moveDown(4);
      doc.font('Helvetica').fontSize(10).text('Thank you for choosing Your Company Name!', 50, 600, { align: 'center' });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}
