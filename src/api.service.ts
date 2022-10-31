import axios, { AxiosResponse } from "axios";
import { defer, map, of } from "rxjs";
import { PoolService } from "./poolService";



axios.defaults.baseURL = 'http://localhost:8080/' + PoolService.getapi();

export const minerList = () => defer( () => axios.get('/miners')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const poolStats = () => defer( () => axios.get('/stats')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const miner = (wallet: string) => defer( () => axios.get('/accounts/'+ wallet)).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const statistics = () => defer( () => axios.get('/stats')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const blocks = () => defer( () => axios.get('/blocks')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const payments = () => defer(() => axios.get('/payments')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const getCoinPrice = () => {
  const headers = {
    'Content-Type': 'application/json',
    "x-api-key": "a38910e4-d5df-4d58-b481-5d2eab4cf7df",
  }
  let payload = {};
  (PoolService.getapi() === 'octa') ? payload = {"currency":"USD","code":"OCTA","meta":true} : payload = {"currency":"USD","code":"FIRO","meta":true};
  return defer(() => axios.post('https://api.livecoinwatch.com/coins/single ', payload,{ headers })).pipe(map ((axiosResponse: AxiosResponse) => axiosResponse.data ))


}
