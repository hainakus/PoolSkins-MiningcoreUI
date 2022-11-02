import { createStore, createQuery, akitaDevtools, getStoreByName } from "@datorama/akita";


export interface MarketStoreState {
   pool: Ethone
}

export interface Ethone {
    ethone: {
        hashrate: number,
        network: {
            hashrate: number,
            difficulty: number
        }
    }
}

akitaDevtools();

export class MarketStore {
    store;
   query;
    constructor() {
       this.store = createStore({} as MarketStoreState, { name: 'marketplace' });
       this.query = createQuery(this.store);
    }

    setState (miners: any) {
        this.store.setLoading(true);
        window.dispatchEvent(new CustomEvent('isLoading', {'detail': true}));
        this.store.update((state: any) => ({...state, miners: miners}));
        this.store.setLoading(false);
        window.dispatchEvent(new CustomEvent('isLoading', {'detail': false}));

    }
    setDashBoard(data: any, coin: string) {
        this.store.setLoading(true);

        this.store.update((state: any) => ({...state, pool: { ...state.pool, [`${coin}`]: data}}));
        this.store.setLoading(false);
    }
        
}


