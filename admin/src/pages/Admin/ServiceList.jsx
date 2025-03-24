import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Card, Row, Col, Spinner, Alert, Container } from 'react-bootstrap';

const ServicesList = () => {
    const { services, loading, error, getAllServices } = useContext(AdminContext); // Use context directly

    useEffect(() => {
        getAllServices(); // Populate services on mount
    }, [getAllServices]);

    return (
        <Container className="py-5">
            <h1 className="mb-4">All Services</h1>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : services.length > 0 ? (
                <Row className="g-4">
                    {services.map((service) => (
                        <Col key={service._id} xs={12} sm={6} md={4} lg={3}>
                            <Card className="h-100">
                                <Card.Img variant="top" src={service.image || "/default.png"} alt={service.name} />
                                <Card.Body>
                                    <Card.Title>{service.name || "Unknown Service"}</Card.Title>
                                    <Card.Text>{service.description || "No description provided."}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Alert variant="info">No services available.</Alert>
            )}
        </Container>
    );
};
    const truncateText = (text = '', maxLength = 100) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };

    return (
        <Container className="py-5">
            <h1 className="mb-4">All Services</h1>
            {loading ? (
                <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
                    <Spinner animation="border" variant="primary" />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : services.length > 0 ? (
                <Row className="g-4">
                    {services.map((service) => {
                        const {
                            _id,
                            image = '/default-service.png', // Default fallback image
                            name = 'Unknown Service', // Default name
                            description = 'No description available', // Fallback for missing description
                            category = 'N/A', // Category default
                            price = 'N/A', // Fallback for missing price
                            duration = 'N/A', // Fallback duration
                        } = service;

                        return (
                            <Col xs={12} sm={6} md={4} lg={3} key={_id}>
                                <Card className="h-100">
                                    <Card.Img
                                        variant="top"
                                        src={image}
                                        alt={name}
                                        onError={(e) => {
                                            e.target.src = '/default-service.png'; // Replace broken images
                                        }}
                                    />
                                    <Card.Body>
                                        <Card.Title className="mb-2">{name}</Card.Title>
                                        <Card.Text className="text-muted mb-2">{truncateText(description)}</Card.Text>
                                        <Card.Text>
                                            <strong>Category:</strong> {category}
                                        </Card.Text>
                                        <Card.Text>
                                            <strong>Price:</strong> {price !== 'N/A' ? `$${price}` : price} |{' '}
                                            <strong>Duration:</strong> {duration}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            ) : (
                <p className="text-muted">No services available.</p>
            )}
        </Container>

    );

export default ServicesList;