const express = require('express');
const multer = require('multer');
const pdf2img = require('pdf-img-convert-web');
const JSZip = require('jszip');
const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post('/tiff-convert', upload.single('file'), async (req, res) => {
  if (!req.file || req.file.mimetype !== 'application/pdf') {
    return res.status(400).json({ error: 'Please upload a valid PDF file.' });
  }

  try {
    const pdfBuffer = req.file.buffer;

    // Convert PDF to images (TIFF format)
    const outputImages = await pdf2img.convert(pdfBuffer, {
      width: 800,
      base64: true,
    });

    // Create a zip file containing the images
    const zip = new JSZip();

    outputImages.forEach((img, i) => {
      let imageData = img;
      if (typeof img === 'string' && img.includes('base64,')) {
        imageData = img.split('base64,')[1];
      }
      zip.file(`output${i}.tiff`, imageData, { base64: true });
    });

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    const base64Data = zipBuffer.toString('base64');

    res.json({
      success: true,
      filename: 'images.zip',
      data: base64Data,
      mimeType: 'application/zip',
      pageCount: outputImages.length
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'An error occurred while processing the PDF file.', details: err.message });
  }
});

module.exports = router;
