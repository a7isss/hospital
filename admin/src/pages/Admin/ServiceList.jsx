import React, { useContext, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';

// Utility Function: Truncate text for long descriptions
const truncateText = (text = '', maxLength = 100) => {
    if (text.length > maxLength) {
        return `${text.slice(0, maxLength)}...`;
    }
    return text;
};

const ServicesList = () => {
    // Extract required values and functions from AdminContext
    const { services, loading, error, getAllServices } = useContext(AdminContext);

    // Fetch services on the component mount
    useEffect(() => {
        getAllServices(); // Call the fetch function from context
    }, [getAllServices]); // Dependency ensures `getAllServices` is stable and doesn't re-trigger unnecessarily

    return (
        <Container className="py-5">
            <h1 className="mb-4">All Services</h1>
            {loading ? (
                // Loading spinner while the services are being fetched
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                // Show error if the fetch fails
                <Alert variant="danger">{error}</Alert>
            ) : services?.length > 0 ? (
                // Render the list of services
                <Row className="g-4">
                    {services.map((service) => {
                        // Destructure values from each service for display
                        const {
                            _id,
                            image = '/default-service.png', // Fallback image
                            name = 'Unknown Service', // Fallback name
                            description = 'No description available', // Fallback description
                        } = service;

                        // Render each service card
                        return (
                            <Col xs={12} sm={6} md={4} lg={3} key={_id}>
                                <Card className="h-100">
                                    <Card.Img
                                        variant="top"
                                        src={image}
                                        alt={name}
                                        // Fallback to default image on error
                                        onError={(e) => {
                                            e.target.src = '/default-service.png';
                                            e.target.onerror = null; // Prevent infinite failure
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
                // Fallback when there are no services to display
                <Alert variant="info">No services available.</Alert>
            )}
        </Container>
    );
};

export default ServicesList;