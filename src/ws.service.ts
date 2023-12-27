
import { defer, interval, map, of, switchMap, tap } from "rxjs";

import { MarketStore } from "./store";
import { poolStats } from "./api.service";



const baseURL = 'https://api.hydranetwork.online/api/pools/';

export const store = new MarketStore();

const poolService = poolStats()

poolService.subscribe( message => {
  console.log(message)
  store.setDashBoard(message.pool, 'kaspa')
  console.log(store.query.getValue())
})
export const ws = new WebSocket('wss://api.hydranetwork.online/notifications')

const poolEffort = interval(55000).pipe(switchMap(_ => poolService.pipe(tap( data => {
 store.setDashBoardEffort( data.pool.poolEffort, 'kaspa')
  store.setTopMiner(data.pool.topMiners, 'kaspa')
})))).subscribe()



ws.onopen = () => {
  console.log('ws opened on browser')
  //ws.send('hello world')

}


