import React, { useContext, useState, useEffect } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { Card, CardContent, CardMedia, Typography, Grid, Box, CircularProgress, Alert } from '@mui/material';

const ServicesList = () => {
    const { getAllServices } = useContext(AdminContext); // Fetch function from context
    const [services, setServices] = useState([]); // State for services
    const [loading, setLoading] = useState(true); // Loading state
    const [error, setError] = useState(null); // Error state

    useEffect(() => {
        const fetchServices = async () => {
            try {
                setLoading(true); // Start loading
                const fetchedServices = await getAllServices(); // Fetch services from context
                if (Array.isArray(fetchedServices)) {
                    setServices(fetchedServices); // Store in state
                } else {
                    setError('Unexpected data received. Could not fetch services.');
                }
            } catch (err) {
                console.error(err); // Debugging
                setError('Failed to load services. Please try again later.');
            } finally {
                setLoading(false); // Stop loading
            }
        };

        fetchServices(); // Fetch data on component mount
    }, [getAllServices]);

    const truncateText = (text = '', maxLength = 100) => {
        if (text.length > maxLength) {
            return `${text.slice(0, maxLength)}...`;
        }
        return text;
    };

    return (
        <Box sx={{ padding: 3, maxHeight: '90vh', overflowY: 'auto' }}>
            <Typography variant="h5" component="h1" gutterBottom>
                All Services
            </Typography>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Alert severity="error">{error}</Alert>
            ) : services.length > 0 ? (
                <Grid container spacing={3}>
                    {services.map((service) => {
                        const {
                            _id,
                            image = '/default-service.png', // Fallback image
                            name = 'Unknown Service', // Fallback name
                            description = 'No description available', // Fallback description
                            category = 'N/A', // Default category
                            price = 'N/A', // Default price
                            duration = 'N/A', // Default duration
                        } = service;

                        return (
                            <Grid item xs={12} sm={6} md={4} lg={3} key={_id}>
                                <Card sx={{ height: '100%' }}>
                                    {/* Service Image */}
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={image}
                                        alt={name}
                                        onError={(e) => {
                                            e.target.src = '/default-service.png'; // Replace broken images
                                        }}
                                    />

                                    {/* Service Details */}
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>
                                            {name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {truncateText(description)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ marginTop: 1 }}>
                                            <strong>Category:</strong> {category}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Price:</strong> {price !== 'N/A' ? `$${price}` : price} |{' '}
                                            <strong>Duration:</strong> {duration}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            ) : (
                <Typography variant="body1" color="text.secondary">
                    No services available.
                </Typography>
            )}
        </Box>
    );
};

export default ServicesList;