import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelFile = 'c:\\Users\\jyaruel\\Downloads\\Tables_Nov2024_July2025.xlsx';
const outputDir = path.join(__dirname, '..', 'extracted_data');

// Create output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

// Read the Excel file
console.log('Reading Excel file:', excelFile);
const workbook = XLSX.readFile(excelFile);

console.log('\n📊 EXCEL FILE ANALYSIS\n');
console.log('Total sheets:', workbook.SheetNames.length);
console.log('='.repeat(80));

const allData = {};

workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`\n${index + 1}. ${sheetName}`);
    console.log('-'.repeat(80));

    const worksheet = workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(worksheet['!ref']);

    console.log(`   Dimensions: ${range.e.r + 1} rows × ${range.e.c + 1} columns`);

    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet, { defval: null });
    console.log(`   Data rows: ${data.length}`);

    if (data.length > 0) {
        console.log(`   Columns: ${Object.keys(data[0]).join(', ')}`);

        // Show first row as sample
        console.log(`   Sample (first row):`, JSON.stringify(data[0], null, 2).substring(0, 200) + '...');
    }

    // Save each sheet as JSON
    const fileName = `${sheetName.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    const filePath = path.join(outputDir, fileName);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`   ✓ Saved to: ${fileName}`);

    // Store in combined data object
    allData[sheetName] = data;
});

// Save all data in one combined JSON file
const combinedPath = path.join(outputDir, 'all_data.json');
fs.writeFileSync(combinedPath, JSON.stringify(allData, null, 2));
console.log('\n' + '='.repeat(80));
console.log('✅ All data extracted successfully!');
console.log(`📁 Output directory: ${outputDir}`);
console.log(`📦 Combined file: all_data.json`);
console.log('\nFiles created:');
console.log('  - all_data.json (all sheets combined)');
workbook.SheetNames.forEach(sheet => {
    console.log(`  - ${sheet.replace(/[^a-zA-Z0-9]/g, '_')}.json`);
});
