const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const router = express.Router();
const pdfParse = require('pdf-parse');

router.post('/convert-pdf-to-txt', upload.single('pdf'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        const dataBuffer = req.file.buffer;
        const data = await pdfParse(dataBuffer);
        const base64Data = Buffer.from(data.text, 'utf8').toString('base64');
        
        res.json({
            success: true,
            filename: 'converted.txt',
            data: base64Data,
            mimeType: 'text/plain',
            text: data.text
        });
    } catch (error) {
        console.error("PDF parsing error: ", error);
        res.status(500).json({ error: 'Error converting PDF to text.', details: error.message });
    }
});

module.exports = router;
