/* eslint-disable no-console, no-underscore-dangle */

import { reactive, readonly } from 'vue';

const toArr = (ns) => ns.split('/');

function splitNs(ns) {
    const path = toArr(ns);
    const idx = path.length - 1;
    return [path.slice(0, idx), path[idx]];
}

function getParentState(state, ns) {
    const path = toArr(ns);
    const parent = path.slice(0, path.length - 1);
    return parent.reduce((acc, p) => {
        if (typeof acc[p] === 'undefined') {
            acc[p] = {};
        }
        return acc[p];
    }, state);
}

function registerModule(ns, mod, rootMutableState, modules) {
    if (modules[ns]) {
        console.warn('Module is already registered:', ns);
        return modules[ns];
    }
    const [, last] = splitNs(ns);
    const parentMutableState = getParentState(rootMutableState, ns);
    // eslint-disable-next-line no-use-before-define
    const vuexModule = Buex(mod, false);
    // eslint-disable-next-line no-param-reassign
    modules[ns] = vuexModule;
    parentMutableState[last] = vuexModule.state;
    return vuexModule;
}

function unregisterModule(ns, rootMutableState, modules) {
    if (!modules[ns]) {
        return;
    }
    const [, last] = splitNs(ns);
    const parentMutableState = getParentState(rootMutableState, ns);
    delete parentMutableState[last];
    // eslint-disable-next-line no-param-reassign
    delete modules[ns];
}

export default function Buex({ state, actions, getters } = {}, isRoot = true) {
    const normalizedState = typeof state === 'function' ? state() : (state || {});
    const mutableState = isRoot ? reactive(normalizedState) : normalizedState;
    const readonlyState = readonly(mutableState);
    const store = {
        state: readonlyState,
        dispatch: (a, p) => actions[a]({
            state: mutableState,
            dispatch: store.dispatch,
        }, p),
        getters: Object.entries(getters || {})
            .reduce((acc, [g, fn]) => Object.defineProperty(acc, g, {
                get: () => fn(readonlyState, store.getters),
            }), {}),
    };

    if (isRoot) {
        const modules = reactive({});
        Object.assign(store, {
            modules: readonly(modules),
            registerModule: (ns, mod) => registerModule(ns, mod, mutableState, modules),
            unregisterModule: (ns) => unregisterModule(ns, mutableState, modules),
        });
    }

    return store;
}
