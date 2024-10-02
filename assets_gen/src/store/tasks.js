import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../utils';

/**
 * @template T
 * @typedef {import('../utils').Action<T>} Action
 */

/**
 * @typedef {{
 *  loading: boolean,
 *  tasks: {
 *   id: number,
 *   name: string,
 *   desc: string,
 *   complete: boolean,
 *  }[],
 * }} Tasks
 */

export const selectTask = (/** @type {Tasks} */ state, /** @type {number} */ id) => {
    const idx = state.tasks.findIndex(c => c.id === id);
    
    if (idx === -1)
        return false;
    
    return idx;
};

const prefix = 'tasks';

export const addOrUpdate = createAsyncThunk(`${prefix}/addOrUpdate`, async (/** @type {{ id?: number, name?: string, desc?: string }} */ payload, { getState }) => {
    if (!payload.id) {
        const body = {
            name: payload.name ?? '',
            desc: payload.desc ?? '',
            complete: false,
        };
        
        const res = await api('/task', {
            method: 'PUT',
            body: JSON.stringify(body),
        });
        
        return { ...body, id: (await res.json()).id };
    }
    
    const state = /** @type {import('../utils').reducers} */ (getState()).tasks;
    const idx = selectTask(state, payload.id);
    
    if (idx === false)
        return;
    
    const body = {
        name: payload.name ?? state.tasks[idx].name,
        desc: payload.desc ?? state.tasks[idx].desc,
    };
    
    await api(`/task/${payload.id}`, {
        method: 'POST',
        body: JSON.stringify(body),
    });
    
    return { ...body, complete: state.tasks[idx].complete, id: payload.id };
});

export const del = createAsyncThunk(`${prefix}/del`, async (/** @type {{ id: number }} */ payload, { getState }) => {
    const state = /** @type {import('../utils').reducers} */ (getState()).tasks;
    const idx = selectTask(state, payload.id);
    
    if (idx === false)
        return;
    
    await api(`/task/${payload.id}`, {
        method: 'DELETE',
    });
    
    return idx;
});

export const complete = createAsyncThunk(`${prefix}/complete`, async (/** @type {{ id: number, complete: boolean }} */ payload, { getState }) => {
    const state = /** @type {import('../utils').reducers} */ (getState()).tasks;
    const idx = selectTask(state, payload.id);
    
    if (idx === false)
        return;
    
    await api(`/task/${payload.id}/${payload.complete ? '' : 'un'}complete`, {
        method: 'POST',
    });
    
    return { idx, complete: payload.complete };
});

export const upload = createAsyncThunk(`${prefix}/upload`, async (/** @type {{ tasks: Tasks['tasks'] }} */ payload) => {
    await api(`/list`, {
        method: 'PUT',
        body: JSON.stringify(payload.tasks),
    });
    
    return payload.tasks;
});

export const getTasks = createAsyncThunk(`${prefix}/getTasks`, async () => {
    const res = await api(`/list`, {
        method: 'GET',
    });
    
    return /** @type {Tasks['tasks']} */ (await res.json());
});

export const move = createAsyncThunk(`${prefix}/move`, async (/** @type {{ sourceId: number, targetIndex: number }} */ payload) => {
    const res = await api(`/task/${payload.sourceId}/move/${payload.targetIndex}`, {
        method: 'POST',
    });
    
    // return;
    return /** @type {Tasks['tasks']} */ (await res.json());
});

export const reduxSlice = createSlice({
    name: 'tasks',
    initialState: /** @type {Tasks} */ ({ loading: false, tasks: [] }),
    reducers: {
        /** @param {Action<{ id?: number, name?: string, desc?: string }>} action */
        addOrUpdate: (state, action) => {
            if (!action.payload.id) {
                const payload = {
                    name: action.payload.name ?? '',
                    desc: action.payload.desc ?? '',
                };
                
                state.tasks.push({
                    ...payload,
                    complete: false,
                    id: state.tasks.length + 1,
                });
                
                return;
            }
            
            const idx = selectTask(state, action.payload.id);
            
            if (idx === false)
                return;
            
            state.tasks[idx] = {
                ...state.tasks[idx],
                ...action.payload,
            };
        },
        
        /** @param {Action<{ id: number }>} action */
        del: (state, action) => {
            const idx = selectTask(state, action.payload.id);
            
            if (idx === false)
                return;
            
            state.tasks.splice(idx, 1);
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
        
        /** @param {Action<{ id: number, complete: boolean }>} action */
        complete: (state, action) => {
            const idx = selectTask(state, action.payload.id);
            
            if (idx === false)
                return;
            
            state.tasks[idx].complete = action.payload.complete;
        },
        
        /** @param {Action<Tasks['tasks']>} action */
        upload: (state, action) => {
            return { ...state, tasks: action.payload };
        },
    },
    
    extraReducers: (builder) => {
        builder
            .addCase(addOrUpdate.pending, (state) => {
                state.loading = true;
            })
            .addCase(addOrUpdate.fulfilled, (state, action) => {
                if (!action.payload)
                    return;
                
                const idx = selectTask(state, action.payload.id);
                
                if (idx === false) {
                    state.tasks.push({
                        ...action.payload,
                    });
                } else {
                    state.tasks[idx] = action.payload;
                }
                
                state.loading = false;
            })
            .addCase(del.pending, (state) => {
                state.loading = true;
            })
            .addCase(del.fulfilled, (state, action) => {
                if (!action.payload)
                    return;
                
                state.tasks.splice(action.payload, 1);
                state.loading = false;
            })
            .addCase(complete.pending, (state) => {
                state.loading = true;
            })
            .addCase(complete.fulfilled, (state, action) => {
                if (!action.payload)
                    return;
                
                state.tasks[action.payload.idx].complete = action.payload.complete;
                state.loading = false;
            })
            .addCase(upload.pending, (state) => {
                state.loading = true;
            })
            .addCase(upload.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(getTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(getTasks.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
            .addCase(move.pending, (state) => {
                state.loading = true;
            })
            .addCase(move.fulfilled, (state, action) => {
                state.tasks = action.payload;
                state.loading = false;
            })
    },
});

// export const { addOrUpdate, del, complete, upload } = reduxSlice.actions;
export default reduxSlice.reducer;