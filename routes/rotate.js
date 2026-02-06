const express = require('express');
const router = express.Router();
const { degrees } = require('pdf-lib');
const { PDFDocument, rgb } = require('pdf-lib');
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/rotate-pdf-form', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }

    if (!req.body.rotationDirection) {
      return res.status(400).json({ error: 'Rotation direction is required (left, right, or upsideDown).' });
    }

    const rotationDirection = req.body.rotationDirection;
    let rotationDegrees = 0;

    switch (rotationDirection) {
      case 'left':
        rotationDegrees = 270;
        break;
      case 'right':
        rotationDegrees = 90;
        break;
      case 'upsideDown':
        rotationDegrees = 180;
        break;
      default:
        return res.status(400).json({ error: 'Invalid rotation direction. Use: left, right, or upsideDown.' });
    }

    const pdfDoc = await PDFDocument.load(req.file.buffer);

    const pages = pdfDoc.getPages();
    pages.forEach((page) => {
      page.setRotation(degrees(rotationDegrees));
    });

    const pdfBytes = await pdfDoc.save();
    const base64Data = Buffer.from(pdfBytes).toString('base64');

    res.json({
      success: true,
      filename: 'rotated.pdf',
      data: base64Data,
      mimeType: 'application/pdf',
      rotation: rotationDegrees
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error rotating PDF', details: err.message });
  }
});

  
module.exports = router;