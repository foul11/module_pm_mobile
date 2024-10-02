import React, { useState } from 'react';

import { useDispatch } from 'react-redux';
import { useSelector } from '../../utils';
import { upload } from '../../store/tasks';
import { openUploadTasks } from '../../store/popup';
import { selectPopupUploadTask, useAppDispatch } from '../../store';

import { Button, Divider, TextField, Typography } from '@mui/material';
import { Box } from '@mui/system';

import PopupBase from './PopupBase';

export default function UploadTask() {
    const popupUploadTask = useSelector(selectPopupUploadTask);
    const dispatch = useAppDispatch();
    
    const [ jsonText, setJsonText ] = useState('');
    
    return <PopupBase open={popupUploadTask.open} onClose={() => dispatch(openUploadTasks({ open: false }))}>
        <Typography sx={{ textAlign: 'center' }}>{'Загрузить TODO\'s'}</Typography>
        
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
                label="JSON'чик"
                size='small'
                fullWidth
                rows={12}
                value={jsonText}
                onChange={e => setJsonText(e.target.value)}
            />
            
            <Box sx={{ flexGrow: 1 }} />
            
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
                        dispatch(upload(JSON.parse(jsonText)));
                        dispatch(openUploadTasks({ open: false }));
                    }}
                >Загрузить</Button>
            </Box>
        </Box>
    </PopupBase>
}