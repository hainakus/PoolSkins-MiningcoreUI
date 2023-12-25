import axios, { AxiosResponse } from "axios";
import { defer, interval, map, of, switchMap, tap } from "rxjs";
import { io } from "socket.io-client";

import { PoolService } from "./poolService";
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
const ws = new WebSocket('ws://hydranetwork.online:4000/notifications')

const poolEffort = interval(55000).pipe(switchMap(_ => poolService.pipe(tap( data => {
 store.setDashBoardEffort( data.pool.poolEffort, 'kaspa')
  store.setTopMiner(data.pool.topMiners, 'kaspa')
})))).subscribe()

ws.onopen = () => {
  console.log('ws opened on browser')
  //ws.send('hello world')
}

ws.onmessage = (message) => {
  console.log(`message received`, message.data)
  const m = JSON.parse(message.data)
  if(m.type === 'hashrateupdated' && m.miner === null && m.poolId === 'nexa1') {
    store.setDashBoardHasrate(m.hashrate, 'kaspa')
    console.log(store.query.getValue())
  }
  if(m.type === 'hashrateupdated' && m.miner !== null && m.poolId === 'nexa1') {
    const m = JSON.parse(message.data)
    store.updateTopMiner(m, 'kaspa')
  }
}
