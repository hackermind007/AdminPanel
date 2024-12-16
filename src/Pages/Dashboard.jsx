import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Box, Typography } from '@mui/material';
import ThemeDash from '../Compnents/ThemeDash';
import axios from 'axios';
import { HashLoader } from 'react-spinners';

const Dashboard = () => {

    let [category, setcategory] = useState([]);
    let [subcategory, setsubcategory] = useState([]);
    let [questions, setquestions] = useState([]);
    let [loading, setLoading] = useState(true); // Loading state
    let token = localStorage.getItem("token");

    useEffect(() => {
        async function getdata() {
            try {
                let res = await axios.get("https://interviewhub-3ro7.onrender.com/catagory/", {
                    headers: {
                        Authorization: token
                    }
                });
                let ress = await axios.get("https://interviewhub-3ro7.onrender.com/subcatagory/", {
                    headers: {
                        Authorization: token
                    }
                });
                let resss = await axios.get("https://interviewhub-3ro7.onrender.com/questions/", {
                    headers: {
                        Authorization: token
                    }
                });
                setcategory(res.data.data);
                setsubcategory(ress.data.data);
                setquestions(resss.data.data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false); // Stop loading when data is fetched
            }
        }
        getdata();
    }, [token]);

    return (
        <ThemeDash>
            <div>
                {/* Dashboard Header */}

                <Container className="mt-3">
                    <Row>
                        {loading ? (
                            <Box display="flex" justifyContent="center" alignItems="center" sx={{ width: '100%', height: '100vh' }}>
                                <HashLoader color="#122dff"/>
                            </Box>
                        ) : (
                            <>
                                {/* Category Box */}
                                <Col md={4}>
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="h5" className="fw-bold" gutterBottom>Total Category</Typography>
                                                <Typography variant="h3" className="fw-bold" color="dark">{category.length}</Typography>
                                            </Box>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Sub-category Box */}
                                <Col md={4}>
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="h5" className="fw-bold" gutterBottom>Total Sub-category</Typography>
                                                <Typography variant="h3" className="fw-bold" color="dark">{subcategory.length}</Typography>
                                            </Box>
                                        </Card.Body>
                                    </Card>
                                </Col>

                                {/* Total Q/A Set Box */}
                                <Col md={4}>
                                    <Card className="shadow-sm">
                                        <Card.Body>
                                            <Box display="flex" flexDirection="column" alignItems="center">
                                                <Typography variant="h5" className="fw-bold" gutterBottom>Total Q/A</Typography>
                                                <Typography variant="h3" className="fw-bold" color="dark">{questions.length}</Typography>
                                            </Box>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </>
                        )}
                    </Row>
                </Container>
            </div>
        </ThemeDash>
    );
};

export default Dashboard;
