const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');

// PDF file path
const pdfPath = 'c:\\Users\\jyaruel\\Downloads\\International Merchandise Trade Highlight_January_2024.pdf';

// Helper function to extract tables from text
function extractTables(text) {
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);

    const tables = [];
    let currentTable = [];
    let inTable = false;

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        // Detect table rows (lines with numbers and multiple columns)
        const hasNumbers = /\d{1,3}(,\d{3})*(\.\d+)?/.test(line);
        const hasMultipleSpaces = /\s{2,}/.test(line);

        if (hasNumbers && hasMultipleSpaces) {
            if (!inTable) {
                inTable = true;
                currentTable = [];
            }
            currentTable.push(line);
        } else if (inTable && currentTable.length > 0) {
            tables.push(currentTable);
            currentTable = [];
            inTable = false;
        }
    }

    if (currentTable.length > 0) {
        tables.push(currentTable);
    }

    return tables;
}

// Helper function to parse key statistics
function extractKeyStatistics(text) {
    const stats = {};

    // Extract monetary values
    const moneyPattern = /(\w+(?:\s+\w+)*)\s*[:=]\s*VT?\s*([\d,]+(?:\.\d+)?)\s*(million|billion)?/gi;
    let match;

    while ((match = moneyPattern.exec(text)) !== null) {
        const key = match[1].trim().toLowerCase().replace(/\s+/g, '_');
        const value = parseFloat(match[2].replace(/,/g, ''));
        const unit = match[3] ? match[3].toLowerCase() : '';

        stats[key] = {
            value: value,
            unit: unit,
            formatted: match[2]
        };
    }

    return stats;
}

// Helper function to extract trade data
function extractTradeData(text) {
    const data = {
        period: null,
        exports: {
            total: null,
            reExports: null,
            domesticExports: null,
            topCommodities: []
        },
        imports: {
            total: null,
            topCommodities: [],
            topCountries: []
        },
        balance: {
            total: null,
            trend: null
        }
    };

    // Extract period (month/year)
    const periodMatch = text.match(/(January|February|March|April|May|June|July|August|September|October|November|December)\s+(\d{4})/i);
    if (periodMatch) {
        data.period = `${periodMatch[1]} ${periodMatch[2]}`;
    }

    // Extract export totals
    const exportMatch = text.match(/(?:total\s+)?exports?\s*[:=]?\s*VT?\s*([\d,]+(?:\.\d+)?)\s*(million|billion)?/gi);
    if (exportMatch && exportMatch[0]) {
        const amount = exportMatch[0].match(/([\d,]+(?:\.\d+)?)/);
        if (amount) {
            data.exports.total = parseFloat(amount[1].replace(/,/g, ''));
        }
    }

    // Extract import totals
    const importMatch = text.match(/(?:total\s+)?imports?\s*[:=]?\s*VT?\s*([\d,]+(?:\.\d+)?)\s*(million|billion)?/gi);
    if (importMatch && importMatch[0]) {
        const amount = importMatch[0].match(/([\d,]+(?:\.\d+)?)/);
        if (amount) {
            data.imports.total = parseFloat(amount[1].replace(/,/g, ''));
        }
    }

    // Extract trade balance
    const balanceMatch = text.match(/(?:trade\s+)?balance\s*[:=]?\s*VT?\s*(-?[\d,]+(?:\.\d+)?)\s*(million|billion)?/gi);
    if (balanceMatch && balanceMatch[0]) {
        const amount = balanceMatch[0].match(/(-?[\d,]+(?:\.\d+)?)/);
        if (amount) {
            data.balance.total = parseFloat(amount[1].replace(/,/g, ''));
        }
    }

    return data;
}

// Helper function to extract commodity data from tables
function extractCommodities(tables) {
    const commodities = [];

    for (const table of tables) {
        for (const row of table) {
            // Look for commodity names followed by values
            const commodityMatch = row.match(/^([A-Za-z\s,&-]+?)\s+([\d,]+(?:\.\d+)?)/);
            if (commodityMatch) {
                const name = commodityMatch[1].trim();
                const value = parseFloat(commodityMatch[2].replace(/,/g, ''));

                // Filter out header rows and invalid entries
                if (name.length > 3 && !name.match(/^(total|period|month|year)/i)) {
                    commodities.push({
                        name: name,
                        value: value
                    });
                }
            }
        }
    }

    return commodities;
}

