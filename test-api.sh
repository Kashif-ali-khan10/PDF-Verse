#!/bin/bash

# API Test Script using curl
# Usage: ./test-api.sh [path-to-test.pdf]

BASE_URL="http://localhost:8080/api"
TEST_PDF="${1:-test.pdf}"

if [ ! -f "$TEST_PDF" ]; then
    echo "❌ Test PDF file not found: $TEST_PDF"
    echo "Usage: ./test-api.sh [path-to-test.pdf]"
    exit 1
fi

echo "🚀 Testing PDF-Verse API"
echo "📄 Using test PDF: $TEST_PDF"
echo "=" | awk '{printf "%.0s=", $1}END{print ""}' | head -c 60 && echo ""

# Create output directory
mkdir -p test-outputs

# Test function
test_endpoint() {
    local name=$1
    local endpoint=$2
    local form_field=$3
    shift 3
    local extra_fields=("$@")
    
    echo ""
    echo "🧪 Testing: $name"
    echo "   Endpoint: $endpoint"
    
    # Build curl command
    local curl_cmd="curl -s -X POST \"$BASE_URL$endpoint\""
    
    # Add file field
    curl_cmd="$curl_cmd -F \"$form_field=@$TEST_PDF\""
    
    # Add extra form fields
    for field in "${extra_fields[@]}"; do
        curl_cmd="$curl_cmd -F \"$field\""
    done
    
    # Execute and save response
    local response=$(eval $curl_cmd)
    local output_file="test-outputs/${name// /_}.json"
    echo "$response" > "$output_file"
    
    # Check if response contains success
    if echo "$response" | grep -q '"success":true'; then
        echo "   ✅ Success!"
        local filename=$(echo "$response" | grep -o '"filename":"[^"]*"' | cut -d'"' -f4)
        echo "   Filename: $filename"
        
        # Extract and save base64 data if present
        if echo "$response" | grep -q '"data"'; then
            echo "$response" | grep -o '"data":"[^"]*"' | cut -d'"' -f4 | base64 -d > "test-outputs/$filename" 2>/dev/null
            echo "   💾 Saved to: test-outputs/$filename"
        fi
    else
        echo "   ❌ Failed"
        echo "   Response: $response"
    fi
}

# Run tests
test_endpoint "PDF to Word" "/convert" "file"
test_endpoint "PDF to Excel" "/excel-convert" "file" "selectedFormat=.xlsx"
test_endpoint "PDF to PPT" "/ppt-convert" "file"
test_endpoint "PDF to PNG" "/png-convert" "file"
test_endpoint "PDF to JPG" "/jpg-convert" "file"
test_endpoint "PDF to TIFF" "/tiff-convert" "file"
test_endpoint "PDF to JSON" "/convert-pdf-to-json" "file"
test_endpoint "PDF to TXT" "/convert-pdf-to-txt" "pdf"
test_endpoint "Split PDF" "/split" "file" "pageRanges=1-1"
test_endpoint "Add Watermark" "/add-watermark" "pdf" "watermarkText=TEST" "fontSize=42" "opacity=0.3" "rotation=0"
test_endpoint "Rotate PDF" "/rotate-pdf-form" "file" "rotationDirection=right"
test_endpoint "Add Page Numbers" "/add-page-number" "pdfFile" "size=medium" "format=bottom-right"
test_endpoint "Get PDF Info" "/editor" "pdf"

echo ""
echo "=" | awk '{printf "%.0s=", $1}END{print ""}' | head -c 60 && echo ""
echo "✅ Tests completed! Check test-outputs/ directory for results."

