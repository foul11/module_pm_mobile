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