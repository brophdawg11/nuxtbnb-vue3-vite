import Buex from './buex';

export const storeSymbol = Symbol('store');

export function createStore() {
    return Buex();
}
