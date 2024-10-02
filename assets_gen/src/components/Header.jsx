import React from 'react';
import fileSaver from 'file-saver';

import { useDispatch } from 'react-redux';
import { openDownloadTasks, openUploadTasks } from '../store/popup';
import { selectTasks, useAppDispatch } from '../store';
import { getTasks } from '../store/tasks';
import { useSelector } from '../utils';

import { AppBar, IconButton, Typography } from '@mui/material';
import { Box } from '@mui/system';

import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import CachedIcon from '@mui/icons-material/Cached';

export default function Header() {
    const tasks = useSelector(selectTasks);
    const dispatch = useAppDispatch();
    
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
                    onClick={() => {
                        let link = document.createElement('a');
                        
                        link.setAttribute('href', 'data:application/json;base64,' + btoa(JSON.stringify(tasks, undefined, 4)));
                        link.setAttribute('download', 'save.json');
                        
                        link.click();
                    }}
                    // onClick={() => window.open('data:application/octet-stream;base64,' + btoa(JSON.stringify(tasks, undefined, 4)), 'save.json')}
                    // onClick={() => fileSaver(new Blob([JSON.stringify(tasks, undefined, 4)], { type: 'application/json' }), 'tasks.json')}
                    // onClick={() => dispatch(openDownloadTasks({ text: JSON.stringify(tasks, undefined, 4) }))}
                >
                    <DownloadIcon />
                </IconButton>
                
                <IconButton
                    onClick={() => {
                        dispatch(getTasks());
                    }}
                >
                    <CachedIcon />
                </IconButton>
            </Box>
        </AppBar>
    </>;
}