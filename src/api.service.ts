import axios, { AxiosResponse } from "axios";
import { defer, map, of } from "rxjs";

axios.defaults.baseURL = 'https://neox-poolin.ml/api/v1/Pool-Neoxa';

export const minerList = () => defer( () => axios.get('/miners')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const poolStats = () => defer( () => axios.get('/statistics')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const miner = (wallet: string) => defer( () => axios.get('/miners/'+ wallet)).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const statistics = () => defer( () => axios.get('/statistics')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data ))

export const blocks = () => defer( () => axios.get('/blocks')).pipe(map( (axiosResponse: AxiosResponse) => axiosResponse.data.body.primary ))



export const getCoinPrice = () => {
  const headers = {
    'Content-Type': 'application/json',
    "x-api-key": "a38910e4-d5df-4d58-b481-5d2eab4cf7df",
  }

  return defer(() => axios.post('https://api.livecoinwatch.com/coins/single ', {"currency":"USD","code":"_NEOX","meta":true},{ headers })).pipe(map ((axiosResponse: AxiosResponse) => axiosResponse.data ))


}
