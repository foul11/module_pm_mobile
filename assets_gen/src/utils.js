import { useSelector as useReduxSelector } from 'react-redux'; // eslint-disable-next-line no-unused-vars
import { reducer } from './store';

export function uuidv4() {
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => // @ts-ignore
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

/** @typedef {{ [K in keyof typeof reducer]: ReturnType<typeof reducer[K]> }} reducers */

/**
 * @template T
 * @template {(state: { [K in keyof typeof reducer]: ReturnType<typeof reducer[K]> }) => T} Func
 * @param {Func} selector
 * @param {Parameters<useReduxSelector>[1]} eqFunc
 * @returns {ReturnType<Func>}
 */
export function useSelector(selector, eqFunc = undefined) {
    return /** @type {*} */ (useReduxSelector)(selector, eqFunc);
}

/**
 * @template T
 * @typedef {{
 *  type: string,
 *  payload: T
 * }} Action
 */


const APILink = new URL('/api/', 'http://10.0.2.2:3005');

/** @param {string} link */
export function apiUrl(link) {
    if (link[0] == '/')
        link = link.substring(1);
    
    const url = new URL(link, APILink);
    
    return url.toString();
}

/**
 * @param {string} link
 * @param {RequestInit} request
 */
export function api(link, request) {
    request = request ?? {};
    const method = request?.method;
    
    if (method && method.toUpperCase() != 'GET') {
        const headers = request.headers;
        const body = request.body;
        
        let isContentType = false;
        
        if (headers && body) {
            for (const [key] of Object.entries(headers)) {
                if (key.toLocaleLowerCase() == 'content-type') {
                    isContentType = true;
                }
            }
            
            if (!isContentType) // @ts-ignore
                headers['Content-Type'] = 'application/json';
        } else if (body) {
            request.headers = { 'Content-Type': 'application/json' };
        }
    }
    
    return fetch(apiUrl(link), request);
}
