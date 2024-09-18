import { configureStore } from '@reduxjs/toolkit';

import tasksSlice from './store/tasks';
import popupSlice from './store/popup';

function reHydrateStore() {
    let tasks = [];
    
    if (localStorage && localStorage.getItem('store_todo_app') !== null) {
        tasks = JSON.parse(localStorage.getItem('store_todo_app') ?? '[]');
    }
    
    return {
        tasks,
    };
}

export const reducer = {
    tasks: tasksSlice,
    popup: popupSlice,
}

export default configureStore({
    reducer,
    preloadedState: reHydrateStore(),
    
    middleware(gDM) {
        return gDM().concat(({ getState }) => {
            return next => action => {
                const result = next(action);
                
                if (localStorage && action.type.startsWith('tasks/'))
                    localStorage.setItem('store_todo_app', JSON.stringify(getState().tasks));
                
                return result;
            };
        });
    },
});

export const selectTasks = (/** @type {import('./utils').reducers} */ state) => state.tasks;
export const selectPopup = (/** @type {import('./utils').reducers} */ state) => state.popup;

export const selectPopupEditTask = (/** @type {import('./utils').reducers} */ state) => selectPopup(state).EditTask;
export const selectPopupUploadTask = (/** @type {import('./utils').reducers} */ state) => selectPopup(state).UploadTask;
export const selectPopupDownloadTask = (/** @type {import('./utils').reducers} */ state) => selectPopup(state).DonwloadTask;