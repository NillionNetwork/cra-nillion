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
import { NillionClientProvider } from '@nillion/client-react-hooks';
import { NamedNetwork } from '@nillion/client-core';
import { createSignerFromKey } from '@nillion/client-payments';
import { NillionClient } from '@nillion/client-vms';
import { NextClient } from './NextClient';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/blind-inference',
        element: <BlindInferencePage />,
      },
      {
        path: '/compute',
        element: <ComputePage />,
      },
      {
        path: '/',
        element: <OperationsPage />,
      },
      {
        path: '/next',
        element: <NextClient />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement,
);

const client = NillionClient.create({
  network: NamedNetwork.enum.Devnet,
  userSeed: 'thm',
  nodeSeed: 'thm',

  overrides: async () => {
    const signer = await createSignerFromKey(
      '9a975f567428d054f2bf3092812e6c42f901ce07d9711bc77ee2cd81101f42c5',
    );
    return {
      endpoint: 'http://localhost:8080/nilchain',
    };
  },
});

root.render(
  <ThemeProvider theme={theme}>
    <NillionClientProvider client={client}>
      <CssBaseline />
      <RouterProvider router={router} />
    </NillionClientProvider>
  </ThemeProvider>,
);
