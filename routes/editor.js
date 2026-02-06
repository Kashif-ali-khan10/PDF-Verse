const express = require('express');
const multer = require('multer');
const router = express.Router();

const { PDFDocument } = require('pdf-lib');

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/editor', upload.single('pdf'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Please select a PDF file to upload.' });
  }

  try {
    const pdfDoc = await PDFDocument.load(req.file.buffer);
    const numPages = pdfDoc.getPageCount();
    const base64Data = req.file.buffer.toString('base64');

    res.json({
      success: true,
      filename: req.file.originalname || 'document.pdf',
      data: base64Data,
      mimeType: 'application/pdf',
      pageCount: numPages
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Error loading PDF file: ${err.message}` });
  }
});

module.exports = router;
