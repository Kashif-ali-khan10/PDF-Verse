const express = require('express')
const bodyParser = require('body-parser')
const mergeRouter = require('./routes/merge');
const splitRouter = require('./routes/split');
const editorRouter = require('./routes/editor');
const watermarkRouter = require('./routes/watermark');
const deleteRouter = require('./routes/delete');
const pageNoRoute = require('./routes/pageno');
const rotatePdf = require('./routes/rotate');
const pdfToWord = require('./routes/pdf-to-word')
const pdfToExcel = require('./routes/pdftoexcel')
const pdfToPpt = require('./routes/pdf-to-ppt')
const pdfToPng = require('./routes/pdf-to-png')
const pdfToJpg = require('./routes/pdf-to-jpg')
const pdfToJson = require('./routes/pdf-to-json');
const pdfToTiff = require('./routes/pdf-to-tiff')
const pdfToTxt = require('./routes/pdf-to-txt')
const wordToPdf = require('./routes/word-to-pdf')
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json({ limit: '50mb' }));

// API Routes
app.use('/api', mergeRouter);
app.use('/api', splitRouter);
app.use('/api', editorRouter);
app.use('/api', watermarkRouter);
app.use('/api', deleteRouter);
app.use('/api', pageNoRoute);
app.use('/api', rotatePdf);
app.use('/api', pdfToWord);
app.use('/api', pdfToExcel);
app.use('/api', pdfToPpt);
app.use('/api', pdfToPng);
app.use('/api', pdfToJpg);
app.use('/api', pdfToJson);
app.use('/api', pdfToTiff);
app.use('/api', pdfToTxt);
app.use('/api', wordToPdf);

// API Documentation endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'PDF-Verse API',
    version: '1.0.0',
    description: 'REST API for PDF manipulation and conversion',
    endpoints: {
      merge: {
        method: 'POST',
        path: '/api/merge',
        description: 'Merge multiple PDF files into one',
        body: 'multipart/form-data with field "pdfs" (array of PDF files)'
      },
      split: {
        method: 'POST',
        path: '/api/split',
        description: 'Split PDF into multiple files by page ranges',
        body: 'multipart/form-data with "file" (PDF) and "pageRanges" (e.g., "1-3,4-6")'
      },
      'pdf-to-word': {
        method: 'POST',
        path: '/api/convert',
        description: 'Convert PDF to Word document',
        body: 'multipart/form-data with field "file" (PDF)'
      },
      'pdf-to-excel': {
        method: 'POST',
        path: '/api/excel-convert',
        description: 'Convert PDF to Excel file',
        body: 'multipart/form-data with field "file" (PDF)'
      },
      'pdf-to-ppt': {
        method: 'POST',
        path: '/api/ppt-convert',
        description: 'Convert PDF to PowerPoint',
        body: 'multipart/form-data with field "file" (PDF)'
      },
      'pdf-to-png': {
        method: 'POST',
        path: '/api/png-convert',
        description: 'Convert PDF to PNG images',
        body: 'multipart/form-data with field "file" (PDF)'
      },
      'pdf-to-jpg': {
        method: 'POST',
        path: '/api/jpg-convert',
        description: 'Convert PDF to JPG images',
        body: 'multipart/form-data with field "file" (PDF)'
      },
      'pdf-to-json': {
        method: 'POST',
        path: '/api/convert-pdf-to-json',
        description: 'Convert PDF to JSON',
        body: 'multipart/form-data with field "file" (PDF)'
      },
      'pdf-to-txt': {
        method: 'POST',
        path: '/api/convert-pdf-to-txt',
        description: 'Convert PDF to text',
        body: 'multipart/form-data with field "pdf" (PDF)'
      },
      'word-to-pdf': {
        method: 'POST',
        path: '/api/wordconvert',
        description: 'Convert Word document to PDF',
        body: 'multipart/form-data with field "documents" (Word file)'
      },
      watermark: {
        method: 'POST',
        path: '/api/add-watermark',
        description: 'Add text watermark to PDF',
        body: 'multipart/form-data with "pdf" (PDF) and "watermarkText" (text)'
      },
      rotate: {
        method: 'POST',
        path: '/api/rotate-pdf-form',
        description: 'Rotate PDF pages',
        body: 'multipart/form-data with "file" (PDF) and "rotation" (degrees)'
      },
      delete: {
        method: 'POST',
        path: '/api/delete-pages',
        description: 'Delete pages from PDF',
        body: 'multipart/form-data with "pdfFile" (PDF) and "pagesToDelete" (comma-separated page numbers)'
      },
      'add-page-number': {
        method: 'POST',
        path: '/api/add-page-number',
        description: 'Add page numbers to PDF',
        body: 'multipart/form-data with "pdfFile" (PDF) and options'
      }
    },
    note: 'All endpoints return JSON with base64 encoded file data in the "data" field and filename in "filename" field'
  });
});

app.listen(8080, () => {
  console.log('PDF-Verse API Server is running on port 8080');
  console.log('API Documentation available at http://localhost:8080/');
});
