import React from 'react';

import { CssBaseline, Paper } from '@mui/material';

import Tasks from '../Tasks';
import Modals from '../Modals';
import Header from '../Header';

export default function Index() {
    return <>
        <CssBaseline />
        
        <Modals />
        
        <Paper
            elevation={2}
            sx={{
                minHeight: '100vh',
                height: '100%',
                width: '100%',
                overflow: 'auto',
            }}
        >
            <Header />
            <Tasks />
        </Paper>
    </>;
}