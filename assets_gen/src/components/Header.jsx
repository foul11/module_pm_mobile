import React from 'react';
// import fileSaver from 'file-saver';

import { useDispatch } from 'react-redux';
import { openDownloadTasks, openUploadTasks } from '../store/popup';
import { selectTasks } from '../store';
import { useSelector } from '../utils';

import { AppBar, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';

export default function Header() {
    const tasks = useSelector(selectTasks);
    const dispatch = useDispatch();
    
    return <>
        <AppBar sx={{ display: 'flex', flexDirection: 'row', px: 1 }}>
            <Typography variant='h6' sx={{ p: 1 }}>
                TODO's App Mobilus
            </Typography>
            
            <Box sx={{ flexGrow: 1 }} />
            
            <Box sx={{ display: 'flex', gap: 1, py: 0.5 }}>
                <IconButton
                    onClick={() => dispatch(openUploadTasks({ open: true }))}
                >
                    <UploadIcon />
                </IconButton>
                
                <IconButton
                    // onClick={() => fileSaver(new Blob([JSON.stringify(tasks, undefined, 4)], { type: 'application/json' }), 'tasks.json')}
                    onClick={() => dispatch(openDownloadTasks({ text: JSON.stringify(tasks, undefined, 4) }))}
                >
                    <DownloadIcon />
                </IconButton>
            </Box>
        </AppBar>
    </>;
}