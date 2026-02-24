import { Container, Row, Col, Table, Card } from 'react-bootstrap';
import { Doughnut, Bar } from 'react-chartjs-2';

function TradePartners({ data }) {
    if (!data || !data.tradeByRegion) {
        return (
            <Container className="mt-5">
                <div className="alert alert-warning">No data available</div>
            </Container>
        );
    }

    const regionData = data.tradeByRegion?.data || [];
    const countryData = data.tradeByCountry?.data || [];

    const topRegions = regionData.slice(0, 5);
    const topCountries = countryData.slice(0, 10);

    const pieChartData = {
        labels: topRegions.map(row => row['Region'] || 'Unknown'),
        datasets: [
            {
                label: 'Trade by Region (VT Million)',
                data: topRegions.map(row => parseFloat(row['Total'] || row['2024'] || 0)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const barChartData = {
        labels: topCountries.map(row => row['Country'] || row['Partner Country'] || 'Unknown'),
        datasets: [
            {
                label: 'Trade Value (VT Million)',
                data: topCountries.map(row => parseFloat(row['Total'] || row['2024'] || 0)),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top Trading Partners',
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            x: {
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
                    <h1 className="page-title">Trade Partners</h1>
                    <p className="page-subtitle">Analysis by country and region</p>
                </Container>
            </div>

            <Container>
                <Row className="mb-4">
                    <Col lg={6} className="mb-3">
                        <div className="chart-container">
                            <h5 className="text-center mb-3">Trade by Region</h5>
                            <Doughnut data={pieChartData} />
                        </div>
                    </Col>
                    <Col lg={6} className="mb-3">
                        <div className="chart-container">
                            <Bar data={barChartData} options={barOptions} />
                        </div>
                    </Col>
                </Row>

                <Row className="mb-4">
                    <Col lg={6}>
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <Card.Title><strong>Regional Distribution</strong></Card.Title>
                                <Table striped hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>Region</th>
                                            <th className="text-end">Value (VT M)</th>
                                            <th className="text-end">%</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topRegions.map((row, idx) => {
                                            const value = parseFloat(row['Total'] || row['2024'] || 0);
                                            const total = topRegions.reduce((sum, r) => sum + parseFloat(r['Total'] || r['2024'] || 0), 0);
                                            const percentage = ((value / total) * 100).toFixed(1);

                                            return (
                                                <tr key={idx}>
                                                    <td>{row['Region']}</td>
                                                    <td className="text-end">{value.toLocaleString()}</td>
                                                    <td className="text-end"><strong>{percentage}%</strong></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>

                    <Col lg={6}>
                        <Card className="shadow-sm mb-3">
                            <Card.Body>
                                <Card.Title><strong>Top Partner Countries</strong></Card.Title>
                                <Table striped hover size="sm">
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Country</th>
                                            <th className="text-end">Value (VT M)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {topCountries.slice(0, 5).map((row, idx) => {
                                            const value = parseFloat(row['Total'] || row['2024'] || 0);

                                            return (
                                                <tr key={idx}>
                                                    <td>{idx + 1}</td>
                                                    <td>{row['Country'] || row['Partner Country']}</td>
                                                    <td className="text-end"><strong>{value.toLocaleString()}</strong></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </Table>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <div className="data-table">
                            <h4 className="p-3 mb-0 bg-light">All Trading Partners</h4>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Partner</th>
                                        <th>Type</th>
                                        <th className="text-end">Trade Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {countryData.slice(0, 15).map((row, index) => {
                                        const value = parseFloat(row['Total'] || row['2024'] || 0);

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><strong>{row['Country'] || row['Partner Country'] || 'Unknown'}</strong></td>
                                                <td><span className="badge bg-secondary">Country</span></td>
                                                <td className="text-end">{value.toLocaleString()} VT M</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default TradePartners;
