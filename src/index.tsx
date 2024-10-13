import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import OperationsPage from './OperationsPage';
import ComputePage from './ComputePage';
import Layout from './Layout';
import './styles/tailwind.css'; // Import Tailwind CSS
import './styles/style.css'; // Import custom CSS
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import BlindInferencePage from './BlindInferencePage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,  // Layout renders for the root path "/"
    children: [
      {
        path: 'blind-inference', // Route becomes "/blind-inference"
        element: <BlindInferencePage />,
      },
      {
        path: 'compute', // Route becomes "/compute"
        element: <ComputePage />,
      },
      {
        index: true, // Set OperationsPage as the default child route (for "/")
        element: <OperationsPage />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <RouterProvider router={router} />
  </ThemeProvider>
);
