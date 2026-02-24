import { Container, Row, Col, Table, Card } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';

function Imports({ data }) {
    if (!data || !data.principalImports) {
        return (
            <Container className="mt-5">
                <div className="alert alert-warning">No data available</div>
            </Container>
        );
    }

    const importsData = data.principalImports?.data || [];
    const topImports = importsData.slice(0, 10);

    const chartData = {
        labels: topImports.map(row => row['Commodity'] || 'Unknown'),
        datasets: [
            {
                label: '2024 YTD (VT Million)',
                data: topImports.map(row => parseFloat(row['YTD'] || 0)),
                backgroundColor: 'rgba(255, 99, 132, 0.6)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }
        ]
    };

    const options = {
        indexAxis: 'y',
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Top 10 Principal Imports (2024 YTD)',
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
                    <h1 className="page-title">Principal Imports</h1>
                    <p className="page-subtitle">Key import commodities and trends</p>
                </Container>
            </div>

            <Container>
                <Row className="mb-4">
                    <Col lg={8}>
                        <div className="chart-container">
                            <Bar data={chartData} options={options} />
                        </div>
                    </Col>
                    <Col lg={4}>
                        <Card className="shadow-sm h-100">
                            <Card.Body>
                                <Card.Title><strong>Import Highlights</strong></Card.Title>
                                <hr />
                                <h6>📦 Top Categories</h6>
                                <ul className="small">
                                    {topImports.slice(0, 5).map((row, idx) => (
                                        <li key={idx}>
                                            <strong>{row['Commodity']}</strong>: {parseFloat(row['YTD'] || 0).toLocaleString()} VT M
                                        </li>
                                    ))}
                                </ul>
                                <hr />
                                <h6>📊 Statistics</h6>
                                <div className="small">
                                    <p className="mb-1">Total Commodities: {importsData.length}</p>
                                    <p className="mb-1">Data Format: VT Million</p>
                                    <p className="mb-0">Period: Year to Date</p>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <div className="data-table">
                            <h4 className="p-3 mb-0 bg-light">Principal Imports - Detailed View</h4>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Commodity</th>
                                        <th>2022</th>
                                        <th>2023</th>
                                        <th>2024 YTD</th>
                                        <th>Trend</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topImports.map((row, index) => {
                                        const val2022 = parseFloat(row['2022'] || 0);
                                        const val2023 = parseFloat(row['2023'] || 0);
                                        const val2024 = parseFloat(row['YTD'] || 0);
                                        const change = val2023 > 0 ? ((val2024 - val2023) / val2023 * 100).toFixed(1) : 0;

                                        return (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td><strong>{row['Commodity']}</strong></td>
                                                <td>{val2022.toLocaleString()}</td>
                                                <td>{val2023.toLocaleString()}</td>
                                                <td><strong>{val2024.toLocaleString()}</strong></td>
                                                <td style={{ color: change >= 0 ? '#dc3545' : '#28a745' }}>
                                                    {change >= 0 ? '↑' : '↓'} {Math.abs(change)}%
                                                </td>
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

export default Imports;
