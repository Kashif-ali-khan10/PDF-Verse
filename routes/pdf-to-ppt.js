const express = require('express');
const multer = require('multer');
const officegen = require('officegen');
const pdfParse = require('pdf-parse');

const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();

router.post('/ppt-convert', upload.single('file'), async (req, res) => {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Please upload a valid PDF file.' });
  }

  try {
    const pdfBuffer = req.file.buffer;
    const pdfDocument = await pdfParse(pdfBuffer);

    const pptx = officegen('pptx');

    const pages = pdfDocument.text.split(/\f/);

    pages.forEach((pageText) => {
      let slide = pptx.makeNewSlide();
      slide.addText(pageText, { x: 0, y: 0, w: '100%', h: '100%' });
    });

    pptx.generate({
      'type': 'nodebuffer'
    }, function(err, buffer) {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'An error occurred while processing the PDF file.', details: err.message });
      }
      
      const base64Data = buffer.toString('base64');
      res.json({
        success: true,
        filename: 'output.pptx',
        data: base64Data,
        mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        slideCount: pages.length
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while processing the PDF file.', details: err.message });
  }
});

module.exports = router;
