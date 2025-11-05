import { createTheme } from "@mui/material";

const customTheme = createTheme({
  components: {

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'white',
            borderRadius: '8px',
          },
        },
      },
      variants: [
        {
          props: { variant: 'customRounded' },
          style: {
            '& .MuiOutlinedInput-root': {
              borderRadius: '50px',
              backgroundColor: '#f5f5f5',
              paddingLeft: '12px',
            },
          },
        },
        {
          props: { variant: 'danger' },
          style: {
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: 'red',
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: 'darkred',
            },
          },
        },
      ],
    },

    MuiButton: {
      variants: [
        {
          props: { variant: 'success' },
          style: {
            backgroundColor: '#4caf50',
            color: 'white',
            '&:hover': {
              backgroundColor: '#388e3c',
            },
          },
        },
      ],
    },
  },
});

export default customTheme;