import XLSX from 'xlsx';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const excelFile = 'c:\\Users\\jyaruel\\Downloads\\Tables_Nov2024_July2025.xlsx';
const outputFile = path.join(__dirname, '..', 'public', 'data.json');

console.log('📊 Processing Vanuatu IMTS Data...\n');

const workbook = XLSX.readFile(excelFile);

// Helper function to find the header row index
function findHeaderRow(sheet, searchTerms) {
    const range = XLSX.utils.decode_range(sheet['!ref']);
    for (let r = 0; r <= Math.min(10, range.e.r); r++) {
        for (let c = 0; c <= range.e.c; c++) {
            const cell = sheet[XLSX.utils.encode_cell({ r, c })];
            if (cell && cell.v) {
                const value = String(cell.v).toLowerCase();
                if (searchTerms.some(term => value.includes(term))) {
                    return r;
                }
            }
        }
    }
    return 3; // Default
}

// Process Balance of Trade
function processBalanceOfTrade() {
    const sheet = workbook.Sheets['1_BalanceOfTrade'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 3; // After headers

    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        const period = row[0];

        // Skip headers and invalid rows
        if (!period || period === 'Period' || period === 'Annually' || period === 'Monthly' || typeof period !== 'number') {
            continue;
        }

        const exports = parseFloat(row[2]) || 0;
        const imports = parseFloat(row[3]) || 0;
        const balance = parseFloat(row[4]) || (exports - imports);

        if (exports > 0 || imports > 0) {
            result.push({
                period: String(period),
                exports: Math.round(exports * 100) / 100,
                imports: Math.round(imports * 100) / 100,
                balance: Math.round(balance * 100) / 100
            });
        }
    }

    console.log(`✓ Balance of Trade: ${result.length} records`);
    return result.slice(0, 20); // Get last 20 periods
}

// Process Principal Exports
function processPrincipalExports() {
    const sheet = workbook.Sheets['6_PrincipalExports'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 4;

    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        if (row[0] && row[0] !== 'Commodity' && typeof row[0] === 'string') {
            // Get latest year data (2024 or 2025)
            const value2024 = row[84] || row[85] || row[86] || 0;
            const value2025 = row[96] || row[97] || row[98] || 0;

            result.push({
                commodity: row[0],
                value2024: parseFloat(value2024) || 0,
                value2025: parseFloat(value2025) || 0,
                ytd: parseFloat(value2025) || parseFloat(value2024) || 0
            });
        }
    }

    console.log(`✓ Principal Exports: ${result.length} commodities`);
    return result.filter(r => r.commodity && r.ytd > 0).sort((a, b) => b.ytd - a.ytd);
}

// Process Principal Imports
function processPrincipalImports() {
    const sheet = workbook.Sheets['7_PrincipalImports'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 4;

    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        if (row[0] && row[0] !== 'Commodity' && typeof row[0] === 'string') {
            const value2024 = row[84] || row[85] || row[86] || 0;
            const value2025 = row[96] || row[97] || row[98] || 0;

            result.push({
                commodity: row[0],
                value2024: parseFloat(value2024) || 0,
                value2025: parseFloat(value2025) || 0,
                ytd: parseFloat(value2025) || parseFloat(value2024) || 0
            });
        }
    }

    console.log(`✓ Principal Imports: ${result.length} commodities`);
    return result.filter(r => r.commodity && r.ytd > 0).sort((a, b) => b.ytd - a.ytd);
}

