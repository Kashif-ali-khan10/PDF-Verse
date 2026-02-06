# API Testing Guide

This guide shows you how to test all the PDF-Verse API endpoints.

## Prerequisites

1. Make sure the server is running:
   ```bash
   npm start
   ```

2. Have a test PDF file ready (or use the provided test script)

## Testing Methods

### Method 1: Using the Node.js Test Script (Recommended)

The test script automatically tests all endpoints and saves outputs.

```bash
# Install required dependency
npm install axios form-data

# Run tests with your PDF file
node test-api.js /path/to/your/test.pdf

# Or if you have a test.pdf in the project root
node test-api.js
```

**Output:**
- All test results will be displayed in the console
- Converted files will be saved to `test-outputs/` directory
- Summary of passed/failed tests

### Method 2: Using the Bash Script

```bash
# Make script executable
chmod +x test-api.sh

# Run tests
./test-api.sh /path/to/your/test.pdf
```

### Method 3: Using curl (Manual Testing)

#### 1. PDF to Word
```bash
curl -X POST http://localhost:8080/api/convert \
  -F "file=@test.pdf" \
  -o output.docx
```

#### 2. PDF to Excel
```bash
curl -X POST http://localhost:8080/api/excel-convert \
  -F "file=@test.pdf" \
  -F "selectedFormat=.xlsx" \
  -o output.xlsx
```

#### 3. PDF to PowerPoint
```bash
curl -X POST http://localhost:8080/api/ppt-convert \
  -F "file=@test.pdf" \
  -o output.pptx
```

#### 4. PDF to PNG
```bash
curl -X POST http://localhost:8080/api/png-convert \
  -F "file=@test.pdf" \
  -o images.zip
```

#### 5. PDF to JPG
```bash
curl -X POST http://localhost:8080/api/jpg-convert \
  -F "file=@test.pdf" \
  -o images.zip
```

#### 6. PDF to TIFF
```bash
curl -X POST http://localhost:8080/api/tiff-convert \
  -F "file=@test.pdf" \
  -o images.zip
```

#### 7. PDF to JSON
```bash
curl -X POST http://localhost:8080/api/convert-pdf-to-json \
  -F "file=@test.pdf" \
  -o output.json
```

#### 8. PDF to Text
```bash
curl -X POST http://localhost:8080/api/convert-pdf-to-txt \
  -F "pdf=@test.pdf" \
  -o output.txt
```

#### 9. Merge PDFs
```bash
curl -X POST http://localhost:8080/api/merge \
  -F "pdfs=@test1.pdf" \
  -F "pdfs=@test2.pdf" \
  -o merged.pdf
```

#### 10. Split PDF
```bash
curl -X POST http://localhost:8080/api/split \
  -F "file=@test.pdf" \
  -F "pageRanges=1-3,4-6" \
  -o split.zip
```

#### 11. Add Watermark
```bash
curl -X POST http://localhost:8080/api/add-watermark \
  -F "pdf=@test.pdf" \
  -F "watermarkText=CONFIDENTIAL" \
  -F "fontSize=42" \
  -F "opacity=0.3" \
  -F "rotation=0" \
  -o watermarked.pdf
```

#### 12. Rotate PDF
```bash
curl -X POST http://localhost:8080/api/rotate-pdf-form \
  -F "file=@test.pdf" \
  -F "rotationDirection=right" \
  -o rotated.pdf
```

#### 13. Delete Pages
```bash
curl -X POST http://localhost:8080/api/delete-pages \
  -F "pdfFile=@test.pdf" \
  -F "pageNumbers=2,3" \
  -o modified.pdf
```

#### 14. Add Page Numbers
```bash
curl -X POST http://localhost:8080/api/add-page-number \
  -F "pdfFile=@test.pdf" \
  -F "size=medium" \
  -F "format=bottom-right" \
  -o numbered.pdf
```

#### 15. Word to PDF
```bash
curl -X POST http://localhost:8080/api/wordconvert \
  -F "documents=@test.docx" \
  -o converted.pdf
```

#### 16. Get PDF Info
```bash
curl -X POST http://localhost:8080/api/editor \
  -F "pdf=@test.pdf"
```

### Method 4: Using Postman or Insomnia

1. Import the collection (see below for endpoint details)
2. Set the request method to POST
3. Set the URL to `http://localhost:8080/api/{endpoint}`
4. Go to Body → form-data
5. Add the file field and any other required fields
6. Send the request

### Method 5: Using JavaScript/Fetch

```javascript
const formData = new FormData();
formData.append('file', fileInput.files[0]);

fetch('http://localhost:8080/api/convert', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => {
  if (data.success) {
    // Decode base64 and download
    const blob = new Blob(
      [Uint8Array.from(atob(data.data), c => c.charCodeAt(0))],
      { type: data.mimeType }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = data.filename;
    a.click();
  }
});
```

## API Response Format

All endpoints return JSON in this format:

```json
{
  "success": true,
  "filename": "output.pdf",
  "data": "base64EncodedData...",
  "mimeType": "application/pdf"
}
```

On error:
```json
{
  "error": "Error message",
  "details": "Detailed error information"
}
```

## Testing with JSON Response

If you want to see the JSON response instead of downloading files:

```bash
curl -X POST http://localhost:8080/api/convert \
  -F "file=@test.pdf" | jq .
```

This will show you the full JSON response with base64 data.

## API Documentation

Visit `http://localhost:8080/` for complete API documentation with all available endpoints.

## Troubleshooting

1. **Server not running**: Make sure `npm start` is running
2. **File not found**: Check the file path is correct
3. **CORS errors**: The API has CORS enabled, but check your client configuration
4. **Large files**: Increase timeout settings for large PDF files
5. **Memory issues**: The API handles files up to 50MB by default

