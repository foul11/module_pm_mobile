import { configureStore } from '@reduxjs/toolkit';

import tasksSlice from './store/tasks';
import popupSlice from './store/popup';

// import { useDispatch } from 'react-redux';

// function reHydrateStore() {
//     let tasks = [];
    
//     if (localStorage.getItem('store_todo_app') !== null) {
//         tasks = JSON.parse(localStorage.getItem('store_todo_app') ?? '[]');
//     }
    
//     return {
//         tasks,
//     };
// }

export const reducer = {
    tasks: tasksSlice,
    popup: popupSlice,
}

export const store = configureStore({
    reducer,
    // preloadedState: reHydrateStore(),
    
    // middleware(gDM) {
    //     return gDM().concat(({ getState }) => {
    //         return next => action => {
    //             const result = next(action);
                
    //             if (action.type.startsWith('tasks/'))
    //                 localStorage.setItem('store_todo_app', JSON.stringify(getState().tasks));
                
    //             return result;
    //         };
    //     });
    // },
});

/**
 * @typedef {typeof store['dispatch']} dispatch
 * @typedef {import('./utils').reducers} RootState
 * @typedef {import('@reduxjs/toolkit').ThunkDispatch<RootState, any, import('@reduxjs/toolkit').AnyAction>} AppThunkDispatch
 * @typedef {Omit<import('@reduxjs/toolkit').Store<RootState, import('@reduxjs/toolkit').AnyAction>, "dispatch"> & {
 *   dispatch: AppThunkDispatch;
 * }} AppStore
 */


// 1. Get the root state's type from reducers
// export type RootState = ReturnType<typeof reducers>;

// 2. Create a type for thunk dispatch
// export type AppThunkDispatch = ThunkDispatch<RootState, any, AnyAction>;

// 3. Create a type for store using RootState and Thunk enabled dispatch
// export type AppStore = Omit<Store<RootState, AnyAction>, "dispatch"> & {
//   dispatch: AppThunkDispatch;
// };

//4. create the store with your custom AppStore
// export const store: AppStore = configureStore();

// you can also create some redux hooks using the above explicit types
// export const useAppDispatch = () => useDispatch<AppThunkDispatch>();
// export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;


// export const useAppDispatch = () => /** @type {dispatch} */ (useDispatch)();
export const useAppDispatch = () => store.dispatch;

export default store;

export const selectTasks = (/** @type {import('./utils').reducers} */ state) => state.tasks;
export const selectPopup = (/** @type {import('./utils').reducers} */ state) => state.popup;

export const selectPopupEditTask = (/** @type {import('./utils').reducers} */ state) => selectPopup(state).EditTask;
export const selectPopupUploadTask = (/** @type {import('./utils').reducers} */ state) => selectPopup(state).UploadTask;
export const selectPopupDownloadTask = (/** @type {import('./utils').reducers} */ state) => selectPopup(state).DonwloadTask;