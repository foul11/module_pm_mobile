import React, { useState } from 'react';

import { useSelector } from '../../utils';
import { useDispatch } from 'react-redux';
import { selectPopupEditTask, selectTasks } from '../../store';
import { addOrUpdate, selectTask } from '../../store/tasks';
import { editTask } from '../../store/popup';

import { Box } from '@mui/system';
import { Button, Divider, TextField, Typography } from '@mui/material';

import PopupBase from './PopupBase';

export default function EditTask() {
    const tasks = useSelector(selectTasks);
    const popupEditTask = useSelector(selectPopupEditTask);
    const dispatch = useDispatch();
    
    const open    = popupEditTask.id !== null;
    const taskIdx = popupEditTask.id !== null && selectTask(tasks, popupEditTask.id);
    const task    = taskIdx !== false && tasks[taskIdx];
    
    const [ name, setName ] = useState(task && task.name || '');
    const [ desc, setDesc ] = useState(task && task.desc || '');
    
    const dispatchUpdateAndClose = (/** @type {{ id?: string, name?: string, desc?: string }} */ _task) => {
        console.log(_task);
        dispatch(addOrUpdate({ id: _task.id, name: _task.name, desc: _task.desc }));
        dispatch(editTask({ id: null }));
    };
    
    return <PopupBase open={open} onClose={() => dispatch(editTask({ id: null }))}>
        <Typography sx={{ textAlign: 'center' }}>{task && 'Редактировать задачу' || 'Создать задачу'}</Typography>
        
        <Divider sx={{ my: 1 }} />
        
        <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 4 }}>
            <TextField
                label='Название'
                size='small'
                value={name}
                onChange={e => setName(e.target.value)}
            />
            
            <TextField
                multiline
                label='Описание'
                size='small'
                fullWidth
                rows={10}
                value={desc}
                onChange={e => setDesc(e.target.value)}
            />
        </Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            {task && <>
                <Button
                    variant='contained'
                    onClick={() => dispatchUpdateAndClose({ id: task.id, name, desc })}
                >Обновить</Button>
            </> || <>
                <Button
                    variant='contained'
                    onClick={() => dispatchUpdateAndClose({ name, desc })}
                >Сохранить</Button>
            </>}
        </Box>
    </PopupBase>
}