// Helper function to extract country data
function extractCountries(text, tables) {
    const countries = [];
    const commonCountries = [
        'Australia', 'China', 'Fiji', 'Japan', 'New Zealand', 'Singapore',
        'Thailand', 'France', 'USA', 'United States', 'PNG', 'Papua New Guinea',
        'New Caledonia', 'Solomon Islands', 'Indonesia', 'Malaysia', 'Philippines'
    ];

    for (const table of tables) {
        for (const row of table) {
            for (const country of commonCountries) {
                if (row.includes(country)) {
                    const match = row.match(new RegExp(`${country}\\s+([\d,]+(?:\\.\\d+)?)`));
                    if (match) {
                        countries.push({
                            country: country,
                            value: parseFloat(match[1].replace(/,/g, ''))
                        });
                    }
                }
            }
        }
    }

    return countries;
}

async function extractPdfData() {
    try {
        console.log('Reading PDF file...');

        // Check if file exists
        if (!fs.existsSync(pdfPath)) {
            console.error(`PDF file not found: ${pdfPath}`);
            process.exit(1);
        }

        console.log('Parsing PDF content...');

        // Parse PDF using v2 API - convert file path to file:// URL
        const fileUrl = `file:///${pdfPath.replace(/\\/g, '/')}`;
        const parser = new PDFParse({ url: fileUrl });
        const textResult = await parser.getText();
        const pdfData = {
            text: textResult.text,
            numpages: textResult.pages.length,
            info: textResult.metadata
        };

        console.log(`\nPDF Information:`);
        console.log(`- Total pages: ${pdfData.numpages}`);
        console.log(`- Text length: ${pdfData.text.length} characters`);

        // Extract data
        console.log('\nExtracting structured data...');

        const tables = extractTables(pdfData.text);
        const statistics = extractKeyStatistics(pdfData.text);
        const tradeData = extractTradeData(pdfData.text);
        const commodities = extractCommodities(tables);
        const countries = extractCountries(pdfData.text, tables);

        // Combine all extracted data
        const extractedData = {
            metadata: {
                source: 'International Merchandise Trade Highlight',
                filename: path.basename(pdfPath),
                extractedAt: new Date().toISOString(),
                pages: pdfData.numpages
            },
            period: tradeData.period,
            tradeData: tradeData,
            statistics: statistics,
            commodities: commodities.slice(0, 20), // Top 20
            countries: countries.slice(0, 15), // Top 15
            tables: tables.map(table => table.slice(0, 10)), // First 10 rows of each table
            rawText: pdfData.text.substring(0, 5000) // First 5000 chars for reference
        };

        // Ensure extracted_data directory exists
        const extractedDir = path.join(__dirname, '..', 'extracted_data');
        if (!fs.existsSync(extractedDir)) {
            fs.mkdirSync(extractedDir, { recursive: true });
        }

        // Save full extracted data
        const outputPath = path.join(extractedDir, 'pdf_data.json');
        fs.writeFileSync(outputPath, JSON.stringify(extractedData, null, 2));

        console.log(`\n✅ Data extracted successfully!`);
        console.log(`📄 Output: ${outputPath}`);
        console.log(`\n📊 Extracted Data Summary:`);
        console.log(`- Period: ${extractedData.period || 'Not found'}`);
        console.log(`- Tables found: ${tables.length}`);
        console.log(`- Statistics: ${Object.keys(statistics).length}`);
        console.log(`- Commodities: ${commodities.length}`);
        console.log(`- Countries: ${countries.length}`);

        // Display sample data
        if (tradeData.exports.total || tradeData.imports.total) {
            console.log(`\n📈 Trade Summary:`);
            if (tradeData.exports.total) {
                console.log(`- Total Exports: ${tradeData.exports.total.toLocaleString()}`);
            }
            if (tradeData.imports.total) {
                console.log(`- Total Imports: ${tradeData.imports.total.toLocaleString()}`);
            }
            if (tradeData.balance.total) {
                console.log(`- Trade Balance: ${tradeData.balance.total.toLocaleString()}`);
            }
        }

        if (commodities.length > 0) {
            console.log(`\n🏷️  Top Commodities:`);
            commodities.slice(0, 5).forEach((item, i) => {
                console.log(`  ${i + 1}. ${item.name}: ${item.value.toLocaleString()}`);
            });
        }

        if (countries.length > 0) {
            console.log(`\n🌍 Top Countries:`);
            countries.slice(0, 5).forEach((item, i) => {
                console.log(`  ${i + 1}. ${item.country}: ${item.value.toLocaleString()}`);
            });
        }

        // Save raw text for manual review
        const textOutputPath = path.join(extractedDir, 'pdf_raw_text.txt');
        fs.writeFileSync(textOutputPath, pdfData.text);
        console.log(`\n📝 Raw text saved to: ${textOutputPath}`);

        console.log(`\n✨ Extraction complete!`);

    } catch (error) {
        console.error('Error extracting PDF data:', error.message);
        console.error(error);
        process.exit(1);
    }
}

// Run extraction
extractPdfData();