// Process Trade by Country
function processTradeByCountry() {
    const sheet = workbook.Sheets['8_BalanceOfTradePartnerCountry'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 4;

    const excludeKeywords = ['COUNTRY', 'Notes:', 'Source:', '*', 'TOTAL', 'All others', 'Annually', 'Monthly', 'ANNUALLY', 'MONTHLY'];

    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        const country = row[0];

        // Skip invalid or excluded entries
        if (!country || typeof country !== 'string') continue;
        if (excludeKeywords.some(keyword => country.includes(keyword))) continue;
        if (country.length < 3) continue;

        const value2024 = row[86] || row[87] || row[88] || 0;
        const value2025 = row[98] || row[99] || row[100] || 0;

        const tradeVolume = Math.abs(parseFloat(value2025) || parseFloat(value2024) || 0);

        if (tradeVolume > 0) {
            result.push({
                country: country.trim(),
                value2024: Math.round(Math.abs(parseFloat(value2024) || 0) * 100) / 100,
                value2025: Math.round(Math.abs(parseFloat(value2025) || 0) * 100) / 100,
                tradeVolume: Math.round(tradeVolume * 100) / 100
            });
        }
    }

    console.log(`✓ Trade by Country: ${result.length} countries`);
    return result.sort((a, b) => b.tradeVolume - a.tradeVolume).slice(0, 20);
}

// Process Trade by Region
function processTradeByRegion() {
    const sheet = workbook.Sheets['9_BalanceOfTradeRegion'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 4;

    const excludeKeywords = ['REGION', 'Notes:', 'Source:', 'TOTAL', 'Annually', 'Monthly'];

    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        const region = row[0];

        if (!region || typeof region !== 'string') continue;
        if (excludeKeywords.some(keyword => region.includes(keyword))) continue;

        const value2024 = row[64] || row[65] || row[66] || 0;
        const value2025 = row[73] || row[74] || row[75] || 0;

        const tradeVolume = Math.abs(parseFloat(value2025) || parseFloat(value2024) || 0);

        if (tradeVolume > 0) {
            result.push({
                region: region.trim(),
                value2024: Math.round(Math.abs(parseFloat(value2024) || 0) * 100) / 100,
                value2025: Math.round(Math.abs(parseFloat(value2025) || 0) * 100) / 100,
                tradeVolume: Math.round(tradeVolume * 100) / 100
            });
        }
    }

    console.log(`✓ Trade by Region: ${result.length} regions`);
    return result.filter(r => r.tradeVolume > 0).sort((a, b) => b.tradeVolume - a.tradeVolume);
}

