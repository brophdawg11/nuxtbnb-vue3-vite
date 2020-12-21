import { reactive, readonly, provide, inject } from 'vue';

const storeSymbol = Symbol('store');

function Vuex({ state, actions, getters }) {
    const mutableState = reactive(state);
    const readonlyState = readonly(mutableState);
    const dispatch = (a, p) => actions[a]({ state: mutableState, dispatch }, p);
    const storeGetters = Object.entries(getters)
        .reduce((acc, [g, fn]) => Object.defineProperty(acc, g, {
            get: () => fn(readonlyState, storeGetters),
        }), {});
    return {
        state: readonlyState,
        dispatch,
        getters: storeGetters,
    };
}

function createStore() {
    return Vuex({
        state: {
            maps: {
                loaded: false,
                waiting: null,
            },
        },
        actions: {
            setMapsLoaded({ state }) {
                // eslint-disable-next-line no-param-reassign
                state.maps.loaded = true;
            },
            setMapsWaiting({ state }, payload) {
                // eslint-disable-next-line no-param-reassign
                state.maps.waiting = payload;
            },
        },
        getters: {},
    });
}

export const provideStore = (app) => {
    const store = createStore();
    window.store = store;
    return app ? app.provide(storeSymbol, store) : provide(storeSymbol, store);
};

export const useStore = () => inject(storeSymbol);
