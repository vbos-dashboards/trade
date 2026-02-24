import { Container, Row, Col, Card, Accordion } from 'react-bootstrap';

function Methodology() {
    return (
        <>
            <div className="page-header">
                <Container>
                    <h1 className="page-title">Methodology</h1>
                    <p className="page-subtitle">Data sources, definitions, and limitations</p>
                </Container>
            </div>

            <Container>
                <Row className="mb-4">
                    <Col lg={8} className="mx-auto">
                        <Card className="shadow-sm mb-4">
                            <Card.Body>
                                <Card.Title><strong>About This Dashboard</strong></Card.Title>
                                <p>
                                    This dashboard presents International Merchandise Trade Statistics (IMTS) for Vanuatu,
                                    covering the period from November 2024 to July 2025. The data provides comprehensive
                                    insights into Vanuatu's trade patterns, principal commodities, and trading partners.
                                </p>
                            </Card.Body>
                        </Card>

                        <Accordion defaultActiveKey="0">
                            <Accordion.Item eventKey="0">
                                <Accordion.Header><strong>📊 Data Sources</strong></Accordion.Header>
                                <Accordion.Body>
                                    <ul>
                                        <li><strong>Primary Source:</strong> Vanuatu Bureau of Statistics</li>
                                        <li><strong>Data Period:</strong> November 2024 - July 2025</li>
                                        <li><strong>Update Frequency:</strong> Monthly</li>
                                        <li><strong>Coverage:</strong> All merchandise trade (imports and exports)</li>
                                        <li><strong>Currency:</strong> Vanuatu Vatu (VT) in millions</li>
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="1">
                                <Accordion.Header><strong>📖 Key Definitions</strong></Accordion.Header>
                                <Accordion.Body>
                                    <dl>
                                        <dt>Exports (FOB)</dt>
                                        <dd>
                                            Free On Board - goods exported exclude international freight and insurance costs
                                        </dd>

                                        <dt>Imports (CIF)</dt>
                                        <dd>
                                            Cost, Insurance, and Freight - goods imported include international freight
                                            and insurance up to Vanuatu's border
                                        </dd>

                                        <dt>Re-exports</dt>
                                        <dd>
                                            Foreign goods exported in the same state as previously imported
                                        </dd>

                                        <dt>Trade Balance</dt>
                                        <dd>
                                            The difference between total exports and imports (surplus if positive,
                                            deficit if negative)
                                        </dd>

                                        <dt>Coverage Ratio</dt>
                                        <dd>
                                            (Exports / Imports) × 100 - indicates the extent to which exports cover imports
                                        </dd>

                                        <dt>HS Classification</dt>
                                        <dd>
                                            Harmonized System - international nomenclature for classifying traded products
                                        </dd>
                                    </dl>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="2">
                                <Accordion.Header><strong>📋 Data Classifications</strong></Accordion.Header>
                                <Accordion.Body>
                                    <h6>Trade data is classified by:</h6>
                                    <ul>
                                        <li><strong>Harmonized System (HS):</strong> International standard for commodity classification</li>
                                        <li><strong>SITC (Standard International Trade Classification):</strong> UN classification system</li>
                                        <li><strong>BEC (Broad Economic Categories):</strong> Classification by end-use</li>
                                        <li><strong>Partner Country:</strong> Country of origin/destination</li>
                                        <li><strong>Region:</strong> Geographic grouping of trading partners</li>
                                        <li><strong>Mode of Transport:</strong> Air, sea, postal, etc.</li>
                                        <li><strong>Trade Agreement:</strong> Bilateral or multilateral agreements</li>
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="3">
                                <Accordion.Header><strong>⚠️ Data Limitations</strong></Accordion.Header>
                                <Accordion.Body>
                                    <ul>
                                        <li>
                                            <strong>Valuation Differences:</strong> Exports are valued FOB while imports
                                            are valued CIF, making direct comparison subject to freight and insurance differences
                                        </li>
                                        <li>
                                            <strong>Time Lags:</strong> Some data may be subject to revisions as more
                                            complete information becomes available
                                        </li>
                                        <li>
                                            <strong>Informal Trade:</strong> Small-scale or informal cross-border trade
                                            may not be fully captured
                                        </li>
                                        <li>
                                            <strong>Re-exports:</strong> May not be fully distinguished from domestic
                                            exports in all cases
                                        </li>
                                        <li>
                                            <strong>Seasonal Variations:</strong> Trade flows may vary significantly
                                            by season, affecting monthly comparisons
                                        </li>
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="4">
                                <Accordion.Header><strong>🔍 Data Quality & Verification</strong></Accordion.Header>
                                <Accordion.Body>
                                    <p>Data undergoes several quality checks:</p>
                                    <ul>
                                        <li>Cross-validation with customs declarations</li>
                                        <li>Comparison with partner country statistics</li>
                                        <li>Consistency checks across different classifications</li>
                                        <li>Outlier detection and verification</li>
                                        <li>Temporal consistency analysis</li>
                                    </ul>
                                    <p className="mt-3 mb-0">
                                        <strong>Note:</strong> Users should exercise caution when interpreting
                                        month-to-month changes, as these can be influenced by various factors
                                        including seasonal patterns, one-off shipments, and data collection timing.
                                    </p>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="5">
                                <Accordion.Header><strong>📞 Contact Information</strong></Accordion.Header>
                                <Accordion.Body>
                                    <p>
                                        For questions about the data or to report issues:
                                    </p>
                                    <ul>
                                        <li><strong>Organization:</strong> Vanuatu National Statistics Office</li>
                                        <li><strong>Email:</strong> statistics@vanuatu.gov.vu</li>
                                        <li><strong>Website:</strong> vnso.gov.vu</li>
                                    </ul>
                                    <p className="mt-3 mb-0">
                                        <em>
                                            This dashboard was developed to provide easy access to Vanuatu's trade
                                            statistics. All data is derived from official VNSO publications.
                                        </em>
                                    </p>
                                </Accordion.Body>
                            </Accordion.Item>

                            <Accordion.Item eventKey="6">
                                <Accordion.Header><strong>🔄 Updates & Revisions</strong></Accordion.Header>
                                <Accordion.Body>
                                    <ul>
                                        <li><strong>Latest Update:</strong> February 2026</li>
                                        <li><strong>Data Coverage:</strong> November 2024 - July 2025</li>
                                        <li><strong>Next Update:</strong> March 2026 (scheduled)</li>
                                        <li>
                                            <strong>Revision Policy:</strong> Data may be revised in subsequent
                                            releases to incorporate late reports and corrections
                                        </li>
                                    </ul>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Col>
                </Row>

                <Row className="mt-4">
                    <Col lg={8} className="mx-auto">
                        <Card className="shadow-sm bg-light">
                            <Card.Body className="text-center">
                                <p className="mb-0">
                                    <strong>Disclaimer:</strong> While every effort has been made to ensure
                                    the accuracy of this data, the Vanuatu National Statistics Office cannot
                                    guarantee that the information is free from errors or omissions. Users
                                    are responsible for determining the suitability of the data for their purposes.
                                </p>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Methodology;
