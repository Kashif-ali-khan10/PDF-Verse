# Quick Test Examples

## Server Status
✅ Server is running on `http://localhost:8080`

## Quick Test Methods

### 1. Test API Documentation
```bash
curl http://localhost:8080/
```

### 2. Test PDF to Text (Simplest)
```bash
curl -X POST http://localhost:8080/api/convert-pdf-to-txt \
  -F "pdf=@your-file.pdf" \
  | jq .
```

### 3. Test Get PDF Info
```bash
curl -X POST http://localhost:8080/api/editor \
  -F "pdf=@your-file.pdf" \
  | jq .
```

### 4. Using the Test Scripts

**Install dependencies first:**
```bash
npm install form-data
```

**Run quick test:**
```bash
node quick-test.js /path/to/your/file.pdf
```

**Run full test suite:**
```bash
node test-api.js /path/to/your/file.pdf
```

**Or use bash script:**
```bash
chmod +x test-api.sh
./test-api.sh /path/to/your/file.pdf
```

## Example: Test PDF to Word

```bash
# Using curl
curl -X POST http://localhost:8080/api/convert \
  -F "file=@test.pdf" \
  -o output.docx

# The response will be JSON with base64 data
# To get JSON response:
curl -X POST http://localhost:8080/api/convert \
  -F "file=@test.pdf" | jq .
```

## Example: Test Merge PDFs

```bash
curl -X POST http://localhost:8080/api/merge \
  -F "pdfs=@file1.pdf" \
  -F "pdfs=@file2.pdf" \
  | jq .
```

## Example: Test Split PDF

```bash
curl -X POST http://localhost:8080/api/split \
  -F "file=@test.pdf" \
  -F "pageRanges=1-3,4-6" \
  | jq .
```

## Using Postman/Insomnia

1. Method: POST
2. URL: `http://localhost:8080/api/{endpoint}`
3. Body Type: form-data
4. Add file field with your PDF
5. Add any additional fields as needed
6. Send request

## Response Format

All endpoints return JSON:
```json
{
  "success": true,
  "filename": "output.pdf",
  "data": "base64EncodedString...",
  "mimeType": "application/pdf"
}
```

To decode and save:
```javascript
const fs = require('fs');
const data = Buffer.from(response.data.data, 'base64');
fs.writeFileSync(response.data.filename, data);
```

## All Available Endpoints

- `/api/convert` - PDF to Word
- `/api/excel-convert` - PDF to Excel  
- `/api/ppt-convert` - PDF to PowerPoint
- `/api/png-convert` - PDF to PNG
- `/api/jpg-convert` - PDF to JPG
- `/api/tiff-convert` - PDF to TIFF
- `/api/convert-pdf-to-json` - PDF to JSON
- `/api/convert-pdf-to-txt` - PDF to Text
- `/api/wordconvert` - Word to PDF
- `/api/merge` - Merge PDFs
- `/api/split` - Split PDF
- `/api/add-watermark` - Add watermark
- `/api/add-image-watermark` - Add image watermark
- `/api/rotate-pdf-form` - Rotate PDF
- `/api/delete-pages` - Delete pages
- `/api/add-page-number` - Add page numbers
- `/api/editor` - Get PDF info

See `API-TESTING.md` for detailed examples!

