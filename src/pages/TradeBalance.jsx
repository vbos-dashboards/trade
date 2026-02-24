import { Container, Row, Col, Table } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';

function TradeBalance({ data }) {
    if (!data || !data.balanceOfTrade) {
        return (
            <Container className="mt-5">
                <div className="alert alert-warning">No data available</div>
            </Container>
        );
    }

    const balanceData = data.balanceOfTrade?.data || [];
    const recentData = balanceData.slice(-10);

    const chartData = {
        labels: recentData.map(row => row['Period'] || ''),
        datasets: [
            {
                label: 'Trade Balance',
                data: recentData.map(row => {
                    const exports = parseFloat(row['Total'] || 0);
                    const imports = parseFloat(row['Imports CIF'] || 0);
                    return exports - imports;
                }),
                borderColor: 'rgb(53, 162, 235)',
                backgroundColor: 'rgba(53, 162, 235, 0.5)',
                tension: 0.4
            }
        ]
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Trade Balance Trend (Last 10 Periods)',
                font: { size: 16, weight: 'bold' }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                ticks: {
                    callback: value => value.toLocaleString() + 'M'
                }
            }
        }
    };

    return (
        <>
            <div className="page-header">
                <Container>
                    <h1 className="page-title">Balance of Trade</h1>
                    <p className="page-subtitle">Analysis of Vanuatu's trade surplus/deficit</p>
                </Container>
            </div>

            <Container>
                <Row className="mb-4">
                    <Col lg={12}>
                        <div className="chart-container">
                            <Line data={chartData} options={options} />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col lg={12}>
                        <div className="data-table">
                            <h4 className="p-3 mb-0 bg-light">Detailed Trade Balance Data</h4>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Period</th>
                                        <th>Exports (FOB)</th>
                                        <th>Re-exports</th>
                                        <th>Total Exports</th>
                                        <th>Imports (CIF)</th>
                                        <th>Trade Balance</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {recentData.map((row, index) => {
                                        const exports = parseFloat(row['Exports'] || 0);
                                        const reexports = parseFloat(row['Re-exports'] || 0);
                                        const total = parseFloat(row['Total'] || 0);
                                        const imports = parseFloat(row['Imports CIF'] || 0);
                                        const balance = total - imports;

                                        return (
                                            <tr key={index}>
                                                <td><strong>{row['Period']}</strong></td>
                                                <td>{exports.toLocaleString()}</td>
                                                <td>{reexports.toLocaleString()}</td>
                                                <td><strong>{total.toLocaleString()}</strong></td>
                                                <td>{imports.toLocaleString()}</td>
                                                <td style={{
                                                    color: balance < 0 ? '#dc3545' : '#28a745',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {balance.toLocaleString()}
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

export default TradeBalance;
