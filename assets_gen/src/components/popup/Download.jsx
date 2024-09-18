import React from 'react';

import { useDispatch } from 'react-redux';
import { useSelector } from '../../utils';
import { openDownloadTasks } from '../../store/popup';
import { selectPopupDownloadTask } from '../../store';

import { Button, Divider, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

import PopupBase from './PopupBase';

export default function Download() {
    const popupDownloadTask = useSelector(selectPopupDownloadTask);
    const dispatch = useDispatch();
    
    return <PopupBase open={!!popupDownloadTask.text} onClose={() => dispatch(openDownloadTasks({ text: null }))}>
        <Typography sx={{ textAlign: 'center' }}>{'Скачать TODO\'s'}</Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                mt: 2
            }}
        >
            <TextField
                multiline
                label="Скопируй JSON'чик"
                size='small'
                fullWidth
                rows={12}
                value={popupDownloadTask.text}
            />
            
            <Box sx={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: 1,
                    mt: 2
                }}
            >
                <Button
                    variant='contained'
                    onClick={() => {
                        dispatch(openDownloadTasks({ text: null }));
                    }}
                >ОК</Button>
            </Box>
        </Box>
    </PopupBase>
}