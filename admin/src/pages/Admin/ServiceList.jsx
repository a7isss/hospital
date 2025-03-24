import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';

// Utility: Truncate long text
const truncateText = (text = '', maxLength = 100) => {
    if (text.length > maxLength) {
        return `${text.slice(0, maxLength)}...`;
    }
    return text;
};

const ServicesList = () => {
    // Destructure context values
    const { services, loading, error, getAllServices } = useContext(AdminContext);

    // Fetch services on component mount
    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Fetching services...");
                await getAllServices(); // Call the fetch function
                console.log("Services fetched successfully!");
            } catch (error) {
                console.error("Error fetching services:", error);
            }
        };

        fetchData(); // Trigger the fetch
    }, [getAllServices]); // Dependency on getAllServices function (from context)

    // Render
    return (
        <Container className="py-5">
            <h1 className="mb-4">All Services</h1>

            {/* Loading Spinner */}
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                // Error message
                <Alert variant="danger">{error}</Alert>
            ) : services?.length > 0 ? (
                // Services grid
                <Row className="g-4">
                    {services.map((service) => {
                        const {
                            _id,
                            image = '/default-service.png', // Default fallback image
                            name = 'Unknown Service', // Default fallback name
                            description = 'No description available', // Default fallback description
                        } = service;

                        return (
                            <Col xs={12} sm={6} md={4} lg={3} key={_id}>
                                <Card className="h-100">
                                    <Card.Img
                                        variant="top"
                                        src={image}
                                        alt={name}
                                        onError={(e) => {
                                            e.target.src = '/default-service.png'; // Set fallback image
                                            e.target.onerror = null; // Prevent infinite onError calls
                                        }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="mb-2">{name}</Card.Title>
                                        <Card.Text className="text-muted mb-2">{truncateText(description)}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                // No services available
                <Alert variant="info">No services available.</Alert>
            )}
        </Container>
    );
};

export default ServicesList;