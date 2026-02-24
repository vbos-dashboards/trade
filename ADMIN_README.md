# 📤 Admin Upload System

## Overview

The Admin Upload System allows you to upload new Excel or CSV files to automatically update the dashboard data without needing to manually process files or redeploy.

## Features

- ✅ Upload Excel (.xlsx, .xls) or CSV files
- ✅ Automatic data processing and validation  
- ✅ Real-time upload progress
- ✅ Upload history tracking
- ✅ Current data status monitoring
- ✅ Instant dashboard updates

## Setup

### 1. Backend Server

The backend server handles file uploads and data processing.

**Start the server:**
```bash
npm run server
```

The server will run on `http://localhost:3001`

### 2. Development Environment

Run both the backend server and frontend development server:

**Terminal 1 - Backend:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## Usage

### Accessing the Admin Page

1. Navigate to: `http://localhost:5173/admin` (or your dev server URL)
2. Or click the "🔧 Admin" link in the navigation bar

### Uploading Data

1. **Prepare your file:**
   - Excel file (.xlsx or .xls) with the same structure as the original
   - Required sheets: `1_BalanceOfTrade`, `6_PrincipalExports`, `7_PrincipalImports`, etc.

2. **Upload process:**
   - Click "Choose File" and select your Excel/CSV file
   - Review the selected file information
   - Click "Upload and Process"
   - Wait for processing to complete (progress bar will show status)
   - Dashboard will automatically refresh with new data

### File Structure Requirements

Your Excel file must contain these sheets:

- **1_BalanceOfTrade** - Trade balance data
- **6_PrincipalExports** - Top export commodities
- **7_PrincipalImports** - Top import commodities  
- **8_BalanceOfTradePartnerCountry** - Trade by country
- **9_BalanceOfTradeRegion** - Trade by region
- **10_TradeByModeTransport** - Transport mode data

## API Endpoints

### Backend Server (Port 3001)

- `GET /api/health` - Check server status
- `POST /api/upload` - Upload and process data file
- `GET /api/data-info` - Get current data information
- `GET /api/uploads` - Get upload history

## Troubleshooting

### Server Not Running

**Error:** "Backend server is not running"

**Solution:**
```bash
npm run server
```

### File Upload Fails

**Possible causes:**
- File is too large (max 50MB)
- Incorrect file format
- Missing required sheets in Excel file

**Solution:** Check the file format and structure

### Processing Errors

**Error:** "Failed to process file"

**Solution:**
- Verify Excel file has correct sheet names
- Check data format matches original structure
- View console logs for detailed error messages

## Production Deployment

For production use, you'll need to:

1. Deploy the backend server separately (e.g., on Heroku, DigitalOcean)
2. Update `BACKEND_URL` in `Admin.jsx` to point to your production server
3. Ensure proper CORS configuration
4. Add authentication/authorization for security

## Security Considerations

⚠️ **Important:** The current implementation has no authentication. 

For production use, add:
- User authentication (login system)
- Authorization checks (admin-only access)
- File validation and sanitization
- Rate limiting
- HTTPS encryption

## File Storage

Uploaded files are stored in:
- `uploads/` - Original uploaded files with timestamps
- `data/` - Current active data file
- `public/data.json` - Processed JSON data used by dashboard

## Maintenance

### Clear Upload History

```bash
rm -rf uploads/*
```

### Reset Current Data

```bash
rm data/current_data.xlsx
```

### View Logs

Backend logs are displayed in the terminal where `npm run server` is running.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review console logs in browser developer tools
3. Check backend server terminal output
