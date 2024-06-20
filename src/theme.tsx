import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    secondary: {
      main: '#fafafa',
    },
  },
  components: {
    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '8px 16px', // Custom padding
          backgroundColor: '#f5f5f5', // Custom background color
          '&:hover': {
            backgroundColor: '#e0e0e0', // Custom hover background color
          },
          '&.Mui-selected': {
            backgroundColor: '#d0d0d0', // Custom selected background color
            '&:hover': {
              backgroundColor: '#c0c0c0', // Custom hover color for selected item
            },
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-root': {
            margin: '4px 0', // Adjust margin as needed
            padding: '4px', // Adjust padding as needed
          },
          '& .MuiInputBase-input': {
            padding: '4px 8px', // Adjust inner input padding as needed
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        root: {
          marginTop: '0px',
          marginBottom: '0px',
          padding: '2px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          padding: '4px',
        },
        select: {
          padding: '4px 8px',
        },
      },
    },
  },
});
