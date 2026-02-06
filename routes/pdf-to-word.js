const express = require('express');
const router = express.Router();
const pdfParse = require('pdf-parse');
const officegen = require('officegen');
const multer  = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

router.post('/convert', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
    }

    try {
        let pdfBuffer = req.file.buffer;
        let dataBuffer = await pdfParse(pdfBuffer);

        let docx = officegen('docx');
        let chunks = [];
      
        docx.on('error', function(err) {
            console.error('Error creating Word document:', err);
            if (!res.headersSent) {
                res.status(500).json({ error: 'Error creating Word document.' });
            }
        });

        docx.on('finalize', function(written) {
            console.log('Finish to create Word file.\nTotal bytes created: ' + written + '\n');
        });

        docx.createP().addText(dataBuffer.text);

        docx.generate({
            'type': 'nodebuffer'
        }, function(err, buffer) {
            if (err) {
                console.error('Error generating Word document:', err);
                return res.status(500).json({ error: 'Error generating Word document.' });
            }
            
            const base64Data = buffer.toString('base64');
            res.json({
                success: true,
                filename: 'output.docx',
                data: base64Data,
                mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
        });
    } catch (error) {
        console.error('PDF to Word conversion error:', error);
        res.status(500).json({ error: 'Error converting PDF to Word.', details: error.message });
    }
});

module.exports = router;
