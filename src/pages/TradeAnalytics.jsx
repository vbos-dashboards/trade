import { Container, Row, Col, Card } from 'react-bootstrap';
import { Line, Bar } from 'react-chartjs-2';

function TradeAnalytics({ data }) {
    if (!data) {
        return (
            <Container className="mt-5">
                <div className="alert alert-warning">No data available</div>
            </Container>
        );
    }

    const balanceData = data.balanceOfTrade?.data || [];
    const transportData = data.tradeByTransport?.data || [];
    const agreementData = data.tradeByAgreement?.data || [];

    const recentBalance = balanceData.slice(-12);

    // Coverage Ratio over time
    const coverageChartData = {
        labels: recentBalance.map(row => row['Period'] || ''),
        datasets: [
            {
                label: 'Coverage Ratio (%)',
                data: recentBalance.map(row => {
                    const exports = parseFloat(row['Total'] || 0);
                    const imports = parseFloat(row['Imports CIF'] || 0);
                    return imports > 0 ? ((exports / imports) * 100).toFixed(2) : 0;
                }),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    // Trade by Transport Mode
    const transportChartData = {
        labels: transportData.slice(0, 5).map(row => row['Mode'] || row['Transport Mode'] || 'Unknown'),
        datasets: [
            {
                label: 'Value (VT Million)',
                data: transportData.slice(0, 5).map(row => parseFloat(row['Total'] || row['2024'] || 0)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
            }
        ]
    };

    const lineOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Trade Coverage Ratio Trend',
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => value + '%'
                }
            }
        }
    };

    const barOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top' },
            title: {
                display: true,
                text: 'Trade by Mode of Transport',
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: value => value.toLocaleString()
                }
            }
        }
    };

    return (
        <>
            <div className="page-header">
                <Container>
                    <h1 className="page-title">Trade Analytics</h1>
                    <p className="page-subtitle">In-depth analysis and trends</p>
                </Container>
            </div>

            <Container>
                <Row className="mb-4">
                    <Col lg={12}>
                        <div className="chart-container">
                            <Line data={coverageChartData} options={lineOptions} />
                        </div>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col lg={6}>
                        <div className="chart-container">
                            <Bar data={transportChartData} options={barOptions} />
                        </div>
                    </Col>

                    <Col lg={6}>
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <Card.Title><strong>Analytics Insights</strong></Card.Title>
                                <hr />

                                <h6>📊 Coverage Ratio</h6>
                                <p className="small text-muted">
                                    The coverage ratio (Exports/Imports × 100) indicates how well exports cover imports.
                                    A ratio below 100% indicates a trade deficit.
                                </p>

                                <hr />

                                <h6>🚢 Transport Modes</h6>
                                <div className="small">
                                    {transportData.slice(0, 3).map((row, idx) => (
                                        <div key={idx} className="mb-2">
                                            <strong>{row['Mode'] || row['Transport Mode'] || 'Unknown'}:</strong>{' '}
                                            {parseFloat(row['Total'] || row['2024'] || 0).toLocaleString()} VT M
                                        </div>
                                    ))}
                                </div>

                                <hr />

                                <h6>🤝 Trade Agreements</h6>
                                <div className="small">
                                    <p className="mb-1">Active agreements tracked in system</p>
                                    <p className="mb-0">
                                        Data available: {agreementData.length} agreements
                                    </p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title><strong>Key Performance Indicators</strong></Card.Title>
                                <Row className="mt-3">
                                    <Col md={3} className="text-center mb-3">
                                        <div className="stat-card border-0">
                                            <h6 className="text-muted">Trade Intensity</h6>
                                            <div className="stat-value" style={{ fontSize: '2rem' }}>
                                                {recentBalance.length > 0 ? (
                                                    ((parseFloat(recentBalance[recentBalance.length - 1]['Total'] || 0) +
                                                        parseFloat(recentBalance[recentBalance.length - 1]['Imports CIF'] || 0)) / 2).toLocaleString()
                                                ) : 0}
                                            </div>
                                            <small className="text-muted">Average Trade Value</small>
                                        </div>
                                    </Col>

                                    <Col md={3} className="text-center mb-3">
                                        <div className="stat-card border-0">
                                            <h6 className="text-muted">Import Dependency</h6>
                                            <div className="stat-value" style={{ fontSize: '2rem', color: '#dc3545' }}>
                                                {recentBalance.length > 0 ? (
                                                    ((parseFloat(recentBalance[recentBalance.length - 1]['Imports CIF'] || 0) /
                                                        (parseFloat(recentBalance[recentBalance.length - 1]['Total'] || 0) +
                                                            parseFloat(recentBalance[recentBalance.length - 1]['Imports CIF'] || 0))) * 100).toFixed(0)
                                                ) : 0}%
                                            </div>
                                            <small className="text-muted">Share of Imports</small>
                                        </div>
                                    </Col>

                                    <Col md={3} className="text-center mb-3">
                                        <div className="stat-card border-0">
                                            <h6 className="text-muted">Export Strength</h6>
                                            <div className="stat-value" style={{ fontSize: '2rem', color: '#28a745' }}>
                                                {recentBalance.length > 0 ? (
                                                    ((parseFloat(recentBalance[recentBalance.length - 1]['Total'] || 0) /
                                                        (parseFloat(recentBalance[recentBalance.length - 1]['Total'] || 0) +
                                                            parseFloat(recentBalance[recentBalance.length - 1]['Imports CIF'] || 0))) * 100).toFixed(0)
                                                ) : 0}%
                                            </div>
                                            <small className="text-muted">Share of Exports</small>
                                        </div>
                                    </Col>

                                    <Col md={3} className="text-center mb-3">
                                        <div className="stat-card border-0">
                                            <h6 className="text-muted">Data Points</h6>
                                            <div className="stat-value" style={{ fontSize: '2rem' }}>
                                                {balanceData.length}
                                            </div>
                                            <small className="text-muted">Time Periods</small>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default TradeAnalytics;
