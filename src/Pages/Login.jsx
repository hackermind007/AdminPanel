import React, { useEffect, useState } from 'react'

import { Box, Button, Typography } from '@mui/material'
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { GridLoader, HashLoader } from 'react-spinners';

const Login = () => {
  const [spinner, setspinner] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      email: 'Harsh@gmail.com',
      password: 'Harsh@123',
    },
    onSubmit: async (values) => {
      try {
        setspinner(true);
        let res = await axios.post("https://interviewhub-3ro7.onrender.com/admin/login", values);
        localStorage.setItem("token", res.data.token);
        navigate("/admin/");
      } catch (error) {
        console.log(error);
      } finally {
        setspinner(false);
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/admin/');
    }
  }, []);

  return (
    spinner ? (
      <Box sx={{ width: '100%', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5' }}>
        <HashLoader color="#122dff" />
      </Box>
    ) : (
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to bottom, #1976D2, #ffffff)',
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              width: '400px',
              background: '#ffffff',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              padding: '40px',
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Typography variant='h4' sx={{ color: '#1976D2', fontWeight: 'bold' }}>Login</Typography>
            <TextField
              id="email"
              fullWidth
              label="Email"
              variant="outlined"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            <TextField
              id="password"
              fullWidth
              label="Password"
              variant="outlined"
              name="password"
              type='password'
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            <Button
              variant='contained'
              fullWidth
              type="submit"
              sx={{
                background: '#1976D2',
                color: '#ffffff',
                '&:hover': {
                  background: '#125ab3',
                },
              }}
            >
              Login
            </Button>
            <Typography variant='body2' sx={{ textAlign: 'center', marginTop: '10px' }}>
              Don't have an account? <Link to="/signup" style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 'bold' }}>Signup</Link>
            </Typography>
          </Box>
        </form>
      </Box>
    )
  );
};

export default Login;