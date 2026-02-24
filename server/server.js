import express from 'express';
import multer from 'multer';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

// Configure CORS
app.use(cors());
app.use(express.json());

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Keep original filename with timestamp
        const timestamp = Date.now();
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext);
        cb(null, `${name}_${timestamp}${ext}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['.xlsx', '.xls', '.csv'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedTypes.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only Excel (.xlsx, .xls) and CSV files are allowed!'));
        }
    },
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Upload endpoint
app.post('/api/upload', upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File uploaded:', req.file.filename);

        // Copy uploaded file to the expected location
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        const sourceFile = path.join(uploadsDir, req.file.filename);
        const targetFile = path.join(__dirname, '..', 'data', 'current_data.xlsx');

        // Create data directory if it doesn't exist
        const dataDir = path.join(__dirname, '..', 'data');
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        // Copy file
        fs.copyFileSync(sourceFile, targetFile);

        // Run data processing script
        console.log('Processing data...');
        const scriptPath = path.join(__dirname, '..', 'scripts', 'processDataFromUpload.js');

        const { stdout, stderr } = await execPromise(`node "${scriptPath}" "${targetFile}"`);

        if (stderr && !stderr.includes('warning')) {
            console.error('Processing stderr:', stderr);
        }

        console.log('Processing stdout:', stdout);

        res.json({
            success: true,
            message: 'File uploaded and processed successfully',
            filename: req.file.filename,
            originalName: req.file.originalname,
            size: req.file.size,
            processLog: stdout
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({
            error: 'Failed to process file',
            message: error.message
        });
    }
});

// Get current data info
app.get('/api/data-info', (req, res) => {
    try {
        const dataFile = path.join(__dirname, '..', 'public', 'data.json');

        if (fs.existsSync(dataFile)) {
            const stats = fs.statSync(dataFile);
            const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));

            res.json({
                exists: true,
                lastModified: stats.mtime,
                size: stats.size,
                metadata: data.metadata || {},
                recordCounts: {
                    balanceOfTrade: data.balanceOfTrade?.length || 0,
                    principalExports: data.principalExports?.length || 0,
                    principalImports: data.principalImports?.length || 0,
                    tradeByCountry: data.tradeByCountry?.length || 0,
                    tradeByRegion: data.tradeByRegion?.length || 0
                }
            });
        } else {
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get upload history
app.get('/api/uploads', (req, res) => {
    try {
        const uploadsDir = path.join(__dirname, '..', 'uploads');

        if (!fs.existsSync(uploadsDir)) {
            return res.json({ uploads: [] });
        }

        const files = fs.readdirSync(uploadsDir);
        const uploads = files.map(filename => {
            const filePath = path.join(uploadsDir, filename);
            const stats = fs.statSync(filePath);
            return {
                filename,
                size: stats.size,
                uploadedAt: stats.mtime
            };
        }).sort((a, b) => b.uploadedAt - a.uploadedAt);

        res.json({ uploads });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Upload server running on http://localhost:${PORT}`);
    console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/upload`);
    console.log(`📊 Data info: http://localhost:${PORT}/api/data-info`);
});
