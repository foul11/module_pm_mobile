import React from 'react';

import { useSelector } from '../utils';
import { useDispatch } from 'react-redux';
import { useAppDispatch } from '../store';
import { complete, del, move } from '../store/tasks';
import { editTask } from '../store/popup';

import { Box } from '@mui/system';
import { Checkbox, Divider, IconButton, List, ListItem, Paper, Typography } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Loading from './Loading';

import { Tree, getBackendOptions, MultiBackend } from "@minoru/react-dnd-treeview";
import { DndProvider } from "react-dnd";

import '../less/index.less';

/**
 * @param {{
 *  filter: string
 * }} param0
 */
export default function TasksList({ filter }) {
    const dispatch = useAppDispatch();
    const tasks = useSelector((state) => state.tasks);
    
    const filteredTasks = tasks.tasks.filter(task => task.name.includes(filter));
    const [ tree, setTree ] = React.useState(
        /** @type {import('@minoru/react-dnd-treeview').NodeModel<Parameters<Task>[0]>[]} */ ([])
    );
    
    /**
     * @param {*[]} array
     * @param {number} sourceIndex
     * @param {number} targetIndex
     */
    function reorderArray(array, sourceIndex, targetIndex) {
        const newArray = [...array];
        const element = newArray.splice(sourceIndex, 1)[0];
        newArray.splice(targetIndex, 0, element);
        return newArray;
    };
    
    React.useEffect(() => {
        setTree(filteredTasks.map((task, index) => ({ id: task.id, data: { task, index }, parent: 0, text: '', droppable: false })));
    }, [ tasks.tasks, filter ]);
    
    /**
     * @param {{
     *  task: import('../store/tasks').Tasks['tasks'][number],
     *  index: number,
     * }} param0
     */
    function Task({ task, index }) {
        return <Box key={task.id} sx={{ flexDirection: 'column', py: 0, width: '100%' }}>
        {/* <ListItem key={task.id} sx={{ flexDirection: 'column', py: 0 }}> */}
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
            
            {filteredTasks.length !== index + 1 && <Divider sx={{ width: '100%', pt: 1 }} />}
        {/* </ListItem> */}
        </Box>
    }
    
    return <Loading loading={tasks.loading}>
        <DndProvider backend={MultiBackend} options={getBackendOptions()}>
            <Tree
                tree={tree}
                rootId={0}
                onDrop={(newTree, e) => {
                    const { dragSourceId, dropTargetId, destinationIndex } = e;
                    
                    if (
                        typeof dragSourceId === "undefined" ||
                        typeof dropTargetId === "undefined"
                    )
                        return;
                    
                    const start = tree.find((v) => v.id === dragSourceId);
                    // const end = tree.find((v) => v.id === dropTargetId);
                    
                    if (
                        start?.parent === dropTargetId &&
                        start &&
                        typeof destinationIndex === "number"
                    ) {
                        dispatch(move({ sourceId: Number(start.id), targetIndex: destinationIndex }));
                        
                        // setTree((treeData) => {
                        //     const output = reorderArray(
                        //         treeData,
                        //         treeData.indexOf(start),
                        //         destinationIndex
                        //     );
                            
                        //     return output;
                        // });
                    }
                }}
                render={(node, { depth, isOpen, onToggle }) => (
                    node.data && <Task task={node.data.task} index={node.data.index} /> || <></>
                )}
                sort={false}
                insertDroppableFirst={false}
                dropTargetOffset={16}
                canDrop={(tree, { dragSource, dropTargetId, dropTarget }) => {
                    return true;
                }}
                classes={{
                    listItem: 'My-MuiListItem-root',
                    container: 'My-MuiList-root',
                    placeholder: 'placeholderContainer',
                    draggingSource: 'draggingSource',
                }}
                placeholderRender={(node, { depth }) => (
                    <Box sx={{
                        // border: '1px dashed cyan',
                        // width: '100%',
                        // height: '1em',
                        // ml: depth,
                        transform: 'translateY(-50%)',
                        backgroundColor: '#1967d2',
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '100%',
                        height: '2px',
                    }} />
                )}
            />
            {/* {filteredTasks.map((task, i) => (
                <Task key={task.id} task={task} index={i} />
            ))} */}
        </DndProvider>
        
        {!filteredTasks.length && <>
            <ListItem sx={{ justifyContent: 'center' }}>No tasks</ListItem>
        </>}
        {/* </List> */}
    </Loading>;
}