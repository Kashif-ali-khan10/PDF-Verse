const express = require('express');
const router = express.Router();
const { PDFDocument } = require('pdf-lib');
const multer = require('multer');
const JSZip = require('jszip');

const upload = multer({ storage: multer.memoryStorage() });

router.post('/split', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded.' });
        }

        if (!req.body.pageRanges) {
            return res.status(400).json({ error: 'Page ranges are required (e.g., "1-3,4-6").' });
        }

        const pdfBytes = req.file.buffer;
        const pdfDoc = await PDFDocument.load(pdfBytes);
        const numPages = pdfDoc.getPageCount();

        const pageRanges = req.body.pageRanges.split(',');
        const splitPages = [];
        for (const range of pageRanges) {
            const [start, end] = range.split('-').map(Number);
            if (start > end || start < 1 || end > numPages) {
                return res.status(400).json({ error: `Invalid page range: ${range}. Total pages: ${numPages}` });
            }
            splitPages.push({ start: start - 1, end: end - 1 });
        }

        const zip = new JSZip();
        for (const { start, end } of splitPages) {
            const newPdfDoc = await PDFDocument.create();
            for (let i = start; i <= end; i++) {
                const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i]);
                newPdfDoc.addPage(copiedPage);
            }
            const newPdfBytes = await newPdfDoc.save();
            zip.file(`pages_${start + 1}-${end + 1}.pdf`, newPdfBytes);
        }
        const zipBytes = await zip.generateAsync({ type: 'nodebuffer' });
        const base64Data = zipBytes.toString('base64');

        res.json({
            success: true,
            filename: 'split_pages.zip',
            data: base64Data,
            mimeType: 'application/zip',
            splitCount: splitPages.length,
            totalPages: numPages
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while splitting the PDF', details: error.message });
    }
});


// Export the router
module.exports = router;
