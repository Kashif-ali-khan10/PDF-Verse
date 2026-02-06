const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:8080/api';

// Helper function to test API endpoints
async function testEndpoint(name, endpoint, formData) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    console.log(`   Endpoint: ${endpoint}`);
    
    const response = await axios.post(`${BASE_URL}${endpoint}`, formData, {
      headers: formData.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    if (response.data.success) {
      console.log(`   ✅ Success!`);
      console.log(`   Filename: ${response.data.filename}`);
      console.log(`   MIME Type: ${response.data.mimeType}`);
      console.log(`   Data length: ${response.data.data.length} characters`);
      
      // Save the response to a file for verification
      const outputDir = path.join(__dirname, 'test-outputs');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
      }
      
      const buffer = Buffer.from(response.data.data, 'base64');
      const outputPath = path.join(outputDir, response.data.filename);
      fs.writeFileSync(outputPath, buffer);
      console.log(`   💾 Saved to: ${outputPath}`);
      
      return { success: true, data: response.data };
    } else {
      console.log(`   ❌ Failed: ${response.data.error || 'Unknown error'}`);
      return { success: false, error: response.data.error };
    }
  } catch (error) {
    console.log(`   ❌ Error: ${error.message}`);
    if (error.response) {
      console.log(`   Status: ${error.response.status}`);
      console.log(`   Response: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    return { success: false, error: error.message };
  }
}

// Test functions for each endpoint
async function testPDFToWord(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to Word', '/convert', formData);
}

async function testPDFToExcel(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  formData.append('selectedFormat', '.xlsx');
  return await testEndpoint('PDF to Excel', '/excel-convert', formData);
}

async function testPDFToPPT(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to PowerPoint', '/ppt-convert', formData);
}

async function testPDFToPNG(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to PNG', '/png-convert', formData);
}

async function testPDFToJPG(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to JPG', '/jpg-convert', formData);
}

async function testPDFToTIFF(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to TIFF', '/tiff-convert', formData);
}

async function testPDFToJSON(pdfPath) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to JSON', '/convert-pdf-to-json', formData);
}

async function testPDFToTXT(pdfPath) {
  const formData = new FormData();
  formData.append('pdf', fs.createReadStream(pdfPath));
  return await testEndpoint('PDF to Text', '/convert-pdf-to-txt', formData);
}

async function testMergePDFs(pdfPaths) {
  const formData = new FormData();
  pdfPaths.forEach(pdfPath => {
    formData.append('pdfs', fs.createReadStream(pdfPath));
  });
  return await testEndpoint('Merge PDFs', '/merge', formData);
}

async function testSplitPDF(pdfPath, pageRanges) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  formData.append('pageRanges', pageRanges);
  return await testEndpoint('Split PDF', '/split', formData);
}

async function testAddWatermark(pdfPath, watermarkText) {
  const formData = new FormData();
  formData.append('pdf', fs.createReadStream(pdfPath));
  formData.append('watermarkText', watermarkText);
  formData.append('fontSize', '42');
  formData.append('opacity', '0.3');
  formData.append('rotation', '0');
  return await testEndpoint('Add Watermark', '/add-watermark', formData);
}

async function testRotatePDF(pdfPath, rotationDirection) {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(pdfPath));
  formData.append('rotationDirection', rotationDirection);
  return await testEndpoint('Rotate PDF', '/rotate-pdf-form', formData);
}

async function testDeletePages(pdfPath, pageNumbers) {
  const formData = new FormData();
  formData.append('pdfFile', fs.createReadStream(pdfPath));
  formData.append('pageNumbers', pageNumbers.join(','));
  return await testEndpoint('Delete Pages', '/delete-pages', formData);
}

async function testAddPageNumber(pdfPath) {
  const formData = new FormData();
  formData.append('pdfFile', fs.createReadStream(pdfPath));
  formData.append('size', 'medium');
  formData.append('format', 'bottom-right');
  return await testEndpoint('Add Page Numbers', '/add-page-number', formData);
}

async function testWordToPDF(wordPath) {
  const formData = new FormData();
  formData.append('documents', fs.createReadStream(wordPath));
  return await testEndpoint('Word to PDF', '/wordconvert', formData);
}

async function testGetPDFInfo(pdfPath) {
  const formData = new FormData();
  formData.append('pdf', fs.createReadStream(pdfPath));
  return await testEndpoint('Get PDF Info', '/editor', formData);
}

// Main test function
async function runTests() {
  console.log('🚀 Starting API Tests...');
  console.log('=' .repeat(60));

  // Check if test PDF file exists
  const testPdfPath = process.argv[2] || path.join(__dirname, 'test.pdf');
  
  if (!fs.existsSync(testPdfPath)) {
    console.log(`\n⚠️  Test PDF file not found at: ${testPdfPath}`);
    console.log('   Please provide a PDF file path as an argument:');
    console.log('   node test-api.js /path/to/your/test.pdf');
    console.log('\n   Or create a test.pdf file in the project root.');
    return;
  }

  console.log(`\n📄 Using test PDF: ${testPdfPath}`);

  const results = {
    passed: 0,
    failed: 0,
    tests: []
  };

  // Run tests
  try {
    // Test 1: PDF to Word
    const result1 = await testPDFToWord(testPdfPath);
    results.tests.push({ name: 'PDF to Word', ...result1 });
    if (result1.success) results.passed++; else results.failed++;

    // Test 2: PDF to Excel
    const result2 = await testPDFToExcel(testPdfPath);
    results.tests.push({ name: 'PDF to Excel', ...result2 });
    if (result2.success) results.passed++; else results.failed++;

    // Test 3: PDF to PPT
    const result3 = await testPDFToPPT(testPdfPath);
    results.tests.push({ name: 'PDF to PPT', ...result3 });
    if (result3.success) results.passed++; else results.failed++;

    // Test 4: PDF to PNG
    const result4 = await testPDFToPNG(testPdfPath);
    results.tests.push({ name: 'PDF to PNG', ...result4 });
    if (result4.success) results.passed++; else results.failed++;

    // Test 5: PDF to JPG
    const result5 = await testPDFToJPG(testPdfPath);
    results.tests.push({ name: 'PDF to JPG', ...result5 });
    if (result5.success) results.passed++; else results.failed++;

    // Test 6: PDF to TIFF
    const result6 = await testPDFToTIFF(testPdfPath);
    results.tests.push({ name: 'PDF to TIFF', ...result6 });
    if (result6.success) results.passed++; else results.failed++;

    // Test 7: PDF to JSON
    const result7 = await testPDFToJSON(testPdfPath);
    results.tests.push({ name: 'PDF to JSON', ...result7 });
    if (result7.success) results.passed++; else results.failed++;

    // Test 8: PDF to TXT
    const result8 = await testPDFToTXT(testPdfPath);
    results.tests.push({ name: 'PDF to TXT', ...result8 });
    if (result8.success) results.passed++; else results.failed++;

    // Test 9: Split PDF (only if PDF has multiple pages)
    const result9 = await testSplitPDF(testPdfPath, '1-1');
    results.tests.push({ name: 'Split PDF', ...result9 });
    if (result9.success) results.passed++; else results.failed++;

    // Test 10: Add Watermark
    const result10 = await testAddWatermark(testPdfPath, 'TEST WATERMARK');
    results.tests.push({ name: 'Add Watermark', ...result10 });
    if (result10.success) results.passed++; else results.failed++;

    // Test 11: Rotate PDF
    const result11 = await testRotatePDF(testPdfPath, 'right');
    results.tests.push({ name: 'Rotate PDF', ...result11 });
    if (result11.success) results.passed++; else results.failed++;

    // Test 12: Add Page Numbers
    const result12 = await testAddPageNumber(testPdfPath);
    results.tests.push({ name: 'Add Page Numbers', ...result12 });
    if (result12.success) results.passed++; else results.failed++;

    // Test 13: Get PDF Info
    const result13 = await testGetPDFInfo(testPdfPath);
    results.tests.push({ name: 'Get PDF Info', ...result13 });
    if (result13.success) results.passed++; else results.failed++;

  } catch (error) {
    console.error('\n❌ Test execution error:', error.message);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Test Summary');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`📝 Total: ${results.passed + results.failed}`);
  console.log('\n📁 Output files saved to: test-outputs/');
}

// Run tests
runTests().catch(console.error);

