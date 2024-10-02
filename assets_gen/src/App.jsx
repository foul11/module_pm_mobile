import React, { useEffect } from 'react';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { SnackbarProvider } from 'notistack';
import { useAppDispatch } from './store';
import { getTasks } from './store/tasks';

import Index from './components/pages/Index';

export default function App({}) {
    const dispatch = useAppDispatch();
    const theme = createTheme({
        palette: {
            mode: 'dark',
        },
    });
    
    useEffect(() => {
        dispatch(getTasks());
    });
    
    return (
        <ThemeProvider theme={theme}>
            <SnackbarProvider maxSnack={3} autoHideDuration={3000} preventDuplicate>
                <Index />
            </SnackbarProvider>
        </ThemeProvider>
    );
}

