import { createSlice } from '@reduxjs/toolkit';
import { uuidv4 } from '../utils';

/**
 * @template T
 * @typedef {import('../utils').Action<T>} Action
 */

/**
 * @typedef {{
 *  id: string,
 *  name: string,
 *  desc: string,
 *  complete: boolean,
 * }[]} Tasks
 */

export const selectTask = (/** @type {Tasks} */ state, /** @type {string} */ id) => {
    const idx = state.findIndex(c => c.id === id);
    
    if (idx === -1)
        return false;
    
    return idx;
};

export const reduxSlice = createSlice({
    name: 'tasks',
    initialState: /** @type {Tasks} */ ([]),
    reducers: {
        /** @param {Action<{ id?: string, name?: string, desc?: string }>} action */
        addOrUpdate: (state, action) => {
            if (!action.payload.id) {
                const payload = {
                    name: action.payload.name ?? '',
                    desc: action.payload.desc ?? '',
                };
                
                state.push({
                    ...payload,
                    complete: false,
                    id: uuidv4(),
                });
                
                return;
            }
            
            const idx = selectTask(state, action.payload.id);
            
            if (idx === false)
                return;
            
            state[idx] = {
                ...state[idx],
                ...action.payload,
            };
        },
        
        /** @param {Action<{ id: string }>} action */
        del: (state, action) => {
            const idx = selectTask(state, action.payload.id);
            
            if (idx === false)
                return;
            
            state.splice(idx, 1);
        },
        
        // /** @param {Action<{ id: string, name?: string, desc?: string }>} action */
        // update: (state, action) => {
        //     const idx = selectTask(state, action.payload.id);
            
        //     if (idx === false)
        //         return;
            
        //     state[idx] = {
        //         ...state[idx],
        //         ...action.payload,
        //     };
        // },
        
        /** @param {Action<{ id: string, complete: boolean }>} action */
        complete: (state, action) => {
            const idx = selectTask(state, action.payload.id);
            
            if (idx === false)
                return;
            
            state[idx].complete = action.payload.complete;
        },
        
        /** @param {Action<Tasks>} action */
        upload: (state, action) => {
            return action.payload;
        },
    },
});

export const { addOrUpdate, del, complete, upload } = reduxSlice.actions;
export default reduxSlice.reducer;