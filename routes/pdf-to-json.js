const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/convert-pdf-to-json', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    const fileBuffer = req.file.buffer;

    pdfParse(fileBuffer).then(function(data) {
        let jsonData;
        try {
            jsonData = JSON.parse(data.text);
        } catch (error) {
            jsonData = { text: data.text };
        }

        const jsonContent = JSON.stringify(jsonData, null, 4);
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `converted-${timestamp}.json`;
        const base64Data = Buffer.from(jsonContent, 'utf8').toString('base64');

        res.json({
            success: true,
            filename: filename,
            data: base64Data,
            mimeType: 'application/json',
            jsonData: jsonData
        });
    }).catch(function(error) {
        console.error("PDF parsing error: ", error);
        res.status(500).json({ error: 'Error processing PDF file.', details: error.message });
    });
});




function formatExtractedText(text) {
    let formattedText = text.replace(/\n\s*\n/g, '\n');

    
    try {
        let jsonObject = JSON.parse(formattedText);
        return JSON.stringify(jsonObject, null, 4);
    } catch (e) {
        return formattedText;
    }
}


module.exports = router;
