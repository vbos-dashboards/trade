// Script to load Excel data and convert to JSON format
import XLSX from 'xlsx';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const excelFilePath = 'c:\\Users\\jyaruel\\Downloads\\Tables_Nov2024_July2025.xlsx';

function parseSheet(workbook, sheetName, skipRows = 4) {
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });

    if (jsonData.length <= skipRows) return { headers: [], data: [] };

    const headers = jsonData[skipRows];
    const data = jsonData.slice(skipRows + 1).filter(row =>
        row.some(cell => cell !== null && cell !== undefined && cell !== '')
    );

    return {
        headers,
        data: data.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                if (header) obj[header] = row[index];
            });
            return obj;
        })
    };
}

try {
    console.log('Loading Excel file...');
    const workbook = XLSX.readFile(excelFilePath);

    const datasets = {};

    const sheets = [
        { name: '1_BalanceOfTrade', key: 'balanceOfTrade', skip: 3 },
        { name: '2_ImportsByHS', key: 'importsByHS', skip: 4 },
        { name: '3_ExportsByHS', key: 'exportsByHS', skip: 4 },
        { name: '6_PrincipalExports', key: 'principalExports', skip: 4 },
        { name: '7_PrincipalImports', key: 'principalImports', skip: 4 },
        { name: '8_BalanceOfTradePartnerCountry', key: 'tradeByCountry', skip: 4 },
        { name: '9_BalanceOfTradeRegion', key: 'tradeByRegion', skip: 4 },
        { name: '10_TradeByModeTransport', key: 'tradeByTransport', skip: 4 },
        { name: '11_TradeByTradeAgreement', key: 'tradeByAgreement', skip: 4 }
    ];

    sheets.forEach(sheet => {
        if (workbook.Sheets[sheet.name]) {
            console.log(`Processing ${sheet.name}...`);
            datasets[sheet.key] = parseSheet(workbook, sheet.name, sheet.skip);
        }
    });

    // Save to public folder for easy access
    const outputPath = join(__dirname, '..', 'public', 'data.json');
    writeFileSync(outputPath, JSON.stringify(datasets, null, 2));

    console.log('Data successfully loaded to public/data.json');
    console.log(`Processed ${Object.keys(datasets).length} datasets`);

} catch (error) {
    console.error('Error loading data:', error);
    process.exit(1);
}
