
import { defer, interval, map, of, switchMap, tap } from "rxjs";

import { MarketStore } from "./store";
import { poolStats } from "./api.service";
import { environment } from "./environment.prod";



const baseURL = environment.apiUrl + '/api/pools/';

export const store = new MarketStore();

const poolService = poolStats()

poolService.subscribe( message => {
  console.log(message)
  store.setDashBoard(message.pool, 'kaspa')
  console.log(store.query.getValue())
})
export const ws = new WebSocket(environment.wssUrl + '/notifications')

const poolEffort = interval(55000).pipe(switchMap(_ => poolService.pipe(tap( data => {
 store.setDashBoardEffort(  data.pool.poolEffort, 'kaspa')
  store.setTopMiner(data.pool.topMiners, 'kaspa')
})))).subscribe()



ws.onopen = () => {
  console.log('ws opened on browser')
  //ws.send('hello world')

}


