import React from 'react';

import { CircularProgress, Paper, Typography } from '@mui/material';

/**
 * @param {{
 *  loading?: boolean,
 *  error?: Error | string | null,
 *  children?: React.ReactNode,
 * }} param0
 */
export default function Loading({ loading, error, children }) {
    loading = loading ?? loading === undefined;
    
    if (loading || error) {
        return <Paper
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                py: 1,
            }}
        >
            {loading ? (
                <CircularProgress />
            ) : (
                <Paper elevation={4} sx={{ p: 2, mt: 2, borderRadius: 2 }}>
                    <Typography variant="h5">
                        Ошибка во время загрузки
                    </Typography>
                    
                    <Paper elevation={6} sx={{ p: 2, mt: 2, borderRadius: 2, color: 'error.light' }}>
                        {error?.toString() ?? 'Loading error'}
                    </Paper>
                </Paper>
            )}
        </Paper>
    }
    
    return children;
}
