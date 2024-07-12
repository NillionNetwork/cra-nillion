import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            sx={{ fontSize: '1.25rem', fontWeight: 'bold' }}
          >
            Nillion Operations
          </Button>
        </Box>
        <Button color="inherit" component={RouterLink} to="/compute">
          Blind Computation Demo
        </Button>
        <Button color="inherit" component={RouterLink} to="/blind-inference">
          Blind Inference
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
