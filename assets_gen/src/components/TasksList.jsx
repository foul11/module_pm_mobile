import React from 'react';

import { useSelector } from '../utils';
import { useDispatch } from 'react-redux';
import { complete, del } from '../store/tasks';
import { editTask } from '../store/popup';

import { Box } from '@mui/system';
import { Checkbox, Divider, IconButton, List, ListItem, Paper, Typography } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

/**
 * @param {{
 *  filter: string
 * }} param0
 */
export default function TasksList({ filter }) {
    const dispatch = useDispatch();
    const tasks = useSelector((state) => state.tasks);
    
    const filteredTasks = tasks.filter(task => task.name.includes(filter));
    
    return <>
        <List>
            {filteredTasks.map((task, i) => (
                <ListItem key={task.id} sx={{ flexDirection: 'column', py: 0 }}>
                    <Box sx={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1,
                        pt: 1,
                    }}>
                        <Checkbox
                            checked={task.complete}
                            onChange={(e) => dispatch(complete({ id: task.id, complete: e.target.checked }))}
                        />
                        
                        {task.name}
                        
                        <Box sx={{ flexGrow: 1 }} />
                        
                        <IconButton
                            onClick={() => dispatch(editTask({ id: task.id }))}
                        >
                            <EditIcon />
                        </IconButton>
                        
                        <IconButton
                            onClick={() => dispatch(del({ id: task.id }))}
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Box>
                    
                    {task.desc && <Box sx={{
                            alignSelf: 'flex-start',
                            whiteSpace: 'pre-wrap',
                            width: '100%',
                            pl: 6,
                            pb: 2,
                            pr: 12,
                            flexGrow: 1,
                        }}
                    >
                        <Paper elevation={2} sx={{ p: 1 }}>
                            <Typography>
                                {task.desc}
                            </Typography>
                        </Paper>
                    </Box> || <></>}
                    
                    {filteredTasks.length !== i + 1 && <Divider sx={{ width: '100%' }} />}
                </ListItem>
            ))}
            
            {!filteredTasks.length && <>
                <ListItem sx={{ justifyContent: 'center' }}>No tasks</ListItem>
            </>}
        </List>
    </>;
}