const express = require('express');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });
const pdf2table = require('pdf2table');
const excel = require('excel4node');

const router = express.Router();

function validateSelectedPages(selectedPages, totalPages) {
    let pageRanges = selectedPages.split(',').map(range => range.split('-').map(Number));
    return pageRanges.every(range => {
        let [start, end] = range;
        return start >= 1 && end <= totalPages && start <= end;
    });
}

function applyCellStyle(cell, isHeader = false) {
    const style = {
      font: isHeader ? { bold: true, name: 'Arial', size: 12 } : { name: 'Arial', size: 12 },
      border: {
        left: { style: 'thin', color: '#000000' },
        right: { style: 'thin', color: '#000000' },
        top: { style: 'thin', color: '#000000' },
        bottom: { style: 'thin', color: '#000000' }
      }
    };
    
    cell.style(style);
  }

router.post('/excel-convert', upload.single('file'), (req, res) => {
    if (!req.file || req.file.mimetype !== 'application/pdf') {
        return res.status(400).json({ error: 'Please upload a valid PDF file.' });
    }

    const { selectedFormat = '.xlsx', selectedPages, tableOption } = req.body;

    pdf2table.parse(req.file.buffer, (err, rows, pages) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'An unexpected error occurred', details: err.message });
        }

        if (selectedPages && !validateSelectedPages(selectedPages, pages.length)) {
            return res.status(400).json({ error: 'Invalid selected pages range.' });
        }

        rows = handleSelectedPages(rows, selectedPages, pages.length);

        if (tableOption === 'Flatten') {
            const numberOfColumns = determineNumberOfColumns(rows);
            rows = flattenTables(rows, numberOfColumns);
        }

        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet('Sheet 1');

        rows.forEach((row, rowIndex) => {
            row.forEach((cellValue, cellIndex) => {
              const cell = worksheet.cell(rowIndex + 1, cellIndex + 1);
              cell.string(cellValue || '');
              applyCellStyle(cell, rowIndex === 0);
            });
          });

        workbook.writeToBuffer().then(buffer => {
            const base64Data = buffer.toString('base64');
            res.json({
                success: true,
                filename: `output${selectedFormat}`,
                data: base64Data,
                mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            });
        }).catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Error generating Excel file.', details: err.message });
        });
    });
});

function determineNumberOfColumns(rows) {
    const firstRowItem = rows[0];
    for (let i = 1; i < rows.length; i++) {
        if (rows[i] === firstRowItem) {
            return i;
        }
    }
    return rows.length;
}



function handleSelectedPages(rows, selectedPages, totalPages) {
    if (!selectedPages) return rows;

    let selectedLines = [];
    let pageRanges = selectedPages.split(',').map(range => range.split('-').map(Number));

    pageRanges.forEach(range => {
        let [start, end] = range;
        end = end || start;

        start = Math.max(1, Math.min(start, totalPages));
        end = Math.max(1, Math.min(end, totalPages));

        for (let i = start; i <= end; i++) {
            selectedLines.push(...rows[i - 1]);
        }
    });

    return selectedLines;
}

function flattenTables(rows, numberOfColumns) {
    const tables = [];
    for (let i = 0; i < rows.length; i += numberOfColumns) {
        const tableSegment = rows.slice(i, i + numberOfColumns);
        tables.push(tableSegment);
    }
    
    
    const flattened = tables.reduce((flattened, table) => flattened.concat(table), []);
    return flattened;
    }


module.exports = router;