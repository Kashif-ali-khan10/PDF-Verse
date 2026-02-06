// Quick API Test - Simple example
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

const BASE_URL = 'http://localhost:8080/api';

async function quickTest() {
  // Check if test PDF exists
  const testPdf = process.argv[2] || 'test.pdf';
  
  if (!fs.existsSync(testPdf)) {
    console.log('❌ Test PDF not found!');
    console.log('Usage: node quick-test.js [path-to-pdf]');
    console.log('\nExample:');
    console.log('  node quick-test.js /path/to/your/file.pdf');
    return;
  }

  console.log('🚀 Quick API Test');
  console.log(`📄 Testing with: ${testPdf}\n`);

  // Test 1: PDF to Text (simplest conversion)
  try {
    console.log('Testing: PDF to Text...');
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(testPdf));

    const response = await axios.post(`${BASE_URL}/convert-pdf-to-txt`, formData, {
      headers: formData.getHeaders(),
    });

    if (response.data.success) {
      console.log('✅ Success!');
      console.log(`   Text preview: ${response.data.text.substring(0, 100)}...`);
      
      // Save the text file
      const textBuffer = Buffer.from(response.data.data, 'base64');
      fs.writeFileSync('test-output.txt', textBuffer);
      console.log('   💾 Saved to: test-output.txt');
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  // Test 2: Get PDF Info
  try {
    console.log('\nTesting: Get PDF Info...');
    const formData = new FormData();
    formData.append('pdf', fs.createReadStream(testPdf));

    const response = await axios.post(`${BASE_URL}/editor`, formData, {
      headers: formData.getHeaders(),
    });

    if (response.data.success) {
      console.log('✅ Success!');
      console.log(`   Filename: ${response.data.filename}`);
      console.log(`   Pages: ${response.data.pageCount}`);
      console.log(`   MIME Type: ${response.data.mimeType}`);
    }
  } catch (error) {
    console.log('❌ Failed:', error.message);
  }

  console.log('\n✨ Test complete!');
  console.log('📖 For full testing, run: node test-api.js [pdf-file]');
}

quickTest();

