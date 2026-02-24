# Vanuatu IMTS Dashboard

A comprehensive React-based dashboard for visualizing Vanuatu's International Merchandise Trade Statistics (IMTS) data from November 2024 to July 2025.

![Dashboard Preview](https://img.shields.io/badge/Status-Active-success)
![React](https://img.shields.io/badge/React-18.2-blue)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple)

## Features

### 📊 **Comprehensive Data Visualization**
- **Overview Dashboard**: Key trade metrics with year-over-year comparisons
- **Trade Balance Analysis**: Historical trends and coverage ratios
- **Exports Analysis**: Principal export commodities and trends
- **Imports Analysis**: Major import categories and patterns
- **Trade Partners**: Regional and country-level trade distribution
- **Advanced Analytics**: Key performance indicators and insights

### 🎨 **Professional Design**
- Modern, responsive Bootstrap UI
- Interactive charts using Chart.js
- Clean, intuitive navigation
- Mobile-friendly design
- Professional color scheme

### 📈 **Data Categories**
1. Balance of Trade (All Items)
2. Imports by HS Code
3. Exports by HS Code
4. Principal Exports
5. Principal Imports
6. Trade by Partner Country
7. Trade by Region
8. Trade by Mode of Transport
9. Trade by Trade Agreement

## Tech Stack

- **Frontend Framework**: React 18.2
- **UI Framework**: Bootstrap 5.3 + React-Bootstrap
- **Charts**: Chart.js + React-Chartjs-2
- **Routing**: React Router DOM
- **Data Processing**: XLSX (Excel file parsing)
- **Build Tool**: Vite

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Excel file: `Tables_Nov2024_July2025.xlsx` in `c:\Users\jyaruel\Downloads\`

### Installation

1. **Navigate to the project directory**:
   ```bash
   cd c:\Users\jyaruel\vanuatu-imts-dashboard
   ```

2. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

3. **Load the data from Excel**:
   ```bash
   npm run load-data
   ```
   This will process the Excel file and create `public/data.json`

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Build for Production

To create an optimized production build:

```bash
npm run build
```

The built files will be in the `dist/` folder.

To preview the production build locally:

```bash
npm run preview
```

## Project Structure

```
vanuatu-imts-dashboard/
├── public/
│   └── data.json              # Processed trade data (generated)
├── scripts/
│   └── loadData.js            # Excel to JSON converter
├── src/
│   ├── components/
│   │   └── Navigation.jsx     # Main navigation bar
│   ├── pages/
│   │   ├── Overview.jsx       # Dashboard overview
│   │   ├── TradeBalance.jsx   # Trade balance analysis
│   │   ├── Exports.jsx        # Exports analysis
│   │   ├── Imports.jsx        # Imports analysis
│   │   ├── TradePartners.jsx  # Partner countries/regions
│   │   ├── TradeAnalytics.jsx # Advanced analytics
│   │   └── Methodology.jsx    # Data methodology
│   ├── App.jsx                # Main app component
│   ├── App.css                # Dashboard styles
│   ├── index.css              # Global styles
│   └── main.jsx               # Entry point
├── package.json
└── README.md
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run load-data` - Process Excel data to JSON

## Dashboard Pages

### 1. Overview
- Summary cards with key metrics
- Trade trends line chart
- Year-over-year comparisons
- Quick insights

### 2. Trade Balance
- Historical trade balance trends
- Detailed data table
- Exports vs imports analysis

### 3. Exports
- Top 10 principal exports
- Bar chart visualization
- Detailed commodity breakdown
- Year-over-year trends

### 4. Imports
- Top 10 principal imports
- Bar chart visualization
- Commodity analysis
- Import trends

### 5. Trade Partners
- Regional distribution (pie chart)
- Top trading countries (bar chart)
- Comprehensive partner list

### 6. Analytics
- Coverage ratio trends
- Trade by transport mode
- Key performance indicators
- Trade intensity metrics

### 7. Methodology
- Data sources and definitions
- Classification systems
- Data limitations
- Contact information

## Customization

### Update Data Source

To change the Excel file location, edit `scripts/loadData.js`:

```javascript
const excelFilePath = 'YOUR_PATH_HERE/Tables_Nov2024_July2025.xlsx';
```

### Modify Color Scheme

Edit CSS variables in `src/App.css`:

```css
:root {
  --primary-color: #0056b3;
  --secondary-color: #6c757d;
  --success-color: #28a745;
  --danger-color: #dc3545;
}
```

## Troubleshooting

### Data not loading
- Ensure `npm run load-data` completed successfully
- Check that `public/data.json` exists
- Verify Excel file path is correct

### Charts not displaying
- Clear browser cache
- Check console for errors
- Ensure all dependencies are installed

## License

This project is for the use of Vanuatu Bureau of Statistics.

## Contact

For questions or support:
- **Organization**: Vanuatu Bureau of Statistics
- **Email**: statistics@vanuatu.gov.vu

---

**Built with ❤️ for Vanuatu's Trade Statistics**

