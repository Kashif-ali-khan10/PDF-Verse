const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/merge', upload.array('pdfs'), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No PDF files uploaded.' });
    }

    const pdfs = req.files.map((file) => file.buffer);
    const mergedPdf = await mergePdfs(pdfs);

    const base64Data = Buffer.from(mergedPdf).toString('base64');
    
    res.json({
      success: true,
      filename: 'merged.pdf',
      data: base64Data,
      mimeType: 'application/pdf',
      fileCount: req.files.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while merging the PDFs', details: err.message });
  }
});

async function mergePdfs(pdfs) {
  const mergedPdf = await PDFDocument.create();
  for (const pdf of pdfs) {
    const sourcePdf = await PDFDocument.load(pdf);
    const pages = await mergedPdf.copyPages(sourcePdf, sourcePdf.getPageIndices());
    for (const page of pages) {
      mergedPdf.addPage(page);
    }
  }
  return mergedPdf.save();
}

module.exports = router;