// Process Trade by Transport Mode
function processTradeByTransport() {
    const sheet = workbook.Sheets['10_TradeByModeTransport'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let inSection = false;

    for (let i = 0; i < data.length; i++) {
        const row = data[i];
        if (row[0] && typeof row[0] === 'string') {
            if (row[0].includes('IMPORTS') || row[0].includes('EXPORTS')) {
                inSection = true;
                continue;
            }
            if (inSection && row[0].match(/^(Sea|Air|Other|Post|Mail|Courier)/i)) {
                const mode = row[0].trim();
                const value2024 = row[86] || row[87] || row[88] || 0;
                const value2025 = row[98] || row[99] || row[100] || 0;

                result.push({
                    mode: mode,
                    value: parseFloat(value2025) || parseFloat(value2024) || 0
                });
            }
        }
    }

    // Aggregate by mode
    const aggregated = {};
    result.forEach(item => {
        let mode = item.mode;
        if (mode.toLowerCase().includes('sea')) mode = 'Sea';
        else if (mode.toLowerCase().includes('air')) mode = 'Air';
        else if (mode.toLowerCase().includes('post') || mode.toLowerCase().includes('mail')) mode = 'Postal';
        else if (mode.toLowerCase().includes('courier')) mode = 'Courier';
        else mode = 'Other';

        aggregated[mode] = (aggregated[mode] || 0) + item.value;
    });

    const finalResult = Object.entries(aggregated).map(([mode, value]) => ({
        mode,
        value: Math.abs(value)
    })).filter(r => r.value > 0);

    console.log(`✓ Trade by Transport: ${finalResult.length} modes`);
    return finalResult;
}

// Process Trade Agreements
function processTradeAgreements() {
    const sheet = workbook.Sheets['11_TradeByTradeAgreement'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 3;

    for (let i = startRow; i < data.length; i++) {
        const row = data[i];
        if (row[0] && typeof row[0] === 'string') {
            const agreement = row[0].trim();
            const value2024 = row[60] || row[61] || row[62] || 0;
            const value2025 = row[70] || row[71] || row[72] || 0;

            result.push({
                agreement: agreement,
                value: parseFloat(value2025) || parseFloat(value2024) || 0
            });
        }
    }

    console.log(`✓ Trade Agreements: ${result.length} agreements`);
    return result.filter(r => r.agreement && r.value > 0);
}

// Process Imports by HS (for detailed breakdown)
function processImportsByHS() {
    const sheet = workbook.Sheets['2_ImportsByHS'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 3;

    for (let i = startRow; i < Math.min(startRow + 50, data.length); i++) {
        const row = data[i];
        if (row[0] && row[0] !== 'Period') {
            const hsCode = row[0];
            const description = row[1] || `HS ${hsCode}`;
            const value = row[row.length - 1] || row[row.length - 2] || 0;

            if (parseFloat(value) > 0) {
                result.push({
                    code: hsCode,
                    description: description,
                    value: parseFloat(value) || 0
                });
            }
        }
    }

    console.log(`✓ Imports by HS: ${result.length} categories`);
    return result.filter(r => r.value > 0).sort((a, b) => b.value - a.value).slice(0, 20);
}

// Process Exports by HS
function processExportsByHS() {
    const sheet = workbook.Sheets['3_ExportsByHS'];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const result = [];
    let startRow = 3;

    for (let i = startRow; i < Math.min(startRow + 50, data.length); i++) {
        const row = data[i];
        if (row[0] && row[0] !== 'Period') {
            const hsCode = row[0];
            const description = row[1] || `HS ${hsCode}`;
            const value = row[row.length - 1] || row[row.length - 2] || 0;

            if (parseFloat(value) > 0) {
                result.push({
                    code: hsCode,
                    description: description,
                    value: parseFloat(value) || 0
                });
            }
        }
    }

    console.log(`✓ Exports by HS: ${result.length} categories`);
    return result.filter(r => r.value > 0).sort((a, b) => b.value - a.value).slice(0, 20);
}

// Main processing
try {
    const processedData = {
        balanceOfTrade: processBalanceOfTrade(),
        principalExports: processPrincipalExports(),
        principalImports: processPrincipalImports(),
        tradeByCountry: processTradeByCountry(),
        tradeByRegion: processTradeByRegion(),
        tradeByTransport: processTradeByTransport(),
        tradeByAgreement: processTradeAgreements(),
        importsByHS: processImportsByHS(),
        exportsByHS: processExportsByHS(),
        metadata: {
            source: 'Vanuatu National Statistics Office',
            period: 'November 2024 - July 2025',
            currency: 'VT Million',
            lastUpdated: new Date().toISOString()
        }
    };

    // Write to public folder
    fs.writeFileSync(outputFile, JSON.stringify(processedData, null, 2));

    console.log('\n================================');
    console.log('✅ Data processing complete!');
    console.log('================================');
    console.log(`📁 Output file: ${outputFile}`);
    console.log(`📊 Data Summary:`);
    console.log(`   - Balance of Trade: ${processedData.balanceOfTrade.length} periods`);
    console.log(`   - Principal Exports: ${processedData.principalExports.length} commodities`);
    console.log(`   - Principal Imports: ${processedData.principalImports.length} commodities`);
    console.log(`   - Trade Countries: ${processedData.tradeByCountry.length} partners`);
    console.log(`   - Trade Regions: ${processedData.tradeByRegion.length} regions`);
    console.log(`   - Transport Modes: ${processedData.tradeByTransport.length} modes`);
    console.log(`   - Trade Agreements: ${processedData.tradeByAgreement.length} agreements`);
    console.log('\n✨ Ready to use in dashboard!\n');

} catch (error) {
    console.error('❌ Error processing data:', error);
    process.exit(1);
}
