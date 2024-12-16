import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    onSubmit: async (values) => {
      try {
        const { name, email, password } = values;

        if (password !== values.confirmPassword) {
          console.log('Passwords do not match!');
          return;
        }

        let res = await axios.post(
          'https://interviewhub-3ro7.onrender.com/admin/signup',
          { name, email, password }
        );
        console.log(res.data);

        navigate('/admin/login');
      } catch (error) {
        console.log(error);
      }
    },
  });

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
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
          <Typography variant="h4" sx={{ color: '#1976D2', fontWeight: 'bold' }}>
            Signup
          </Typography>

          <TextField
            id="name"
            fullWidth
            label="Full Name"
            variant="outlined"
            name="name"
            onChange={formik.handleChange}
            value={formik.values.name}
          />

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
            type="password"
            onChange={formik.handleChange}
            value={formik.values.password}
          />

          <TextField
            id="confirmPassword"
            fullWidth
            label="Confirm Password"
            variant="outlined"
            name="confirmPassword"
            type="password"
            onChange={formik.handleChange}
            value={formik.values.confirmPassword}
          />

          <Button
            variant="contained"
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
            Signup
          </Button>
          <Typography variant='body2' sx={{ textAlign: 'center', marginTop: '10px' }}>
            Already have an account?{' '}
            <Link to="/" style={{ color: '#1976D2', textDecoration: 'none', fontWeight: 'bold' }}>
              Login
            </Link>
          </Typography>
        </Box>
      </form>
    </Box>
  );
};

export default Signup;