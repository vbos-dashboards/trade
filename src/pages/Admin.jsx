import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Table, Spinner, ProgressBar } from 'react-bootstrap';
import './Admin.css';

const BACKEND_URL = 'http://localhost:3001';

function Admin() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState(null);
    const [dataInfo, setDataInfo] = useState(null);
    const [uploadHistory, setUploadHistory] = useState([]);
    const [serverRunning, setServerRunning] = useState(false);

    useEffect(() => {
        checkServerStatus();
        loadDataInfo();
        loadUploadHistory();
    }, []);

    const checkServerStatus = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/health`);
            if (response.ok) {
                setServerRunning(true);
            }
        } catch (error) {
            setServerRunning(false);
        }
    };

    const loadDataInfo = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/data-info`);
            if (response.ok) {
                const data = await response.json();
                setDataInfo(data);
            }
        } catch (error) {
            console.error('Failed to load data info:', error);
        }
    };

    const loadUploadHistory = async () => {
        try {
            const response = await fetch(`${BACKEND_URL}/api/uploads`);
            if (response.ok) {
                const data = await response.json();
                setUploadHistory(data.uploads || []);
            }
        } catch (error) {
            console.error('Failed to load upload history:', error);
        }
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const ext = selectedFile.name.split('.').pop().toLowerCase();
            if (['xlsx', 'xls', 'csv'].includes(ext)) {
                setFile(selectedFile);
                setMessage(null);
            } else {
                setMessage({ type: 'danger', text: 'Please select an Excel (.xlsx, .xls) or CSV file' });
                setFile(null);
            }
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();

        if (!file) {
            setMessage({ type: 'warning', text: 'Please select a file first' });
            return;
        }

        if (!serverRunning) {
            setMessage({
                type: 'danger',
                text: 'Backend server is not running. Please start the server first: npm run server'
            });
            return;
        }

        setUploading(true);
        setUploadProgress(0);
        setMessage(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            // Simulate progress
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            const response = await fetch(`${BACKEND_URL}/api/upload`, {
                method: 'POST',
                body: formData,
            });

            clearInterval(progressInterval);
            setUploadProgress(100);

            const result = await response.json();

            if (response.ok) {
                setMessage({
                    type: 'success',
                    text: `File uploaded successfully! Dashboard data has been updated.`
                });
                setFile(null);
                // Reset file input
                document.getElementById('fileInput').value = '';

                // Reload data info and history
                setTimeout(() => {
                    loadDataInfo();
                    loadUploadHistory();
                    // Refresh the page to show new data
                    window.location.reload();
                }, 2000);
            } else {
                setMessage({
                    type: 'danger',
                    text: `Upload failed: ${result.error || result.message}`
                });
            }
        } catch (error) {
            setMessage({
                type: 'danger',
                text: `Upload error: ${error.message}. Make sure the backend server is running.`
            });
        } finally {
            setUploading(false);
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    const formatBytes = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Container className="admin-page py-4">
            <Row className="mb-4">
                <Col>
                    <h2>📤 Data Upload Administration</h2>
                    <p className="text-muted">Upload new Excel or CSV files to update the dashboard data</p>
                </Col>
            </Row>

            {/* Server Status */}
            <Row className="mb-4">
                <Col>
                    <Alert variant={serverRunning ? 'success' : 'warning'}>
                        <strong>Backend Server Status:</strong> {serverRunning ? '✅ Running' : '⚠️ Not Running'}
                        {!serverRunning && (
                            <div className="mt-2">
                                <small>To start the backend server, run: <code>npm run server</code></small>
                            </div>
                        )}
                    </Alert>
                </Col>
            </Row>

            {/* Upload Form */}
            <Row className="mb-4">
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Upload New Data File</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleUpload}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Select Excel or CSV File</Form.Label>
                                    <Form.Control
                                        id="fileInput"
                                        type="file"
                                        accept=".xlsx,.xls,.csv"
                                        onChange={handleFileChange}
                                        disabled={uploading}
                                    />
                                    <Form.Text className="text-muted">
                                        Accepted formats: .xlsx, .xls, .csv (Max size: 50MB)
                                    </Form.Text>
                                </Form.Group>

                                {file && (
                                    <Alert variant="info">
                                        <strong>Selected file:</strong> {file.name} ({formatBytes(file.size)})
                                    </Alert>
                                )}

                                {uploadProgress > 0 && uploadProgress < 100 && (
                                    <ProgressBar
                                        now={uploadProgress}
                                        label={`${uploadProgress}%`}
                                        animated
                                        className="mb-3"
                                    />
                                )}

                                {message && (
                                    <Alert variant={message.type} className="mb-3">
                                        {message.text}
                                    </Alert>
                                )}

                                <Button
                                    variant="primary"
                                    type="submit"
                                    disabled={!file || uploading || !serverRunning}
                                    className="w-100"
                                >
                                    {uploading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                                className="me-2"
                                            />
                                            Processing...
                                        </>
                                    ) : (
                                        <>📤 Upload and Process</>
                                    )}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Current Data Info */}
                <Col lg={4}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-secondary text-white">
                            <h6 className="mb-0">Current Data Status</h6>
                        </Card.Header>
                        <Card.Body>
                            {dataInfo && dataInfo.exists ? (
                                <>
                                    <p><strong>Last Updated:</strong><br />
                                        <small>{formatDate(dataInfo.lastModified)}</small></p>
                                    <p><strong>File Size:</strong> {formatBytes(dataInfo.size)}</p>
                                    <hr />
                                    <h6>Records:</h6>
                                    <ul className="list-unstyled small">
                                        <li>📊 Balance of Trade: {dataInfo.recordCounts.balanceOfTrade}</li>
                                        <li>📦 Exports: {dataInfo.recordCounts.principalExports}</li>
                                        <li>📥 Imports: {dataInfo.recordCounts.principalImports}</li>
                                        <li>🌍 Countries: {dataInfo.recordCounts.tradeByCountry}</li>
                                        <li>🗺️ Regions: {dataInfo.recordCounts.tradeByRegion}</li>
                                    </ul>
                                </>
                            ) : (
                                <p className="text-muted">No data available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Upload History */}
            <Row>
                <Col>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-dark text-white">
                            <h5 className="mb-0">Upload History</h5>
                        </Card.Header>
                        <Card.Body>
                            {uploadHistory.length > 0 ? (
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr>
                                            <th>Filename</th>
                                            <th>Size</th>
                                            <th>Uploaded At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {uploadHistory.map((upload, index) => (
                                            <tr key={index}>
                                                <td>{upload.filename}</td>
                                                <td>{formatBytes(upload.size)}</td>
                                                <td>{formatDate(upload.uploadedAt)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            ) : (
                                <p className="text-muted">No upload history available</p>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Instructions */}
            <Row className="mt-4">
                <Col>
                    <Card className="bg-light">
                        <Card.Body>
                            <h6>📝 Instructions:</h6>
                            <ol>
                                <li>Make sure the backend server is running: <code>npm run server</code></li>
                                <li>Prepare your Excel file with the same structure as the original data</li>
                                <li>Click "Choose File" and select your Excel or CSV file</li>
                                <li>Click "Upload and Process" to update the dashboard</li>
                                <li>The page will refresh automatically once processing is complete</li>
                            </ol>
                            <Alert variant="info" className="mb-0 mt-3">
                                <strong>Note:</strong> The uploaded file should have the same sheet names and structure as the original:
                                <ul className="mb-0 mt-2">
                                    <li>1_BalanceOfTrade</li>
                                    <li>6_PrincipalExports</li>
                                    <li>7_PrincipalImports</li>
                                    <li>8_BalanceOfTradePartnerCountry</li>
                                    <li>9_BalanceOfTradeRegion</li>
                                </ul>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Admin;
