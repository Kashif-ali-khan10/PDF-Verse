const express = require('express');
const router = express.Router();
const multer = require('multer');
const PDFDocument = require('pdf-lib');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/delete-pages', upload.single('pdfFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    if (!req.body.pageNumbers) {
      return res.status(400).json({ error: 'Page numbers are required (comma-separated).' });
    }

    const pdfDoc = await PDFDocument.PDFDocument.load(req.file.buffer);
    const totalPages = pdfDoc.getPageCount();

    const pageNumbers = req.body.pageNumbers.split(',').map(Number).filter(n => n > 0 && n <= totalPages);
    
    if (pageNumbers.length === 0) {
      return res.status(400).json({ error: 'No valid page numbers provided.' });
    }

    pageNumbers.sort((a, b) => b - a);

    let numDeletedPages = 0;
    for (const pageNum of pageNumbers) {
      pdfDoc.removePage(pageNum - 1 - numDeletedPages);
      numDeletedPages++;
    }

    const pdfBytes = await pdfDoc.save();
    const base64Data = Buffer.from(pdfBytes).toString('base64');

    res.json({
      success: true,
      filename: 'modified.pdf',
      data: base64Data,
      mimeType: 'application/pdf',
      deletedPages: pageNumbers.length,
      remainingPages: totalPages - pageNumbers.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
});

module.exports = router;
