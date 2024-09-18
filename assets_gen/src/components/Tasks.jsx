import React, { useState } from 'react';

import { Box } from '@mui/system';
import { IconButton, Paper, TextField } from '@mui/material';

import { useDispatch } from 'react-redux';
import { uuidv4 } from '../utils';

import { editTask } from '../store/popup';

import TasksList from './TasksList';
import AddIcon from '@mui/icons-material/Add';

export default function Tasks({ }) {
    const dispatch = useDispatch();
    
    const [ filter, setFilter ] = useState('');
    
    return <>
        <Box sx={{ m: 4, mt: 8 }}>
            <Paper elevation={4} sx={{ p: 1, display: 'flex', gap: 2 }}>
                <TextField
                    sx={{ width: '100%' }}
                    label='Фильтр'
                    size='small'
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                />
                
                <IconButton
                    onClick={() => dispatch(editTask({ id: uuidv4() }))}
                >
                    <AddIcon />
                </IconButton>
            </Paper>
            
            <Box sx={{ m: 1 }} />
            
            <Paper elevation={5}>
                <TasksList filter={filter} />
            </Paper>
        </Box>
    </>;
}