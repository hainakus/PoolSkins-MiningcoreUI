import { createStore, createQuery, akitaDevtools, getStoreByName } from "@datorama/akita";
akitaDevtools();

export class MarketStore {
    store;
   query;
    constructor() {
       this.store = createStore({}, { name: 'marketplace' });
       this.query = createQuery(this.store);
    }

    setState (miners: any) {
        this.store.setLoading(true);
        window.dispatchEvent(new CustomEvent('isLoading', {'detail': true}));
        this.store._setState((state: any) => ({...state, miners: miners}));
        this.store.setLoading(false);
        window.dispatchEvent(new CustomEvent('isLoading', {'detail': false}));

    }


}


