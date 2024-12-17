import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import TextField from '@mui/material/TextField';
import { useFormik } from 'formik';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      const { name, email, password, confirmPassword } = values;

      // Validation for empty fields
      if (!name || !email || !password || !confirmPassword) {
        toast.error('Please Fill The Blanks!');
        return;
      }

      // Validation for password mismatch
      if (password !== confirmPassword) {
        toast.error('Passwords do not match!');
        return;
      }

      try {
        const res = await axios.post(
          'https://interviewhub-3ro7.onrender.com/admin/signup',
          { name, email, password }
        );

        // Success toast for user registration
        toast.success('User registered successfully!');

        setTimeout(() => navigate('/admin/'), 1500); // Redirect after showing toast
      } catch (error) {
        if (error.response?.data?.message) {
          // Show error toast if user already exists
          toast.error('User already exists!');
        } else {
          toast.error('Something went wrong!');
        }
      }
    },
  });

  return (
    <>
      <ToastContainer />
      <Box
        sx={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom, #1976D2, #ffffff)',
          padding: { xs: '20px', sm: '0' }, // Adjust padding for mobile
        }}
      >
        <form onSubmit={formik.handleSubmit}>
          <Box
            sx={{
              width: { xs: '100%', sm: '400px' },
              background: '#ffffff',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
              padding: { xs: '20px', sm: '40px' },
              borderRadius: '12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: { xs: 2, sm: 3 },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                color: '#1976D2',
                fontWeight: 'bold',
                fontSize: { xs: '1.5rem', sm: '2rem' },
              }}
            >
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
                padding: { xs: '8px 16px', sm: '10px 20px' },
              }}
            >
              Signup
            </Button>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                marginTop: '10px',
                fontSize: { xs: '0.85rem', sm: '1rem' },
              }}
            >
              Already have an account?{' '}
              <Link
                to="/"
                style={{
                  color: '#1976D2',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                }}
              >
                Login
              </Link>
            </Typography>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default Signup;