import { Container, Row, Col, Card, Form } from 'react-bootstrap';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

function Overview({ data, selectedYear, setSelectedYear }) {
    if (!data || !data.balanceOfTrade) {
        return (
            <Container className="mt-5">
                <div className="alert alert-warning">No data available</div>
            </Container>
        );
    }

    const balanceData = data.balanceOfTrade?.data || [];
    const years = ['2020', '2021', '2022', '2023', '2024'];

    // Calculate key metrics
    const latestYear = balanceData[balanceData.length - 1] || {};
    const previousYear = balanceData[balanceData.length - 2] || {};

    const exports = parseFloat(latestYear['Total'] || 0);
    const imports = parseFloat(latestYear['Imports CIF'] || 0);
    const tradeBalance = exports - imports;

    const prevExports = parseFloat(previousYear['Total'] || 0);
    const prevImports = parseFloat(previousYear['Imports CIF'] || 0);

    const exportChange = ((exports - prevExports) / prevExports * 100).toFixed(1);
    const importChange = ((imports - prevImports) / prevImports * 100).toFixed(1);

    // Chart data
    const lineChartData = {
        labels: years,
        datasets: [
            {
                label: 'Exports (VT Million)',
                data: balanceData.slice(-5).map(row => parseFloat(row['Total'] || 0)),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Imports (VT Million)',
                data: balanceData.slice(-5).map(row => parseFloat(row['Imports CIF'] || 0)),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4,
                fill: true
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Trade Trends (Last 5 Years)',
                font: {
                    size: 16,
                    weight: 'bold'
                }
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    callback: function (value) {
                        return value.toLocaleString() + 'M';
                    }
                }
            }
        }
    };

    return (
        <>
            <div className="page-header">
                <Container>
                    <h1 className="page-title">Vanuatu International Merchandise Trade Statistics</h1>
                    <p className="page-subtitle">
                        Comprehensive overview of trade data from Nov 2024 - July 2025
                    </p>
                </Container>
            </div>

            <Container>
                {/* Summary Cards */}
                <Row className="mb-4">
                    <Col md={3} className="mb-3">
                        <div className="stat-card fade-in">
                            <h3>Total Exports</h3>
                            <div className="stat-value">{exports.toLocaleString()}</div>
                            <div className={`stat-change ${exportChange >= 0 ? 'positive' : 'negative'}`}>
                                {exportChange >= 0 ? '↑' : '↓'} {Math.abs(exportChange)}% YoY
                            </div>
                            <div className="stat-description">VT Million (FOB)</div>
                        </div>
                    </Col>
                    <Col md={3} className="mb-3">
                        <div className="stat-card fade-in" style={{ animationDelay: '0.1s' }}>
                            <h3>Total Imports</h3>
                            <div className="stat-value">{imports.toLocaleString()}</div>
                            <div className={`stat-change ${importChange >= 0 ? 'positive' : 'negative'}`}>
                                {importChange >= 0 ? '↑' : '↓'} {Math.abs(importChange)}% YoY
                            </div>
                            <div className="stat-description">VT Million (CIF)</div>
                        </div>
                    </Col>
                    <Col md={3} className="mb-3">
                        <div className="stat-card fade-in" style={{ animationDelay: '0.2s' }}>
                            <h3>Trade Balance</h3>
                            <div className="stat-value" style={{ color: tradeBalance < 0 ? '#dc3545' : '#28a745' }}>
                                {tradeBalance.toLocaleString()}
                            </div>
                            <div className={`stat-change ${tradeBalance < 0 ? 'negative' : 'positive'}`}>
                                {tradeBalance < 0 ? 'Deficit' : 'Surplus'}
                            </div>
                            <div className="stat-description">VT Million</div>
                        </div>
                    </Col>
                    <Col md={3} className="mb-3">
                        <div className="stat-card fade-in" style={{ animationDelay: '0.3s' }}>
                            <h3>Coverage Ratio</h3>
                            <div className="stat-value">{((exports / imports) * 100).toFixed(1)}%</div>
                            <div className="stat-description">Exports/Imports</div>
                        </div>
                    </Col>
                </Row>

                {/* Trade Trends Chart */}
                <Row className="mb-4">
                    <Col lg={12}>
                        <div className="chart-container fade-in">
                            <div className="chart-header">
                                <div className="chart-title">Trade Trends</div>
                                <Form.Select
                                    style={{ width: '150px' }}
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(e.target.value)}
                                >
                                    <option value="2024">2024</option>
                                    <option value="2023">2023</option>
                                    <option value="2022">2022</option>
                                    <option value="2021">2021</option>
                                    <option value="2020">2020</option>
                                </Form.Select>
                            </div>
                            <Line data={lineChartData} options={chartOptions} />
                        </div>
                    </Col>
                </Row>

                {/* Key Insights */}
                <Row className="mb-4">
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-3">
                                    <strong>Key Insights</strong>
                                </Card.Title>
                                <Row>
                                    <Col md={6}>
                                        <h6>📊 Trade Performance</h6>
                                        <ul>
                                            <li>Exports {exportChange >= 0 ? 'increased' : 'decreased'} by {Math.abs(exportChange)}% compared to previous year</li>
                                            <li>Imports {importChange >= 0 ? 'increased' : 'decreased'} by {Math.abs(importChange)}% year-over-year</li>
                                            <li>Trade balance shows a {tradeBalance < 0 ? 'deficit' : 'surplus'} of VT {Math.abs(tradeBalance).toLocaleString()} million</li>
                                        </ul>
                                    </Col>
                                    <Col md={6}>
                                        <h6>🌏 Latest Updates</h6>
                                        <ul>
                                            <li>Data period: November 2024 - July 2025</li>
                                            <li>Commodity classification: HS (Harmonized System)</li>
                                            <li>Values in VT Million</li>
                                            <li>Regular monthly updates</li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Quick Navigation */}
                <Row>
                    <Col md={12}>
                        <Card className="shadow-sm">
                            <Card.Body>
                                <Card.Title className="mb-3">
                                    <strong>Explore More</strong>
                                </Card.Title>
                                <Row>
                                    <Col md={3} className="mb-2">
                                        <div className="metric-badge badge-primary w-100">📈 Trade Balance →</div>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <div className="metric-badge badge-success w-100">📤 Exports Analysis →</div>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <div className="metric-badge badge-danger w-100">📥 Imports Analysis →</div>
                                    </Col>
                                    <Col md={3} className="mb-2">
                                        <div className="metric-badge badge-warning w-100">🌍 Trade Partners →</div>
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

export default Overview;
