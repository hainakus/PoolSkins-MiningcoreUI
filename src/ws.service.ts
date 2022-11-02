import axios, { AxiosResponse } from "axios";
import { defer, map, of } from "rxjs";
import { io } from "socket.io-client";

import { PoolService } from "./poolService";
import { MarketStore } from "./store";



const baseURL = 'http://marketcloudis.ml/api/';

export const store = new MarketStore();

const socket = io('http://marketcloudis.ml:8080');

socket.on("connect", () => {
  console.log(socket.disconnected);
  setInterval( () =>  // false
  socket.emit("stats", "ethone")
  , 1500)
});

socket.on('stats', (event) => {
    console.log(event)
    store.setDashBoard(event, 'ethone');
})