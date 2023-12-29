import { createStore, createQuery, akitaDevtools, getStoreByName } from "@datorama/akita";
import * as _ from "lodash";


export interface MarketStoreState {
   pool: Ethone<string>
}

export interface Ethone<T = string> {
    kaspa: {
        topMiners: any[];
        poolStats: any;
        poolHashrate: number,
        network: {
            hashrate: number,
            difficulty: number
        }
        blocks: number
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
  setDashBoardHasrate(data: any, coin: string) {
    this.store.setLoading(true);

    this.store.update((state: any) => ({...state, pool: { ...state.pool, [`${coin}`]: {...state.pool[`${coin}`], poolStats: { ...state.pool[`${coin}`].poolStats, poolHashrate: data }}}}));
    this.store.setLoading(false);
  }
  setDashBoardEffort(data: any, coin: string) {
    this.store.setLoading(true);

    this.store.update((state: any) => ({...state, pool: { ...state.pool, [`${coin}`]: {...state.pool[`${coin}`], poolEffort: data }}}));
    this.store.setLoading(false);
  }
  setTopMiner(topMiners: any[], coin: string) {
    this.store.setLoading(true);
    this.store._setState((state: any) => ({...state, pool: { ...state.pool, [`${coin}`]: {...state.pool[`${coin}`], topMiners:  topMiners}}}))

    this.store.setLoading(false);
  }
  updateTopMiner(miner:any, coin: string) {
    this.store.setLoading(true);

    this.store._setState((state: any) => ({...state, pool: { ...state.pool, [`${coin}`]: {...state.pool[`${coin}`], topMiners:  state.pool[`${coin}`].topMiners.map( (m:any) => { if(m.miner === miner.miner) {
            const i =_.cloneDeep(m);

            return     ({...i, hashrate: miner.hashrate })
          }  else {
             return m
          }}) }}}));
    this.store.setLoading(false);
  }

  setBlock( coin: string) {
    this.store.setLoading(true);
    this.store._setState((state: any) => ({...state, pool: { ...state.pool, [`${coin}`]: {...state.pool[`${coin}`], totalBlocks: state.pool[`${coin}`].totalBlocks+1  }}}))

    this.store.setLoading(false);
  }
}


